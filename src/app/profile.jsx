import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ArrowLeft, CalendarDays, Camera, Clock3, Film, Settings, Ticket, User } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { movies } from '../data/movies';
import { formatDate, getStatus } from '../app/utils/dates';

const getMovie = (id) => movies.find((m) => m.id === id);

export default function Profile() {
  const router = useRouter();
  const { user, myBookings, myTickets, logout, updateProfile, cancelBooking, refresh } = useAuth();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [refreshing, setRefreshing] = useState(false);
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  if (!user) return null;

  const uniqueMovies = new Set(myBookings.filter((b) => b.status === 'ACTIVE').map((b) => b.movieId)).size;

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  // ---------- Profile photo ----------
  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.3,
      base64: true,
    });
    if (result.canceled) return;

    setSavingPhoto(true);
    const saved = await updateProfile({ avatar: `data:image/jpeg;base64,${result.assets[0].base64}` });
    setSavingPhoto(false);
    if (!saved.ok) Alert.alert('Error', saved.error);
  };

  const removePhoto = async () => {
    setSavingPhoto(true);
    const saved = await updateProfile({ avatar: null });
    setSavingPhoto(false);
    if (!saved.ok) Alert.alert('Error', saved.error);
  };

  const changePhoto = () => {
    const buttons = [{ text: 'Choose from gallery', onPress: pickPhoto }];
    if (user.avatar) buttons.push({ text: 'Remove photo', style: 'destructive', onPress: removePhoto });
    buttons.push({ text: 'Cancel', style: 'cancel' });
    Alert.alert('Profile Photo', 'Change your profile picture', buttons);
  };

  // ---------- Cancel booking ----------
  const handleCancel = (booking) => {
    const title = getMovie(booking.movieId)?.title ?? 'this movie';
    Alert.alert(
      'Cancel booking',
      `Cancel ${title} on ${formatDate(booking.date)} at ${booking.time}? Your seats will be released.`,
      [
        { text: 'Keep booking', style: 'cancel' },
        {
          text: 'Cancel booking',
          style: 'destructive',
          onPress: async () => {
            setCancellingId(booking.id);
            const result = await cancelBooking(booking.id);
            setCancellingId(null);
            if (!result.ok) Alert.alert('Error', result.error);
          },
        },
      ]
    );
  };

  // ---------- Logout ----------
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () => logout() }, // the app returns to the welcome screen automatically
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} colors={[colors.accent]} />}
      >
        <View style={styles.header}>
          <ArrowLeft size={24} color={colors.accent} onPress={() => router.back()} />
          <Text style={styles.logo}>CINEMA</Text>
          <Settings size={24} color={colors.accent} onPress={() => router.push('/settings')} />
        </View>

        <View style={styles.profileCard}>
          <Pressable style={styles.avatarWrap} onPress={changePhoto} disabled={savingPhoto}>
            <View style={styles.avatar}>
              {savingPhoto ? (
                <ActivityIndicator color={colors.accent} />
              ) : user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
              ) : (
                <User size={34} color={colors.accent} />
              )}
            </View>
            <View style={styles.cameraBadge}>
              <Camera size={14} color="#FFFFFF" />
            </View>
          </Pressable>

          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.memberBadge}>
            <Text style={styles.memberText}>CINEMA MEMBER SINCE {user.memberSince}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ticket size={22} color={colors.accent} />
            <Text style={styles.statNumber}>{myTickets.length}</Text>
            <Text style={styles.statLabel}>TICKETS</Text>
          </View>
          <View style={styles.statCard}>
            <Film size={22} color={colors.accent} />
            <Text style={styles.statNumber}>{uniqueMovies}</Text>
            <Text style={styles.statLabel}>MOVIES</Text>
          </View>
        </View>

        {/* Bookings */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>MY BOOKINGS</Text>
          <Text style={styles.countText}>{myBookings.length} BOOKINGS</Text>
        </View>

        {myBookings.length === 0 && <Text style={styles.empty}>No bookings yet. Pick a movie and book your seats!</Text>}

        {myBookings.map((booking) => {
          const status = getStatus(booking);
          const cancelled = status === 'CANCELLED';
          return (
            <View key={booking.id} style={[styles.bookingCard, cancelled && { opacity: 0.6 }]}>
              <View style={styles.bookingTop}>
                <View style={styles.movieIcon}>
                  <Film size={21} color={colors.accent} />
                </View>
                <View style={styles.movieInfo}>
                  <Text style={[styles.movieTitle, cancelled && styles.strike]}>{getMovie(booking.movieId)?.title ?? 'Unknown movie'}</Text>
                  <Text style={[styles.bookingStatus, status !== 'UPCOMING' && { color: colors.textDim }]}>{status}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.bookingDetails}>
                <View style={styles.detailRow}>
                  <CalendarDays size={16} color={colors.textMuted} />
                  <Text style={styles.detailText}>{formatDate(booking.date)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Clock3 size={16} color={colors.textMuted} />
                  <Text style={styles.detailText}>{booking.time}</Text>
                </View>
                <View style={styles.seatPill}>
                  <Text style={styles.seatText}>SEATS {booking.seats.join(', ')}</Text>
                </View>
              </View>

              {status === 'UPCOMING' && (
                <Pressable style={styles.cancelButton} onPress={() => handleCancel(booking)} disabled={cancellingId === booking.id}>
                  {cancellingId === booking.id ? (
                    <ActivityIndicator color={colors.accent} />
                  ) : (
                    <Text style={styles.cancelText}>CANCEL BOOKING</Text>
                  )}
                </Pressable>
              )}
            </View>
          );
        })}

        {/* Tickets */}
        <View style={[styles.sectionHeader, { marginTop: 16 }]}>
          <Text style={styles.sectionTitle}>MY TICKETS</Text>
          <Text style={styles.countText}>{myTickets.length} TICKETS</Text>
        </View>

        {myTickets.length === 0 && <Text style={styles.empty}>No active tickets.</Text>}

        {myTickets.map((ticket) => (
          <View key={ticket.id} style={styles.ticketRow}>
            <Ticket size={20} color={colors.accent} />
            <View style={styles.movieInfo}>
              <Text style={styles.ticketTitle}>{getMovie(ticket.movieId)?.title ?? 'Unknown movie'}</Text>
              <Text style={styles.detailText}>Seat {ticket.seat}</Text>
            </View>
            <Text style={styles.ticketCode}>{ticket.code}</Text>
          </View>
        ))}

        <Pressable style={styles.backButton} onPress={() => router.replace('/movies')}>
          <Text style={styles.backText}>BACK TO MOVIES</Text>
        </Pressable>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>LOG OUT</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (c) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    content: { padding: 22, paddingBottom: 40 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
    logo: { color: c.accent, fontSize: 24, fontWeight: '900', letterSpacing: 3 },
    profileCard: { alignItems: 'center', backgroundColor: c.card, borderRadius: 12, padding: 24, marginBottom: 16 },
    avatarWrap: { marginBottom: 14 },
    avatar: {
      width: 76, height: 76, borderRadius: 38, backgroundColor: c.cardAlt, borderWidth: 1,
      borderColor: c.accent, alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    },
    avatarImage: { width: '100%', height: '100%' },
    cameraBadge: {
      position: 'absolute', right: -2, bottom: -2, width: 26, height: 26, borderRadius: 13,
      backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: c.card,
    },
    name: { color: c.text, fontSize: 22, fontWeight: 'bold' },
    email: { color: c.textMuted, fontSize: 14, marginTop: 5 },
    memberBadge: { backgroundColor: c.accentSoft, borderRadius: 20, paddingVertical: 7, paddingHorizontal: 12, marginTop: 14 },
    memberText: { color: c.accent, fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
    statsRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
    statCard: { flex: 1, alignItems: 'center', backgroundColor: c.card, borderRadius: 10, paddingVertical: 18 },
    statNumber: { color: c.text, fontSize: 24, fontWeight: '900', marginTop: 8 },
    statLabel: { color: c.textDim, fontSize: 10, fontWeight: 'bold', letterSpacing: 1.5, marginTop: 3 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
    sectionTitle: { color: c.accent, fontSize: 16, fontWeight: '900', letterSpacing: 2 },
    countText: { color: c.textDim, fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
    empty: { color: c.textDim, textAlign: 'center', paddingVertical: 16 },
    bookingCard: { backgroundColor: c.card, borderRadius: 10, padding: 16, marginBottom: 12 },
    bookingTop: { flexDirection: 'row', alignItems: 'center' },
    movieIcon: { width: 42, height: 42, borderRadius: 8, backgroundColor: c.cardAlt, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    movieInfo: { flex: 1 },
    movieTitle: { color: c.text, fontSize: 15, fontWeight: 'bold' },
    strike: { textDecorationLine: 'line-through' },
    bookingStatus: { color: c.accent, fontSize: 10, fontWeight: 'bold', letterSpacing: 1, marginTop: 5 },
    divider: { height: 1, backgroundColor: c.divider, marginVertical: 14 },
    bookingDetails: { gap: 10 },
    detailRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
    detailText: { color: c.textMuted, fontSize: 12 },
    seatPill: { alignSelf: 'flex-start', backgroundColor: c.cardAlt, borderRadius: 5, paddingVertical: 6, paddingHorizontal: 9, marginTop: 2 },
    seatText: { color: c.text, fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
    cancelButton: {
      minHeight: 42, marginTop: 14, borderWidth: 1, borderColor: c.accent, borderRadius: 6,
      alignItems: 'center', justifyContent: 'center',
    },
    cancelText: { color: c.accent, fontSize: 11, fontWeight: 'bold', letterSpacing: 1.5 },
    ticketRow: {
      flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: c.card,
      borderLeftWidth: 4, borderLeftColor: c.accent, borderRadius: 6, padding: 14, marginBottom: 10,
    },
    ticketTitle: { color: c.text, fontSize: 14, fontWeight: 'bold', marginBottom: 3 },
    ticketCode: { color: c.accent, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
    backButton: { borderWidth: 1, borderColor: c.border, borderRadius: 6, padding: 14, marginTop: 12, alignItems: 'center' },
    backText: { color: c.textMuted, fontSize: 12, fontWeight: 'bold', letterSpacing: 1.5 },
    logoutButton: { alignItems: 'center', borderWidth: 1, borderColor: c.accent, borderRadius: 6, padding: 14, marginTop: 12 },
    logoutText: { color: c.accent, fontSize: 12, fontWeight: 'bold', letterSpacing: 1.5 },
  });