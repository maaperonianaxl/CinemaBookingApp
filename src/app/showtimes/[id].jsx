
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import CustomButton from '../../components/CustomButton';
import { useTheme } from '../../context/ThemeContext';
import { showtimes } from '../../data/showtimes';
import { getShowDates } from '../utils/dates';
import {
  getPhilippineDateTime,
  hasShowtimePassed,
} from '../utils/showtime';
import { fetchMovieDetails, getMoviePoster } from '../../services/tmdb';

export default function Showtimes() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const movieId = Array.isArray(id) ? id[0] : id;

  const tmdbId = movieId?.startsWith('tmdb-')
    ? movieId.replace('tmdb-', '')
    : null;

  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [tmdbMovie, setTmdbMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [currentPH, setCurrentPH] = useState(
    () => getPhilippineDateTime()
  );

  const dates = useMemo(() => getShowDates(7), []);
  const [selectedDate, setSelectedDate] = useState(dates[0].value);
  const [selectedTime, setSelectedTime] = useState('');

  // Keep the Philippine clock updated.
  useEffect(() => {
    const updateClock = () => {
      setCurrentPH(getPhilippineDateTime());
    };

    updateClock();

    const interval = setInterval(updateClock, 30000);

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') updateClock();
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, []);

  // Fetch movie information from TMDB.
  useEffect(() => {
    let active = true;

    if (!tmdbId) {
      setTmdbMovie(null);
      setError('Invalid TMDB movie ID.');
      setLoading(false);

      return () => {
        active = false;
      };
    }

    setLoading(true);
    setError('');
    setTmdbMovie(null);

    fetchMovieDetails(tmdbId)
      .then((data) => {
        if (active) setTmdbMovie(data);
      })
      .catch((err) => {
        console.error('Showtime movie error:', err);
        if (active) setError('Unable to load movie details.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [tmdbId]);

  const movie = useMemo(() => {
    if (!tmdbMovie) return null;

    const poster = getMoviePoster(tmdbMovie.poster_path);

    return {
      id: movieId,
      title: tmdbMovie.title,
      image: poster ? { uri: poster } : null,
      genre: tmdbMovie.genres?.map((g) => g.name).join(', ') || 'N/A',
      duration: tmdbMovie.runtime
        ? `${tmdbMovie.runtime} min`
        : 'N/A',
    };
  }, [tmdbMovie, movieId]);

  // Only show future showtimes.
  const availableShowtimes = useMemo(
    () =>
      showtimes.filter(
        (time) => !hasShowtimePassed(selectedDate, time, currentPH)
      ),
    [selectedDate, currentPH]
  );

  // Clear selected time if it has passed.
  useEffect(() => {
    if (selectedTime && !availableShowtimes.includes(selectedTime)) {
      setSelectedTime('');
    }
  }, [availableShowtimes, selectedTime]);

  // Navigate to the seat-selection screen.
  const chooseSeats = () => {
    if (!movie?.id || !selectedTime) return;

    const latestTime = getPhilippineDateTime();

    if (hasShowtimePassed(selectedDate, selectedTime, latestTime)) {
      setCurrentPH(latestTime);
      setSelectedTime('');

      Alert.alert(
        'Showtime Unavailable',
        'This showtime has already started or passed. Please choose another showtime.'
      );

      return;
    }

    router.navigate({
      pathname: '/seats/[id]',
      params: {
        id: movie.id,
        date: selectedDate,
        time: selectedTime,
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.notFound}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.notFoundText}>Loading showtimes...</Text>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>
          {error || 'Movie not found.'}
        </Text>
        <CustomButton title="BACK" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Pressable onPress={() => router.back()} style={styles.back}>
        <ArrowLeft color={colors.accent} size={25} />
      </Pressable>

      <Text style={styles.heading}>SELECT SHOWTIME</Text>

      <Text style={styles.subtitle}>
        Choose your date and time, then pick your seats.
      </Text>

      <View style={styles.movieCard}>
        {movie.image ? (
          <Image
            source={movie.image}
            style={styles.poster}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.posterPlaceholder}>
            <Text style={styles.details}>No poster available</Text>
          </View>
        )}

        <Text style={styles.movieLabel}>NOW BOOKING</Text>
        <Text style={styles.movieTitle}>{movie.title}</Text>
        <Text style={styles.details}>{movie.genre}</Text>
        <Text style={styles.details}>Duration: {movie.duration}</Text>
      </View>

      <Text style={styles.sectionTitle}>SELECT DATE</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateContainer}
      >
        {dates.map((date) => (
          <Pressable
            key={date.value}
            style={[
              styles.dateButton,
              selectedDate === date.value && styles.selectedButton,
            ]}
            onPress={() => {
              setSelectedDate(date.value);
              setSelectedTime('');
            }}
          >
            <Text
              style={[
                styles.buttonText,
                selectedDate === date.value && styles.selectedText,
              ]}
            >
              {date.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>AVAILABLE SHOWTIMES</Text>

      {availableShowtimes.length > 0 ? (
        <View style={styles.timeContainer}>
          {availableShowtimes.map((time) => (
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
      ) : (
        <Text style={styles.noShowtimes}>
          No remaining showtimes for this date. Please select another date.
        </Text>
      )}

      <CustomButton
        title="CHOOSE SEATS"
        onPress={chooseSeats}
        disabled={!selectedTime}
      />
    </ScrollView>
  );
}

const makeStyles = (c) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.bg,
    },
    content: {
      padding: 20,
      paddingTop: 55,
      paddingBottom: 40,
    },
    back: {
      marginBottom: 20,
      alignSelf: 'flex-start',
    },
    heading: {
      color: c.text,
      fontSize: 26,
      fontWeight: '900',
      letterSpacing: 2,
    },
    subtitle: {
      color: c.textMuted,
      marginTop: 8,
      marginBottom: 25,
    },
    movieCard: {
      backgroundColor: c.card,
      borderLeftWidth: 4,
      borderLeftColor: c.accent,
      padding: 18,
      borderRadius: 5,
    },
    poster: {
      width: '100%',
      height: 200,
      borderRadius: 6,
      marginBottom: 14,
    },
    posterPlaceholder: {
      width: '100%',
      height: 200,
      backgroundColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14,
    },
    movieLabel: {
      color: c.accent,
      fontWeight: 'bold',
      fontSize: 11,
      marginBottom: 10,
      letterSpacing: 1,
    },
    movieTitle: {
      color: c.text,
      fontSize: 21,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    details: {
      color: c.textMuted,
      fontSize: 13,
      marginTop: 4,
    },
    sectionTitle: {
      color: c.accent,
      fontSize: 16,
      fontWeight: '900',
      letterSpacing: 1,
      marginTop: 30,
      marginBottom: 15,
    },
    dateContainer: {
      gap: 10,
    },
    dateButton: {
      paddingVertical: 14,
      paddingHorizontal: 16,
      alignItems: 'center',
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.borderStrong,
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
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.borderStrong,
      borderRadius: 5,
    },
    selectedButton: {
      backgroundColor: c.accent,
      borderColor: c.accent,
    },
    buttonText: {
      color: c.text,
      fontWeight: 'bold',
    },
    selectedText: {
      color: c.onAccent,
    },
    noShowtimes: {
      color: c.textMuted,
      fontSize: 13,
      lineHeight: 21,
      marginBottom: 15,
    },
    notFound: {
      flex: 1,
      backgroundColor: c.bg,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 30,
      gap: 15,
    },
    notFoundText: {
      color: c.text,
      fontSize: 18,
      textAlign: 'center',
    },
  });
