
import { useEffect, useMemo, useState } from 'react';
import {
  AppState, Image, Pressable, ScrollView, StyleSheet,
  Text, TextInput, View, ActivityIndicator, Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { User, ChevronDown, Check } from 'lucide-react-native';

import MovieCard from '../components/MovieCard';
import TMDBMovieCard from '../components/TMDBMovieCard';
import { fetchMovieCategories } from '../services/tmdb';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { movies } from '../data/movies';

const GENRES = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction',
  53: 'Thriller', 10752: 'War', 37: 'Western',
};

const GENRE_IDS = Object.fromEntries(
  Object.entries(GENRES).map(([id, name]) => [name, Number(id)])
);

const normalize = (value) => String(value || '').trim().toLowerCase();

const todayPH = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Manila',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date());

const daysAgo = (date, days) => {
  const result = new Date(`${date}T00:00:00Z`);
  result.setUTCDate(result.getUTCDate() - days);
  return result.toISOString().slice(0, 10);
};

const localGenres = (genre = '') =>
  genre.split('/').map((name) =>
    name.trim().toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase())
  ).filter(Boolean);

const matchesGenre = (movie, genre) =>
  genre === 'All' ||
  movie.genre_ids?.includes(GENRE_IDS[genre]) ||
  localGenres(movie.genre).includes(genre);

const matchesSearch = (movie, search) =>
  !search || [movie.title, movie.overview, movie.genre]
    .some((value) => normalize(value).includes(search));

export default function Movies() {
  const router = useRouter();
  const { user } = useAuth();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [genreDropdownVisible, setGenreDropdownVisible] = useState(false);
  const [today, setToday] = useState(todayPH());
  const [categories, setCategories] = useState({
    popular: [], nowPlaying: [], upcoming: [], topRated: [],
  });
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    let mounted = true;
    let requestId = 0;

    const loadMovies = async () => {
      const id = ++requestId;
      setLoadingMovies(true);
      setApiError(null);

      try {
        const data = await fetchMovieCategories();
        if (mounted && id === requestId) setCategories(data);
      } catch (error) {
        console.error('Failed to fetch TMDB movies:', error);
        if (mounted && id === requestId) {
          setApiError('Unable to load movies. Please try again later.');
        }
      } finally {
        if (mounted && id === requestId) setLoadingMovies(false);
      }
    };

    loadMovies();

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        setToday(todayPH());
        loadMovies();
      }
    });

    return () => {
      mounted = false;
      requestId++;
      subscription.remove();
    };
  }, []);

  const genres = useMemo(() => [
    'All',
    ...new Set([
      ...Object.values(GENRES),
      ...movies.flatMap((movie) => localGenres(movie.genre)),
    ]),
  ].filter((genre) => genre !== 'TV Movie')
    .sort((a, b) => a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b)),
  []);

  const normalizedSearch = normalize(search);
  const searchGenre = genres.find(
    (genre) => genre !== 'All' && genre.toLowerCase() === normalizedSearch
  );
  const activeGenre = searchGenre || selectedGenre;
  const cutoffDate = daysAgo(today, 30);

  const filteredCategories = useMemo(() => {
    const filter = (list) => list.filter((movie) =>
      matchesGenre(movie, activeGenre) &&
      matchesSearch(movie, normalizedSearch)
    );

    const released = (list) => list.filter((movie) =>
      movie.ph_release_date && movie.ph_release_date <= today
    );

    return {
      nowPlaying: filter(categories.nowPlaying.filter((movie) =>
        movie.ph_release_date >= cutoffDate &&
        movie.ph_release_date <= today
      )),
      upcoming: filter(categories.upcoming.filter((movie) =>
        movie.ph_release_date > today
      )),
      popular: filter(released(categories.popular)),
      topRated: filter(released(categories.topRated)),
      booking: filter(movies),
    };
  }, [categories, activeGenre, normalizedSearch, today, cutoffDate]);


