
import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator, Alert, Pressable, ScrollView,
  StyleSheet, Text, useWindowDimensions, View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import CustomButton from '../../components/CustomButton';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { movies } from '../../data/movies';
import { MAX_SEATS, seatRows, seatsPerRow } from '../../data/showtimes';
import { formatDate } from '../utils/dates';
import { fetchMovieDetails } from '../../services/tmdb';

const GAP = 6;
const AISLE = 20;
const LABEL = 26;

export default function Seats() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const date = Array.isArray(params.date) ? params.date[0] : params.date;
  const time = Array.isArray(params.time) ? params.time[0] : params.time;

  const isTMDB = id?.startsWith('tmdb-');
  const { getTakenSeats, bookSeats } = useAuth();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const localMovie = !isTMDB
    ? movies.find((m) => m.id === id)
    : null;

  const [tmdbTitle, setTmdbTitle] = useState('');
  const [taken, setTaken] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');

  const movieTitle = localMovie?.title || tmdbTitle || 'TMDB Movie';

  const seatSize = Math.min(
    38,
    Math.floor((width - 40 - LABEL - AISLE) / seatsPerRow) - GAP
  );

  useEffect(() => {
    if (!isTMDB) return;

    let active = true;

    fetchMovieDetails(id.replace('tmdb-', ''))
      .then((movie) => {
        if (active) setTmdbTitle(movie.title || 'TMDB Movie');
      })
      .catch((err) => {
        console.error('TMDB seat screen error:', err);
        if (active) setTmdbTitle('TMDB Movie');
      });

    return () => {
      active = false;
    };
  }, [id, isTMDB]);

  const loadSeats = async () => {
    setLoading(true);
    setError('');

    const result = await getTakenSeats(id, date, time);

    if (result.ok) {
      setTaken(result.seats);
      setSelected((prev) =>
        prev.filter((seat) => !result.seats.includes(seat))
      );
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadSeats();
  }, [id, date, time]);

  const toggleSeat = (seat) => {
    if (taken.includes(seat)) return;

    if (selected.includes(seat)) {
      setSelected(selected.filter((s) => s !== seat));
    } else if (selected.length >= MAX_SEATS) {
      Alert.alert(
        'Seat limit',
        `You can book up to ${MAX_SEATS} seats at a time.`
      );
    } else {
      setSelected([...selected, seat]);
    }
  };

  const confirmBooking = async () => {
    setBooking(true);

    const sorted = [...selected].sort();

    const result = await bookSeats({
      movieId: id,
      date,
      time,
      seats: sorted,
    });

    setBooking(false);

    if (!result.ok) {
      Alert.alert('Booking Failed', result.error);
      if (result.seatTaken) loadSeats();
      return;
    }

    Alert.alert(
      'Booking Confirmed',
      `${movieTitle}\n${formatDate(date)} at ${time}\nSeats: ${sorted.join(', ')}`,
      [
        {
          text: 'VIEW TICKETS',
          onPress: () => {
            router.dismissAll();
            router.push('/profile');
          },
        },
      ]
    );
  };

  if (!localMovie && !isTMDB) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Movie not found.</Text>
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

      <Text style={styles.heading}>CHOOSE SEATS</Text>

      <Text style={styles.subtitle}>
        {movieTitle} - {formatDate(date)} at {time}
      </Text>

      <View style={styles.screenWrap}>
        <View style={styles.screenBar} />
        <Text style={styles.screenText}>SCREEN</Text>
      </View>

      {loading ? (
        <ActivityIndicator
          color={colors.accent}
          size="large"
          style={{ marginVertical: 50 }}
        />
      ) : error ? (
        <View style={{ marginVertical: 30 }}>
          <Text style={styles.errorText}>{error}</Text>
          <CustomButton
            title="TRY AGAIN"
            variant="outline"
            onPress={loadSeats}
          />
        </View>
      ) : (
        <View style={styles.grid}>
          {seatRows.map((row) => (
            <View key={row} style={styles.row}>
              <Text style={[styles.rowLabel, { width: LABEL }]}>
                {row}
              </Text>

              {Array.from({ length: seatsPerRow }, (_, i) => {
                const seat = `${row}${i + 1}`;
                const isTaken = taken.includes(seat);
                const isSelected = selected.includes(seat);

                return (
                  <Fragment key={seat}>
                    {i === seatsPerRow / 2 && (
                      <View style={{ width: AISLE }} />
                    )}

                    <Pressable
                      disabled={isTaken}
                      onPress={() => toggleSeat(seat)}
                      style={[
                        styles.seat,
                        { width: seatSize, height: seatSize },
                        isTaken && styles.seatTaken,
                        isSelected && styles.seatSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.seatText,
                          isTaken && styles.seatTextTaken,
                          isSelected && styles.seatTextSelected,
                        ]}
                      >
                        {isTaken ? 'X' : i + 1}
                      </Text>
                    </Pressable>
                  </Fragment>
                );
              })}
            </View>
          ))}
        </View>
      )}

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.seat, styles.legendBox]} />
          <Text style={styles.legendText}>Available</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.seat, styles.legendBox, styles.seatSelected]} />
          <Text style={styles.legendText}>Selected</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.seat, styles.legendBox, styles.seatTaken]} />
          <Text style={styles.legendText}>Taken</Text>
        </View>
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>
          YOUR SEATS ({selected.length}/{MAX_SEATS})
        </Text>

        <Text style={styles.summaryValue}>
          {selected.length > 0
            ? [...selected].sort().join(', ')
            : 'None selected'}
        </Text>
      </View>

      <CustomButton
        title="CONFIRM BOOKING"
        onPress={confirmBooking}
        loading={booking}
        disabled={selected.length === 0 || loading || !!error}
      />
    </ScrollView>
  );
}

