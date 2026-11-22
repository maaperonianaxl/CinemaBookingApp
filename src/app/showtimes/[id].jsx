import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import CustomButton from '../../components/CustomButton';
import { useTheme } from '../../context/ThemeContext';
import { movies } from '../../data/movies';
import { showtimes } from '../../data/showtimes';
import { getShowDates } from '../utils/dates';

export default function Showtimes() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // dynamic segment from /showtimes/[id]
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const movie = movies.find((m) => m.id === id);
  const dates = useMemo(() => getShowDates(7), []);

  const [selectedDate, setSelectedDate] = useState(dates[0].value);
  const [selectedTime, setSelectedTime] = useState('');

  if (!movie) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Movie not found.</Text>
        <CustomButton title="BACK" onPress={() => router.back()} />
      </View>
    );
  }

  const chooseSeats = () => {
    router.push({
      pathname: '/seats/[id]',
      params: { id: movie.id, date: selectedDate, time: selectedTime },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <ArrowLeft color={colors.accent} size={25} />
      </Pressable>

      <Text style={styles.heading}>SELECT SHOWTIME</Text>
      <Text style={styles.subtitle}>Choose your date and time, then pick your seats.</Text>

      <View style={styles.movieCard}>
        <Image source={movie.image} style={styles.poster} resizeMode="cover" />
        <Text style={styles.movieLabel}>NOW BOOKING</Text>
        <Text style={styles.movieTitle}>{movie.title}</Text>
        <Text style={styles.details}>{movie.genre}</Text>
        <Text style={styles.details}>Duration: {movie.duration}</Text>
      </View>

      <Text style={styles.sectionTitle}>SELECT DATE</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateContainer}>
        {dates.map((date) => (
          <Pressable
            key={date.value}
            style={[styles.dateButton, selectedDate === date.value && styles.selectedButton]}
            onPress={() => setSelectedDate(date.value)}
          >
            <Text style={[styles.buttonText, selectedDate === date.value && styles.selectedText]}>{date.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>AVAILABLE SHOWTIMES</Text>
      <View style={styles.timeContainer}>
        {showtimes.map((time) => (
          <Pressable
            key={time}
            style={[styles.timeButton, selectedTime === time && styles.selectedButton]}
            onPress={() => setSelectedTime(time)}
          >
            <Text style={[styles.buttonText, selectedTime === time && styles.selectedText]}>{time}</Text>
          </Pressable>
        ))}
      </View>

      <CustomButton title="CHOOSE SEATS" onPress={chooseSeats} disabled={selectedTime === ''} />
    </ScrollView>
  );
}

const makeStyles = (c) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    content: { padding: 20, paddingTop: 55, paddingBottom: 40 },
    back: { marginBottom: 20, alignSelf: 'flex-start' },
    heading: { color: c.text, fontSize: 26, fontWeight: '900', letterSpacing: 2 },
    subtitle: { color: c.textMuted, marginTop: 8, marginBottom: 25 },
    movieCard: { backgroundColor: c.card, borderLeftWidth: 4, borderLeftColor: c.accent, padding: 18, borderRadius: 5 },
    poster: { width: '100%', height: 200, borderRadius: 6, marginBottom: 14 },
    movieLabel: { color: c.accent, fontWeight: 'bold', fontSize: 11, marginBottom: 10, letterSpacing: 1 },
    movieTitle: { color: c.text, fontSize: 21, fontWeight: 'bold', marginBottom: 10 },
    details: { color: c.textMuted, fontSize: 13, marginTop: 4 },
    sectionTitle: { color: c.accent, fontSize: 16, fontWeight: '900', letterSpacing: 1, marginTop: 30, marginBottom: 15 },
    dateContainer: { gap: 10 },
    dateButton: {
      paddingVertical: 14, paddingHorizontal: 16, alignItems: 'center', backgroundColor: c.card,
      borderWidth: 1, borderColor: c.borderStrong, borderRadius: 5,
    },
    timeContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    timeButton: {
      paddingVertical: 14, paddingHorizontal: 18, backgroundColor: c.card,
      borderWidth: 1, borderColor: c.borderStrong, borderRadius: 5,
    },
    selectedButton: { backgroundColor: c.accent, borderColor: c.accent },
    buttonText: { color: c.text, fontWeight: 'bold' },
    selectedText: { color: c.onAccent },
    notFound: { flex: 1, backgroundColor: c.bg, justifyContent: 'center', padding: 30 },
    notFoundText: { color: c.text, fontSize: 18, textAlign: 'center' },
  });