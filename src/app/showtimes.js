
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View, } from 'react-native';
import CustomButton from '../components/CustomButton';

export default function Showtimes() {
  const router = useRouter();

  // Receive the selected movie from movies.js
  const { title, genre, duration } = useLocalSearchParams();

  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTime, setSelectedTime] = useState('');

  // Sample dates and showtimes for the project
  const dates = ['Today', 'Tomorrow', 'Sep 27'];

  const showtimes = [
    '10:00 AM',
    '1:30 PM',
    '4:00 PM',
    '7:30 PM',
    '9:45 PM',
  ];

  const confirmShowtime = () => {
    if (selectedTime === '') {
      Alert.alert('Select a Showtime', 'Please choose a movie time first.');
      return;
    }

    Alert.alert(
      'Showtime Selected',
      `${title}\n${selectedDate} at ${selectedTime}`,
      [
        {
          text: 'OK',
          onPress: () => {},
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <Pressable onPress={() => router.back()}>
        <Text style={styles.backButton}>‹ BACK TO MOVIES</Text>
      </Pressable>

      <Text style={styles.heading}>SELECT SHOWTIME</Text>
      <Text style={styles.subtitle}>
        Choose your preferred date and time.
      </Text>

      {/* Selected movie */}
      <View style={styles.movieCard}>
        <Text style={styles.movieLabel}>NOW BOOKING</Text>
        <Text style={styles.movieTitle}>{title}</Text>
        <Text style={styles.details}>{genre}</Text>
        <Text style={styles.details}>Duration: {duration}</Text>
      </View>

      {/* Date selection */}
      <Text style={styles.sectionTitle}>SELECT DATE</Text>

      <View style={styles.dateContainer}>
        {dates.map((date) => (
          <Pressable
            key={date}
            style={[
              styles.dateButton,
              selectedDate === date && styles.selectedButton,
            ]}
            onPress={() => setSelectedDate(date)}
          >
            <Text
              style={[
                styles.buttonText,
                selectedDate === date && styles.selectedText,
              ]}
            >
              {date}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Showtime selection */}
      <Text style={styles.sectionTitle}>AVAILABLE SHOWTIMES</Text>

      <View style={styles.timeContainer}>
        {showtimes.map((time) => (
          <Pressable
            key={time}
            style={[
              styles.timeButton,
              selectedTime === time && styles.selectedButton,
            ]}
            onPress={() => setSelectedTime(time)}
          >
            <Text
              style={[
                styles.buttonText,
                selectedTime === time && styles.selectedText,
              ]}
            >
              {time}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Continue */}
      <CustomButton
        title="CONTINUE"
        onPress={confirmShowtime}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101113',
  },

  content: {
    padding: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },

  backButton: {
    color: '#FF4655',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 25,
  },

  heading: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 2,
  },

  subtitle: {
    color: '#AAAAAA',
    marginTop: 8,
    marginBottom: 25,
  },

  movieCard: {
    backgroundColor: '#1C1D21',
    borderLeftWidth: 4,
    borderLeftColor: '#FF4655',
    padding: 18,
    borderRadius: 5,
  },

  movieLabel: {
    color: '#FF4655',
    fontWeight: 'bold',
    fontSize: 11,
    marginBottom: 10,
    letterSpacing: 1,
  },

  movieTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  details: {
    color: '#AAAAAA',
    fontSize: 13,
    marginTop: 4,
  },

  sectionTitle: {
    color: '#FF4655',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 30,
    marginBottom: 15,
  },

  dateContainer: {
    flexDirection: 'row',
    gap: 10,
  },

  dateButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    backgroundColor: '#1C1D21',
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 5,
  },

  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  timeButton: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: '#1C1D21',
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 5,
  },

  selectedButton: {
    backgroundColor: '#FF4655',
    borderColor: '#FF4655',
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  selectedText: {
    color: '#FFFFFF',
  },

});