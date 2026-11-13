import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Minus, Plus } from 'lucide-react-native';
import CustomButton from '../../components/CustomButton';
import { useAuth } from '../../context/AuthContext';
import { movies } from '../../data/movies';
import { dates, showtimes } from '../../data/showtimes';

const MAX_TICKETS = 6;

export default function Showtimes() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // dynamic segment from /showtimes/[id]
  const { addBooking } = useAuth();

  const movie = movies.find((m) => m.id === id);

  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTime, setSelectedTime] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!movie) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Movie not found.</Text>
        <CustomButton title="BACK" onPress={() => router.back()} />
      </View>
    );
  }

  const confirmBooking = () => {
    if (selectedTime === '') {
      Alert.alert('Select a Showtime', 'Please choose a movie time first.');
      return;
    }

    const result = addBooking({ movieId: movie.id, date: selectedDate, time: selectedTime, quantity });
    if (!result.ok) {
      Alert.alert('Booking Failed', result.error);
      return;
    }

    Alert.alert(
      'Booking Confirmed',
      `${movie.title}\n${selectedDate} at ${selectedTime}\nSeats: ${result.booking.seats.join(', ')}`,
      [{ text: 'VIEW TICKETS', onPress: () => router.replace('/profile') }]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <ArrowLeft color="#FF4655" size={25} />
      </Pressable>

      <Text style={styles.heading}>SELECT SHOWTIME</Text>
      <Text style={styles.subtitle}>Choose your date, time and number of tickets.</Text>

      <View style={styles.movieCard}>
        <Image source={movie.image} style={styles.poster} resizeMode="cover" />
        <Text style={styles.movieLabel}>NOW BOOKING</Text>
        <Text style={styles.movieTitle}>{movie.title}</Text>
        <Text style={styles.details}>{movie.genre}</Text>
        <Text style={styles.details}>Duration: {movie.duration}</Text>
      </View>

      <Text style={styles.sectionTitle}>SELECT DATE</Text>
      <View style={styles.dateContainer}>
        {dates.map((date) => (
          <Pressable
            key={date}
            style={[styles.dateButton, selectedDate === date && styles.selectedButton]}
            onPress={() => setSelectedDate(date)}
          >
            <Text style={styles.buttonText}>{date}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>AVAILABLE SHOWTIMES</Text>
      <View style={styles.timeContainer}>
        {showtimes.map((time) => (
          <Pressable
            key={time}
            style={[styles.timeButton, selectedTime === time && styles.selectedButton]}
            onPress={() => setSelectedTime(time)}
          >
            <Text style={styles.buttonText}>{time}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>NUMBER OF TICKETS</Text>
      <View style={styles.quantityRow}>
        <Pressable style={styles.quantityButton} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
          <Minus color="#FFFFFF" size={20} />
        </Pressable>
        <Text style={styles.quantityText}>{quantity}</Text>
        <Pressable
          style={styles.quantityButton}
          onPress={() => setQuantity(Math.min(MAX_TICKETS, quantity + 1))}
        >
          <Plus color="#FFFFFF" size={20} />
        </Pressable>
      </View>
      <Text style={styles.note}>Seats are assigned automatically.</Text>

      <CustomButton title="CONFIRM BOOKING" onPress={confirmBooking} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#101113' },
  content: { padding: 20, paddingTop: 55, paddingBottom: 40 },
  back: { marginBottom: 20, alignSelf: 'flex-start' },
  heading: { color: '#FFFFFF', fontSize: 26, fontWeight: '900', letterSpacing: 2 },
  subtitle: { color: '#AAAAAA', marginTop: 8, marginBottom: 25 },
  movieCard: { backgroundColor: '#1C1D21', borderLeftWidth: 4, borderLeftColor: '#FF4655', padding: 18, borderRadius: 5 },
  poster: { width: '100%', height: 200, borderRadius: 6, marginBottom: 14 },
  movieLabel: { color: '#FF4655', fontWeight: 'bold', fontSize: 11, marginBottom: 10, letterSpacing: 1 },
  movieTitle: { color: '#FFFFFF', fontSize: 21, fontWeight: 'bold', marginBottom: 10 },
  details: { color: '#AAAAAA', fontSize: 13, marginTop: 4 },
  sectionTitle: { color: '#FF4655', fontSize: 16, fontWeight: '900', letterSpacing: 1, marginTop: 30, marginBottom: 15 },
  dateContainer: { flexDirection: 'row', gap: 10 },
  dateButton: {
    flex: 1, paddingVertical: 14, paddingHorizontal: 8, alignItems: 'center',
    backgroundColor: '#1C1D21', borderWidth: 1, borderColor: '#444444', borderRadius: 5,
  },
  timeContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  timeButton: {
    paddingVertical: 14, paddingHorizontal: 18, backgroundColor: '#1C1D21',
    borderWidth: 1, borderColor: '#444444', borderRadius: 5,
  },
  selectedButton: { backgroundColor: '#FF4655', borderColor: '#FF4655' },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold' },
  quantityRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  quantityButton: {
    width: 44, height: 44, borderRadius: 5, backgroundColor: '#1C1D21',
    borderWidth: 1, borderColor: '#444444', alignItems: 'center', justifyContent: 'center',
  },
  quantityText: { color: '#FFFFFF', fontSize: 22, fontWeight: '900', minWidth: 30, textAlign: 'center' },
  note: { color: '#888888', fontSize: 12, marginTop: 10 },
  notFound: { flex: 1, backgroundColor: '#101113', justifyContent: 'center', padding: 30 },
  notFoundText: { color: '#FFFFFF', fontSize: 18, textAlign: 'center' },
});