
import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  GestureDetector,
  GestureHandlerRootView,
  usePinchGesture,
  usePanGesture,
  useSimultaneousGestures,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import CustomButton from '../../components/CustomButton';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  seatRows,
  seatsPerRow,
  seatSections,
} from '../../data/showtimes';
import { formatDate } from '../utils/dates';
import {
  getPhilippineDateTime,
  hasShowtimePassed,
} from '../utils/showtime';
import { fetchMovieDetails } from '../../services/tmdb';

const GAP = 6;
const SEAT_GAP = 2;
const AISLE = 18;
const LABEL = 18;

const MIN_ZOOM = 1;
const MAX_ZOOM = 2;
const INITIAL_ZOOM = 1;

const SELECTED_GREEN = '#22C55E';
const TAKEN_GRAY = '#666666';
const LABEL_HEADER_HEIGHT = 22;

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

  const [tmdbTitle, setTmdbTitle] = useState('');
  const [taken, setTaken] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');

  // Gesture values run independently of React rendering.
  const zoom = useSharedValue(INITIAL_ZOOM);
  const panX = useSharedValue(0);
  const panY = useSharedValue(0);

  const mapAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: panY.value },
      { translateX: panX.value },
      { scale: zoom.value },
    ],
  }));

  // Same vertical transform as the map, without horizontal movement.
  const labelsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: panY.value },
      { scale: zoom.value },
    ],
  }));

  const pinchGesture = usePinchGesture({
    onUpdate: (event) => {
      zoom.value = Math.max(
        MIN_ZOOM,
        Math.min(MAX_ZOOM, zoom.value * event.scaleChange)
      );
    },
  });

  const panGesture = usePanGesture({
    minDistance: 1,
    averageTouches: true,
    onUpdate: (event) => {
      panX.value += event.changeX;
      panY.value += event.changeY;
    },
  });

  const combinedGesture = useSimultaneousGestures(
    pinchGesture,
    panGesture
  );

  const movieTitle = tmdbTitle || 'TMDB Movie';

  const seatSize = Math.max(
    16,
    Math.min(22, Math.floor((width - 120) / seatsPerRow))
  );

  const groupWidth = (count) =>
    count * seatSize + (count - 1) * SEAT_GAP;

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

    setSelected((prev) =>
      prev.includes(seat)
        ? prev.filter((item) => item !== seat)
        : [...prev, seat]
    );
  };

  const confirmBooking = async () => {
    if (selected.length === 0 || booking) return;

    const latestTime = getPhilippineDateTime();

    if (hasShowtimePassed(date, time, latestTime)) {
      Alert.alert(
        'Showtime Unavailable',
        'This showtime has already started or passed. Please return and choose another showtime.'
      );
      return;
    }

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

  if (!isTMDB) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>
          Invalid TMDB movie ID.
        </Text>
        <CustomButton
          title="BACK"
          onPress={() => router.back()}
        />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Pressable
          onPress={() => router.back()}
          style={styles.back}
        >
          <ArrowLeft color={colors.accent} size={25} />
        </Pressable>

        <Text style={styles.heading}>CHOOSE SEATS</Text>

        <Text style={styles.subtitle}>
          {movieTitle} - {formatDate(date)} at {time}
        </Text>

        <View style={styles.seatingArea}>
          <View style={styles.screenWrap}>
            <View style={styles.screenFrame}>
              <View style={styles.screenSurface} />
            </View>
            <View style={styles.screenGlow} />
            <Text style={styles.screenText}>CINEMA SCREEN</Text>
          </View>

          <Text style={styles.zoomHint}>
            Pinch to zoom. Drag to move the seats.
          </Text>

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
            <GestureDetector gesture={combinedGesture}>
              <View
                collapsable={false}
                style={styles.mapViewport}
              >
                {/* Main seating map */}
                <Animated.View
                  style={[
                    styles.zoomableMap,
                    mapAnimatedStyle,
                  ]}
                >
                  <View style={styles.sectionLabels}>
                    {seatSections.map((section, index) => (
                      <Fragment key={section.name}>
                        <Text
                          style={[
                            styles.sectionLabel,
                            { width: groupWidth(section.count) },
                          ]}
                        >
                          {section.name}
                        </Text>

                        {index < seatSections.length - 1 && (
                          <View style={{ width: AISLE }} />
                        )}
                      </Fragment>
                    ))}
                  </View>

                  {seatRows.map((row) => (
                    <View key={row} style={styles.row}>
                      {seatSections.map((section, sectionIndex) => (
                        <Fragment key={`${row}-${section.name}`}>
                          <View style={styles.seatGroup}>
                            {Array.from(
                              { length: section.count },
                              (_, index) => {
                                const seatNumber = section.start + index;
                                const seat = `${row}${seatNumber}`;

                                const isTaken = taken.includes(seat);
                                const isSelected = selected.includes(seat);

                                return (
                                  <Pressable
                                    key={seat}
                                    disabled={isTaken}
                                    onPress={() => toggleSeat(seat)}
                                    accessibilityRole="button"
                                    accessibilityLabel={`Row ${row}, seat ${seatNumber}${isTaken ? ', occupied' : isSelected ? ', selected' : ', available'}`}
                                    hitSlop={2}
                                    style={[
                                      styles.seat,
                                      {
                                        width: seatSize,
                                        height: seatSize,
                                      },
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
                                      {isSelected
                                        ? '✓'
                                        : isTaken
                                          ? '×'
                                          : seatNumber}
                                    </Text>
                                  </Pressable>
                                );
                              }
                            )}
                          </View>

                          {sectionIndex < seatSections.length - 1 && (
                            <View style={styles.aisle} />
                          )}
                        </Fragment>
                      ))}
                    </View>
                  ))}
                </Animated.View>

                {/* Left row labels */}
                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.leftLabels,
                    labelsAnimatedStyle,
                  ]}
                >
                  <View style={styles.labelHeaderSpace} />
                  {seatRows.map((row) => (
                    <View
                      key={row}
                      style={[
                        styles.labelRow,
                        { height: seatSize },
                      ]}
                    >
                      <Text style={styles.rowLabel}>{row}</Text>
                    </View>
                  ))}
                </Animated.View>

                {/* Right row labels */}
                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.rightLabels,
                    labelsAnimatedStyle,
                  ]}
                >
                  <View style={styles.labelHeaderSpace} />
                  {seatRows.map((row) => (
                    <View
                      key={row}
                      style={[
                        styles.labelRow,
                        { height: seatSize },
                      ]}
                    >
                      <Text style={styles.rowLabel}>{row}</Text>
                    </View>
                  ))}
                </Animated.View>
              </View>
            </GestureDetector>
          )}
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.seat, styles.legendBox]} />
            <Text style={styles.legendText}>Available</Text>
          </View>

          <View style={styles.legendItem}>
            <View
              style={[
                styles.seat,
                styles.legendBox,
                styles.seatSelected,
              ]}
            >
              <Text style={styles.legendCheck}>✓</Text>
            </View>
            <Text style={styles.legendText}>Selected</Text>
          </View>

          <View style={styles.legendItem}>
            <View
              style={[
                styles.seat,
                styles.legendBox,
                styles.seatTaken,
              ]}
            />
            <Text style={styles.legendText}>Taken</Text>
          </View>
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryLabel}>
            YOUR SEATS ({selected.length})
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
    </GestureHandlerRootView>
  );
}

