import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { users as seedUsers } from '../data/users';
import { bookings as seedBookings } from '../data/bookings';
import { tickets as seedTickets } from '../data/tickets';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// Seats A1..H10 (auto-assigned in this order)
const ALL_SEATS = 'ABCDEFGH'.split('').flatMap((row) =>
  Array.from({ length: 10 }, (_, i) => `${row}${i + 1}`)
);

const load = async (key, fallback) => {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export function AuthProvider({ children }) {
  const [loaded, setLoaded] = useState(false);
  const [users, setUsers] = useState(seedUsers);
  const [bookings, setBookings] = useState(seedBookings);
  const [tickets, setTickets] = useState(seedTickets);
  const [user, setUser] = useState(null);
  const [pendingUser, setPendingUser] = useState(null);

  // Restore saved data and session on app start
  useEffect(() => {
    (async () => {
      const savedUsers = await load('users', seedUsers);
      const savedBookings = await load('bookings', seedBookings);
      const savedTickets = await load('tickets', seedTickets);
      const sessionId = await load('session', null);

      setUsers(savedUsers);
      setBookings(savedBookings);
      setTickets(savedTickets);
      setUser(savedUsers.find((u) => u.id === sessionId) ?? null);
      setLoaded(true);
    })();
  }, []);

  // Save changes
  useEffect(() => {
    if (loaded) AsyncStorage.setItem('users', JSON.stringify(users));
  }, [users, loaded]);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem('bookings', JSON.stringify(bookings));
  }, [bookings, loaded]);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem('tickets', JSON.stringify(tickets));
  }, [tickets, loaded]);

  useEffect(() => {
    if (!loaded) return;
    if (user) AsyncStorage.setItem('session', JSON.stringify(user.id));
    else AsyncStorage.removeItem('session');
  }, [user, loaded]);

  const login = (email, password) => {
    const found = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!found) return { ok: false, error: 'Incorrect email or password.' };
    setUser(found);
    return { ok: true };
  };

  const logout = () => setUser(null);

  // Step 1 of signup (before OTP)
  const startSignup = ({ name, email, password }) => {
    const exists = users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (exists) return { ok: false, error: 'An account with this email already exists.' };
    setPendingUser({ name: name.trim(), email: email.trim(), password });
    return { ok: true };
  };

  // Step 2 of signup (after OTP is verified)
  const completeSignup = () => {
    if (!pendingUser) return false;
    const newUser = {
      id: `u${Date.now()}`,
      ...pendingUser,
      memberSince: String(new Date().getFullYear()),
    };
    setUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    setPendingUser(null);
    return true;
  };

  // Creates a booking and its tickets with auto-assigned seats
  const addBooking = ({ movieId, date, time, quantity }) => {
    const taken = bookings
      .filter((b) => b.movieId === movieId && b.date === date && b.time === time)
      .flatMap((b) => b.seats);
    const free = ALL_SEATS.filter((seat) => !taken.includes(seat));

    if (free.length < quantity) {
      return { ok: false, error: 'Not enough seats left for this showtime.' };
    }

    const seats = free.slice(0, quantity);
    const id = `b${Date.now()}`;
    const booking = { id, userId: user.id, movieId, date, time, seats, status: 'UPCOMING' };
    const newTickets = seats.map((seat) => ({
      id: `${id}-${seat}`,
      bookingId: id,
      userId: user.id,
      movieId,
      seat,
      code: `MM${id.slice(-5)}${seat}`,
    }));

    setBookings((prev) => [booking, ...prev]);
    setTickets((prev) => [...newTickets, ...prev]);
    return { ok: true, booking };
  };

  // Updates the current user (e.g. profile photo) and saves it
  const updateUser = (changes) => {
    const updated = { ...user, ...changes };
    setUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  const myBookings = user ? bookings.filter((b) => b.userId === user.id) : [];
  const myTickets = user ? tickets.filter((t) => t.userId === user.id) : [];

  // Wait until saved data is loaded so screens never flash the wrong state
  if (!loaded) return null;

  return (
    <AuthContext.Provider
      value={{ user, myBookings, myTickets, login, logout, startSignup, completeSignup, addBooking, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}