import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CalendarDays,
  Clock3,
  Film,
  Ticket,
  User,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();

  const bookings = [
    {
      id: '1',
      movie: 'Spider-Man: Brand New Day',
      date: 'Saturday, 27 September',
      time: '7:30 PM',
      seats: 'F5, F6',
      status: 'UPCOMING',
    },
    {
      id: '2',
      movie: 'Toy Story 5',
      date: 'Sunday, 14 September',
      time: '2:00 PM',
      seats: 'C3, C4',
      status: 'WATCHED',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>CINEMA</Text>
          <Text style={styles.headerLabel}>MY PROFILE</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <User size={34} color="#FF4655" />
          </View>

          <Text style={styles.name}>Lyan Marc</Text>
          <Text style={styles.email}>lyan@example.com</Text>

          <View style={styles.memberBadge}>
            <Text style={styles.memberText}>CINEMA MEMBER</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ticket size={22} color="#FF4655" />
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>TICKETS</Text>
          </View>

          <View style={styles.statCard}>
            <Film size={22} color="#FF4655" />
            <Text style={styles.statNumber}>6</Text>
            <Text style={styles.statLabel}>MOVIES</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>MY BOOKINGS</Text>
          <Text style={styles.bookingCount}>2 BOOKINGS</Text>
        </View>

        {bookings.map((booking) => (
          <View key={booking.id} style={styles.bookingCard}>
            <View style={styles.bookingTop}>
              <View style={styles.movieIcon}>
                <Film size={21} color="#FF4655" />
              </View>

              <View style={styles.movieInfo}>
                <Text style={styles.movieTitle}>{booking.movie}</Text>
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
                <Text style={styles.seatText}>SEATS {booking.seats}</Text>
              </View>
            </View>
          </View>
        ))}

        <Text
          style={styles.backButton}
          onPress={() => router.push('/movies')}
        >
          BACK TO MOVIES
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101113',
  },

  content: {
    padding: 22,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },

  logo: {
    color: '#FF4655',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 3,
  },

  headerLabel: {
    color: '#AAAAAA',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 2,
  },

  profileCard: {
    alignItems: 'center',
    backgroundColor: '#1C1D21',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
  },

  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#292A30',
    borderWidth: 1,
    borderColor: '#FF4655',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  name: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },

  email: {
    color: '#AAAAAA',
    fontSize: 14,
    marginTop: 5,
  },

  memberBadge: {
    backgroundColor: '#332024',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 12,
    marginTop: 14,
  },

  memberText: {
    color: '#FF4655',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },

  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1C1D21',
    borderRadius: 10,
    paddingVertical: 18,
  },

  statNumber: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 8,
  },

  statLabel: {
    color: '#888888',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginTop: 3,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  sectionTitle: {
    color: '#FF4655',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
  },

  bookingCount: {
    color: '#888888',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  bookingCard: {
    backgroundColor: '#1C1D21',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },

  bookingTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  movieIcon: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#292A30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  movieInfo: {
    flex: 1,
  },

  movieTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  bookingStatus: {
    color: '#FF4655',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 5,
  },

  divider: {
    height: 1,
    backgroundColor: '#33343A',
    marginVertical: 14,
  },

  bookingDetails: {
    gap: 10,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  detailText: {
    color: '#AAAAAA',
    fontSize: 12,
  },

  seatPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#292A30',
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 9,
    marginTop: 2,
  },

  seatText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  backButton: {
    color: '#AAAAAA',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#3A3B40',
    borderRadius: 6,
    padding: 14,
    marginTop: 12,
  },
});