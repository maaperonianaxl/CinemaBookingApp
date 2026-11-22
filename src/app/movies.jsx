import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { User } from 'lucide-react-native';
import MovieCard from '../components/MovieCard';
import UpcomingMovieCard from '../components/UpcomingMovieCard';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { movies } from '../data/movies';
import { upcomingMovies } from '../data/upcomingmovies';

const capitalize = (text) => {
  const clean = text.trim().toLowerCase();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
};

export default function Movies() {
  const router = useRouter();
  const { user } = useAuth();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  // Unique genres from both lists
  const genres = ['All', ...new Set([...movies, ...upcomingMovies].flatMap((m) => m.genre.split('/').map(capitalize)))];

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch =
      movie.title.toLowerCase().includes(search.toLowerCase()) ||
      movie.genre.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || movie.genre.split('/').some((g) => capitalize(g) === selectedGenre);
    return matchesSearch && matchesGenre;
  });

  // DYNAMIC ROUTE: only the id is passed -> /movie/3
  const openMovie = (movieId) => router.push(`/movie/${movieId}`);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.logo}>CINEMA</Text>
        <Pressable style={styles.profileButton} onPress={() => router.push('/profile')}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.profileImage} />
          ) : (
            <User size={18} color={colors.accent} fill={colors.accent} />
          )}
        </Pressable>
      </View>

      <Text style={styles.tagline}>{user ? `HI, ${user.name.split(' ')[0].toUpperCase()} - ` : ''}YOUR NEXT MOVIE EXPERIENCE</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search movies or genres..."
        placeholderTextColor={colors.textDim}
        value={search}
        onChangeText={setSearch}
      />

      <Text style={styles.sectionTitle}>BROWSE BY GENRE</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.genreContainer}>
        {genres.map((genre) => (
          <Pressable
            key={genre}
            style={[styles.genreButton, selectedGenre === genre && styles.selectedGenreButton]}
            onPress={() => setSelectedGenre(genre)}
          >
            <Text style={[styles.genreText, selectedGenre === genre && styles.selectedGenreText]}>{genre}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>NOW SHOWING</Text>
      {filteredMovies.length > 0 ? (
        filteredMovies.map((movie) => <MovieCard key={movie.id} movie={movie} onPress={() => openMovie(movie.id)} />)
      ) : (
        <Text style={styles.emptyText}>No movies found.</Text>
      )}

      <Text style={styles.sectionTitle}>UPCOMING MOVIES</Text>
      <ScrollView style={{ maxHeight: 300 }} nestedScrollEnabled>
        {upcomingMovies.map((movie) => (
          <UpcomingMovieCard key={movie.id} movie={movie} />
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const makeStyles = (c) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    content: { padding: 20, paddingBottom: 40 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 35 },
    logo: { fontSize: 30, fontWeight: '900', color: c.accent, letterSpacing: 3 },
    tagline: { color: c.textDim, fontSize: 11, letterSpacing: 2, marginTop: 8, marginBottom: 25 },
    profileButton: {
      width: 44, height: 44, borderRadius: 22, backgroundColor: c.card, borderWidth: 1,
      borderColor: c.accent, alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    },
    profileImage: { width: '100%', height: '100%' },
    searchInput: {
      backgroundColor: c.card, borderWidth: 1, borderColor: c.border, borderRadius: 4,
      padding: 14, color: c.text, fontSize: 14, marginBottom: 25,
    },
    sectionTitle: { color: c.accent, fontSize: 18, fontWeight: '900', letterSpacing: 2, marginTop: 15, marginBottom: 15 },
    genreContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    genreButton: { borderWidth: 1, borderColor: c.borderStrong, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20 },
    selectedGenreButton: { backgroundColor: c.accent, borderColor: c.accent },
    genreText: { color: c.textMuted, fontWeight: 'bold' },
    selectedGenreText: { color: c.onAccent },
    emptyText: { color: c.textMuted, textAlign: 'center', padding: 20 },
  });