const makeStyles = (c) =>
  StyleSheet.create({
    gestureRoot: {
      flex: 1,
      backgroundColor: c.bg,
    },
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
    seatingArea: {
      backgroundColor: c.card,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: c.border,
      paddingVertical: 18,
      paddingHorizontal: 5,
      overflow: 'hidden',
    },
    screenWrap: {
      alignItems: 'center',
      marginBottom: 25,
      paddingTop: 8,
    },
    screenFrame: {
      width: '94%',
      height: 25,
      borderTopWidth: 3,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: c.accent,
      borderTopLeftRadius: 120,
      borderTopRightRadius: 120,
      backgroundColor: c.card,
      alignItems: 'center',
      paddingTop: 4,
    },
    screenSurface: {
      width: '88%',
      height: 5,
      borderRadius: 10,
      backgroundColor: c.accentSoft,
    },
    screenGlow: {
      width: '78%',
      height: 3,
      borderRadius: 10,
      backgroundColor: c.accent,
      marginTop: -2,
      opacity: 0.5,
    },
    screenText: {
      color: c.text,
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 3,
      marginTop: 12,
    },
    zoomHint: {
      color: c.textDim,
      fontSize: 10,
      textAlign: 'center',
      marginBottom: 16,
    },

    mapViewport: {
      width: '100%',
      height: 330,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    zoomableMap: {
      alignItems: 'center',
      alignSelf: 'center',
      transformOrigin: 'top center',
    },
    sectionLabels: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: LABEL_HEADER_HEIGHT,
      marginBottom: 0,
    },
    sectionLabel: {
      color: c.textDim,
      fontSize: 8,
      fontWeight: '600',
      textAlign: 'center',
      letterSpacing: 1,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: GAP,
    },

    leftLabels: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: LABEL,
      alignItems: 'center',
      transformOrigin: 'top center',
    },
    rightLabels: {
      position: 'absolute',
      right: 0,
      top: 0,
      width: LABEL,
      alignItems: 'center',
      transformOrigin: 'top center',
    },
    labelHeaderSpace: {
      height: LABEL_HEADER_HEIGHT,
    },
    labelRow: {
      marginBottom: GAP,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowLabel: {
      color: c.accent,
      fontWeight: '700',
      fontSize: 11,
      textAlign: 'center',
    },

    seatGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SEAT_GAP,
    },
    aisle: {
      width: AISLE,
      height: 24,
    },
    seat: {
      borderRadius: 5,
      backgroundColor: c.accent,
      borderWidth: 1,
      borderColor: c.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    seatTaken: {
      backgroundColor: TAKEN_GRAY,
      borderColor: TAKEN_GRAY,
      opacity: 0.65,
    },
    seatSelected: {
      backgroundColor: SELECTED_GREEN,
      borderColor: SELECTED_GREEN,
      opacity: 1,
    },
    seatText: {
      color: c.onAccent,
      fontSize: 9,
      fontWeight: '600',
    },
    seatTextTaken: {
      color: '#FFFFFF',
    },
    seatTextSelected: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '900',
    },
    legend: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 18,
      marginTop: 24,
      flexWrap: 'wrap',
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
    },
    legendBox: {
      width: 18,
      height: 18,
      borderRadius: 5,
      marginHorizontal: 0,
    },
    legendCheck: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '900',
    },
    legendText: {
      color: c.textMuted,
      fontSize: 11,
    },
    summary: {
      backgroundColor: c.card,
      borderLeftWidth: 4,
      borderLeftColor: c.accent,
      borderRadius: 5,
      padding: 16,
      marginTop: 26,
    },
    summaryLabel: {
      color: c.textDim,
      fontSize: 10,
      fontWeight: '600',
      letterSpacing: 1.5,
    },
    summaryValue: {
      color: c.text,
      fontSize: 16,
      fontWeight: '500',
      marginTop: 8,
      lineHeight: 25,
    },
    errorText: {
      color: c.textMuted,
      textAlign: 'center',
    },
    notFound: {
      flex: 1,
      backgroundColor: c.bg,
      justifyContent: 'center',
      padding: 30,
    },
    notFoundText: {
      color: c.text,
      fontSize: 18,
      textAlign: 'center',
    },
  });
