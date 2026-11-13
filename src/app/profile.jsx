import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, CalendarDays, Camera, Clock3, Film, Ticket, User } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { movies } from '../data/movies';

const getMovie = (id) => movies.find((m) => m.id === id);

export default function Profile() {
  const router = useRouter();
  const { user, myBookings, myTickets, logout, updateUser } = useAuth();

  if (!user) return null;

  const uniqueMovies = new Set(myBookings.map((b) => b.movieId)).size;

  // Pick a square photo from the gallery and save it as the avatar
  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.3,
      base64: true,
    });
    if (result.canceled) return;
    updateUser({ avatar: `data:image/jpeg;base64,${result.assets[0].base64}` });
  };

  const changePhoto = () => {
    const buttons = [{ text: 'Choose from gallery', onPress: pickPhoto }];
    if (user.avatar) {
      buttons.push({ text: 'Remove photo', style: 'destructive', onPress: () => updateUser({ avatar: null }) });
    }
    buttons.push({ text: 'Cancel', style: 'cancel' });
    Alert.alert('Profile Photo', 'Change your profile picture', buttons);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: () => {
          logout();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <ArrowLeft size={24} color="#FF4655" onPress={() => router.back()} />
          <Text style={styles.logo}>CINEMA</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.profileCard}>
          <Pressable style={styles.avatarWrap} onPress={changePhoto}>
            <View style={styles.avatar}>
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
              ) : (
                <User size={34} color="#FF4655" />
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
            <Ticket size={22} color="#FF4655" />
            <Text style={styles.statNumber}>{myTickets.length}</Text>
            <Text style={styles.statLabel}>TICKETS</Text>
          </View>
          <View style={styles.statCard}>
            <Film size={22} color="#FF4655" />
            <Text style={styles.statNumber}>{uniqueMovies}</Text>
            <Text style={styles.statLabel}>MOVIES</Text>
          </View>
        </View>

        {/* Bookings */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>MY BOOKINGS</Text>
          <Text style={styles.countText}>{myBookings.length} BOOKINGS</Text>
        </View>

        {myBookings.length === 0 && <Text style={styles.empty}>No bookings yet.</Text>}

        {myBookings.map((booking) => (
          <View key={booking.id} style={styles.bookingCard}>
            <View style={styles.bookingTop}>
              <View style={styles.movieIcon}>
                <Film size={21} color="#FF4655" />
              </View>
              <View style={styles.movieInfo}>
                <Text style={styles.movieTitle}>{getMovie(booking.movieId)?.title ?? 'Unknown movie'}</Text>
                <Text style={styles.bookingStatus}>{booking.status}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.bookingDetails}>
              <View style={styles.detailRow}>
                <CalendarDays size={16} color="#AAAAAA" />
                <Text style={styles.detailText}>{booking.date}</Text>
              </View>
              <View style={styles.detailRow}>
                <Clock3 size={16} color="#AAAAAA" />
                <Text style={styles.detailText}>{booking.time}</Text>
              </View>
              <View style={styles.seatPill}>
                <Text style={styles.seatText}>SEATS {booking.seats.join(', ')}</Text>
              </View>
            </View>
          </View>
        ))}

        {/* Tickets */}
        <View style={[styles.sectionHeader, { marginTop: 16 }]}>
          <Text style={styles.sectionTitle}>MY TICKETS</Text>
          <Text style={styles.countText}>{myTickets.length} TICKETS</Text>
        </View>

        {myTickets.length === 0 && <Text style={styles.empty}>No tickets yet.</Text>}

        {myTickets.map((ticket) => (
          <View key={ticket.id} style={styles.ticketRow}>
            <Ticket size={20} color="#FF4655" />
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#101113' },
  content: { padding: 22, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  logo: { color: '#FF4655', fontSize: 24, fontWeight: '900', letterSpacing: 3 },
  profileCard: { alignItems: 'center', backgroundColor: '#1C1D21', borderRadius: 12, padding: 24, marginBottom: 16 },
  avatarWrap: { marginBottom: 14 },
  avatar: {
    width: 76, height: 76, borderRadius: 38, backgroundColor: '#292A30', borderWidth: 1,
    borderColor: '#FF4655', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
  cameraBadge: {
    position: 'absolute', right: -2, bottom: -2, width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#FF4655', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#1C1D21',
  },
  name: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' },
  email: { color: '#AAAAAA', fontSize: 14, marginTop: 5 },
  memberBadge: { backgroundColor: '#332024', borderRadius: 20, paddingVertical: 7, paddingHorizontal: 12, marginTop: 14 },
  memberText: { color: '#FF4655', fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  statCard: { flex: 1, alignItems: 'center', backgroundColor: '#1C1D21', borderRadius: 10, paddingVertical: 18 },
  statNumber: { color: '#FFFFFF', fontSize: 24, fontWeight: '900', marginTop: 8 },
  statLabel: { color: '#888888', fontSize: 10, fontWeight: 'bold', letterSpacing: 1.5, marginTop: 3 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  sectionTitle: { color: '#FF4655', fontSize: 16, fontWeight: '900', letterSpacing: 2 },
  countText: { color: '#888888', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  empty: { color: '#888888', textAlign: 'center', paddingVertical: 16 },
  bookingCard: { backgroundColor: '#1C1D21', borderRadius: 10, padding: 16, marginBottom: 12 },
  bookingTop: { flexDirection: 'row', alignItems: 'center' },
  movieIcon: { width: 42, height: 42, borderRadius: 8, backgroundColor: '#292A30', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  movieInfo: { flex: 1 },
  movieTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
  bookingStatus: { color: '#FF4655', fontSize: 10, fontWeight: 'bold', letterSpacing: 1, marginTop: 5 },
  divider: { height: 1, backgroundColor: '#33343A', marginVertical: 14 },
  bookingDetails: { gap: 10 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  detailText: { color: '#AAAAAA', fontSize: 12 },
  seatPill: { alignSelf: 'flex-start', backgroundColor: '#292A30', borderRadius: 5, paddingVertical: 6, paddingHorizontal: 9, marginTop: 2 },
  seatText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  ticketRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#1C1D21',
    borderLeftWidth: 4, borderLeftColor: '#FF4655', borderRadius: 6, padding: 14, marginBottom: 10,
  },
  ticketTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold', marginBottom: 3 },
  ticketCode: { color: '#FF4655', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  backButton: { borderWidth: 1, borderColor: '#3A3B40', borderRadius: 6, padding: 14, marginTop: 12, alignItems: 'center' },
  backText: { color: '#AAAAAA', fontSize: 12, fontWeight: 'bold', letterSpacing: 1.5 },
  logoutButton: { alignItems: 'center', borderWidth: 1, borderColor: '#FF4655', borderRadius: 6, padding: 14, marginTop: 12 },
  logoutText: { color: '#FF4655', fontSize: 12, fontWeight: 'bold', letterSpacing: 1.5 },
});