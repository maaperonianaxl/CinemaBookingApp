
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../app/lib/supabase';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// ---- database rows -> app objects ----
const toUser = (r, authCreatedAt = null) => ({
  id: r.id,
  name: r.name,
  email: r.email,
  avatar: r.avatar,
  memberSince: authCreatedAt || r.created_at || r.member_since,
});

const toBooking = (r) => ({
  id: r.id,
  movieId: r.movie_id,
  date: r.show_date,
  time: r.show_time,
  seats: r.seats,
  status: r.status,
});

const toTicket = (r) => ({
  id: r.id,
  bookingId: r.booking_id,
  movieId: r.movie_id,
  seat: r.seat,
  code: r.code,
});

// ---- readable error messages ----
const friendly = (error) => {
  const message = error?.message ?? '';

  if (message.includes('Invalid login credentials')) return 'Incorrect email or password.';
  if (message.includes('already registered')) return 'An account with this email already exists.';
  if (message.includes('SEAT_TAKEN')) return 'One of those seats was just taken. Please choose other seats.';
  if (message.includes('BOOKING_NOT_FOUND')) return 'This booking can no longer be cancelled.';
  if (message.includes('Network request failed')) return 'No internet connection. Please try again.';

  return message || 'Something went wrong. Please try again.';
};

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [pendingUser, setPendingUser] = useState(null);

  const clearData = () => {
    setUser(null);
    setBookings([]);
    setTickets([]);
  };

  // Loads the profile, bookings and tickets of a signed-in user
  const loadUserData = async (authId) => {
    const [
      profile,
      bookingsResult,
      ticketsResult,
      authResult,
    ] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', authId).single(),
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('tickets').select('*').order('created_at', { ascending: false }),
      supabase.auth.getUser(),
    ]);

    if (profile.error) throw profile.error;
    if (bookingsResult.error) throw bookingsResult.error;
    if (ticketsResult.error) throw ticketsResult.error;
    if (authResult.error) throw authResult.error;

    const authCreatedAt = authResult.data.user?.created_at || null;

    setBookings(bookingsResult.data.map(toBooking));
    setTickets(ticketsResult.data.map(toTicket));
    setUser(toUser(profile.data, authCreatedAt));
  };

  // Restore saved session when app starts
  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();

        if (data.session) {
          await loadUserData(data.session.user.id);
        }
      } catch (e) {
        await supabase.auth.signOut().catch(() => {});
        clearData();
      }

      if (active) setLoading(false);
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') clearData();
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // ---------- Authentication ----------
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) return { ok: false, error: friendly(error) };

    try {
      await loadUserData(data.user.id);
      return { ok: true };
    } catch (e) {
      await supabase.auth.signOut().catch(() => {});
      return { ok: false, error: friendly(e) };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut().catch(() => {});
    clearData();
  };

  // Step 1: Keep form data until OTP step is done
  const startSignup = ({ name, email, password }) => {
    setPendingUser({
      name: name.trim(),
      email: email.trim(),
      password,
    });
  };

  // Step 2: Create account
  const completeSignup = async () => {
    if (!pendingUser) {
      return { ok: false, error: 'Please sign up again.' };
    }

    const { data, error } = await supabase.auth.signUp({
      email: pendingUser.email,
      password: pendingUser.password,
      options: {
        data: { name: pendingUser.name },
      },
    });

    if (error) return { ok: false, error: friendly(error) };

    if (!data.session) {
      return {
        ok: false,
        error: 'Email confirmation is still ON in Supabase. Turn it off (see README) and try again.',
      };
    }

    try {
      await loadUserData(data.user.id);
      setPendingUser(null);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: friendly(e) };
    }
  };

  // ---------- Profile ----------
  const updateProfile = async (changes) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(changes)
      .eq('id', user.id)
      .select()
      .single();

    if (error) return { ok: false, error: friendly(error) };

    const { data: authData } = await supabase.auth.getUser();

    setUser(toUser(data, authData.user?.created_at || null));

    return { ok: true };
  };

  const changePassword = async (currentPassword, newPassword) => {
    const check = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (check.error) {
      return { ok: false, error: 'Your current password is incorrect.' };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) return { ok: false, error: friendly(error) };

    return { ok: true };
  };

  // Reload everything
  const refresh = async () => {
    try {
      await loadUserData(user.id);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: friendly(e) };
    }
  };

  // ---------- Seats and bookings ----------
  const getTakenSeats = async (movieId, date, time) => {
    const { data, error } = await supabase.rpc('taken_seats', {
      p_movie: movieId,
      p_date: date,
      p_time: time,
    });

    if (error) return { ok: false, error: friendly(error) };

    return {
      ok: true,
      seats: data.map((row) => row.seat),
    };
  };

  const bookSeats = async ({ movieId, date, time, seats }) => {
    const { error } = await supabase.rpc('book_seats', {
      p_movie: movieId,
      p_date: date,
      p_time: time,
      p_seats: seats,
    });

    if (error) {
      return {
        ok: false,
        error: friendly(error),
        seatTaken: (error.message ?? '').includes('SEAT_TAKEN'),
      };
    }

    await refresh();
    return { ok: true };
  };

  const cancelBooking = async (bookingId) => {
    const { error } = await supabase.rpc('cancel_booking', {
      p_booking: bookingId,
    });

    if (error) return { ok: false, error: friendly(error) };

    await refresh();
    return { ok: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        myBookings: bookings,
        myTickets: tickets,
        login,
        logout,
        startSignup,
        completeSignup,
        updateProfile,
        changePassword,
        refresh,
        getTakenSeats,
        bookSeats,
        cancelBooking,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