const renderTMDBSection = (title, list, bookable = false) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {loadingMovies ? (
      <ActivityIndicator color={colors.accent} size="large" />
    ) : apiError ? (
      <Text style={styles.emptyText}>{apiError}</Text>
    ) : list.length ? (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.movieRow}>
        {list.map((movie) => (
          <TMDBMovieCard
            key={movie.id}
            movie={movie}
            onPress={bookable
              ? () => router.push(`/movie/tmdb-${movie.id}`)
              : undefined}
          />
        ))}
      </ScrollView>
    ) : (
      <Text style={styles.emptyText}>No movies found.</Text>
    )}
  </View>
);


  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>CINEMA</Text>
          <Text style={styles.headerSubtitle}>YOUR MOVIE DESTINATION</Text>
        </View>
        <Pressable style={styles.profileButton}
          onPress={() => router.push('/profile')}>
          {user?.avatar
            ? <Image source={{ uri: user.avatar }} style={styles.profileImage} />
            : <User size={20} color={colors.accent} />}
        </Pressable>
      </View>

      <View style={styles.welcome}>
        <Text style={styles.welcomeTitle}>
          {user?.name
            ? `WELCOME BACK, ${user.name.split(' ')[0].toUpperCase()}!`
            : 'FIND YOUR NEXT MOVIE'}
        </Text>
        <Text style={styles.welcomeSubtitle}>
          Discover movies and plan your next cinema experience.
        </Text>
      </View>

      <TextInput style={styles.searchInput}
        placeholder="Search movies or genres..."
        placeholderTextColor={colors.textDim}
        value={search} onChangeText={setSearch} />

      <View style={styles.genreContainer}>
        <Text style={styles.filterLabel}>BROWSE BY GENRE</Text>
        <Pressable style={styles.genreDropdown}
          onPress={() => setGenreDropdownVisible(true)}>
          <Text style={styles.genreDropdownText}>
            {searchGenre || selectedGenre}
          </Text>
          <ChevronDown size={20} color={colors.accent} />
        </Pressable>
      </View>

      <Modal visible={genreDropdownVisible} transparent animationType="fade"
        onRequestClose={() => setGenreDropdownVisible(false)}>
        <Pressable style={styles.modalOverlay}
          onPress={() => setGenreDropdownVisible(false)}>
          <Pressable style={styles.dropdownModal} onPress={() => {}}>
            <Text style={styles.modalTitle}>SELECT GENRE</Text>
            <ScrollView style={styles.genreList}>
              {genres.map((genre) => (
                <Pressable key={genre} style={styles.genreOption}
                  onPress={() => {
                    setSelectedGenre(genre);
                    setSearch('');
                    setGenreDropdownVisible(false);
                  }}>
                  <Text style={[
                    styles.genreOptionText,
                    selectedGenre === genre && styles.selectedGenreText,
                  ]}>{genre}</Text>
                  {selectedGenre === genre &&
                    <Check size={18} color={colors.accent} />}
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

{renderTMDBSection('NOW SHOWING', filteredCategories.nowPlaying, true)}
      <View style={styles.bookingSection}>
        <Text style={styles.sectionTitle}>AVAILABLE FOR BOOKING</Text>
        <Text style={styles.sectionDescription}>
          Choose a movie from our booking catalogue.
        </Text>
        {filteredCategories.booking.length ? (
<View style={styles.bookingList}>
  {filteredCategories.booking.map((movie) => (
    <MovieCard
      key={movie.id}
      movie={movie}
      onPress={() => router.push(`/movie/${movie.id}`)}
    />
  ))}
</View>
        ) : (
          <Text style={styles.emptyText}>No bookable movies found.</Text>
        )}
      </View>

      {renderTMDBSection('UPCOMING MOVIES', filteredCategories.upcoming)}
      {renderTMDBSection('POPULAR MOVIES', filteredCategories.popular)}
      {renderTMDBSection('TOP RATED MOVIES', filteredCategories.topRated)}
    </ScrollView>
  );
}

const makeStyles = (c) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.bg },
  content: { padding: 20, paddingBottom: 45 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 35, marginBottom: 25,
  },
  logo: { fontSize: 29, fontWeight: '900', color: c.accent, letterSpacing: 3 },
  headerSubtitle: { color: c.textMuted, fontSize: 9, letterSpacing: 2, marginTop: 4 },
  profileButton: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: c.card,
    borderWidth: 1, borderColor: c.accent, alignItems: 'center',
    justifyContent: 'center', overflow: 'hidden',
  },
  profileImage: { width: '100%', height: '100%' },
  welcome: { marginBottom: 20 },
  welcomeTitle: {
    color: c.text, fontSize: 20, fontWeight: '900',
    letterSpacing: 0.5, marginBottom: 7,
  },
  welcomeSubtitle: { color: c.textMuted, fontSize: 13, lineHeight: 20 },
  searchInput: {
    backgroundColor: c.card, borderWidth: 1, borderColor: c.border,
    borderRadius: 8, padding: 15, color: c.text, fontSize: 14, marginBottom: 22,
  },
  genreContainer: { marginBottom: 12 },
  filterLabel: {
    color: c.textMuted, fontSize: 11, fontWeight: '700',
    letterSpacing: 1.5, marginBottom: 9,
  },
  genreDropdown: {
    backgroundColor: c.card, borderWidth: 1, borderColor: c.borderStrong,
    borderRadius: 8, paddingHorizontal: 15, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  genreDropdownText: { color: c.text, fontSize: 14, fontWeight: '600' },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center', padding: 25,
  },
  dropdownModal: {
    backgroundColor: c.card, borderRadius: 12, padding: 18,
    maxHeight: '75%', borderWidth: 1, borderColor: c.border,
  },
  modalTitle: {
    color: c.accent, fontSize: 16, fontWeight: '900',
    letterSpacing: 2, marginBottom: 12,
  },
  genreList: { maxHeight: 400 },
  genreOption: {
    minHeight: 48, borderBottomWidth: 1, borderBottomColor: c.border,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 8,
  },
  genreOptionText: { color: c.text, fontSize: 14 },
  selectedGenreText: { color: c.accent, fontWeight: 'bold' },
  section: { marginTop: 28 },
  sectionTitle: {
    color: c.accent, fontSize: 18, fontWeight: '900',
    letterSpacing: 1.5, marginBottom: 8,
  },
  sectionDescription: { color: c.textMuted, fontSize: 12, marginBottom: 15 },
  movieRow: { paddingTop: 8, paddingBottom: 5 },
  bookingSection: { marginTop: 30 },
bookingList: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  marginTop: 8,
},
  emptyText: { color: c.textMuted, textAlign: 'center', padding: 20 },
});