const makeStyles = (c) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    content: { padding: 20, paddingTop: 55, paddingBottom: 40 },
    back: { marginBottom: 20, alignSelf: 'flex-start' },
    heading: {
      color: c.text, fontSize: 26, fontWeight: '900', letterSpacing: 2,
    },
    subtitle: { color: c.textMuted, marginTop: 8, marginBottom: 20 },
    screenWrap: { alignItems: 'center', marginBottom: 24 },
    screenBar: {
      width: '80%', height: 6, borderRadius: 3, backgroundColor: c.accent,
    },
    screenText: {
      color: c.textDim, fontSize: 10, letterSpacing: 4, marginTop: 8,
    },
    grid: { alignItems: 'center' },
    row: { flexDirection: 'row', alignItems: 'center', marginBottom: GAP },
    rowLabel: { color: c.textDim, fontWeight: 'bold', fontSize: 12 },
    seat: {
      marginHorizontal: GAP / 2,
      borderRadius: 6,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.borderStrong,
      alignItems: 'center',
      justifyContent: 'center',
    },
    seatTaken: {
      backgroundColor: c.cardAlt, borderColor: c.cardAlt, opacity: 0.6,
    },
    seatSelected: { backgroundColor: c.accent, borderColor: c.accent },
    seatText: { color: c.textMuted, fontSize: 11, fontWeight: 'bold' },
    seatTextTaken: { color: c.textDim },
    seatTextSelected: { color: c.onAccent },
    legend: {
      flexDirection: 'row', justifyContent: 'center', gap: 22, marginTop: 24,
    },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    legendBox: { width: 18, height: 18, marginHorizontal: 0 },
    legendText: { color: c.textMuted, fontSize: 12 },
    summary: {
      backgroundColor: c.card,
      borderLeftWidth: 4,
      borderLeftColor: c.accent,
      borderRadius: 5,
      padding: 16,
      marginTop: 26,
    },
    summaryLabel: {
      color: c.textDim, fontSize: 10, fontWeight: 'bold', letterSpacing: 1.5,
    },
    summaryValue: {
      color: c.text, fontSize: 18, fontWeight: 'bold', marginTop: 6,
    },
    errorText: { color: c.textMuted, textAlign: 'center' },
    notFound: {
      flex: 1, backgroundColor: c.bg, justifyContent: 'center', padding: 30,
    },
    notFoundText: { color: c.text, fontSize: 18, textAlign: 'center' },
  });
