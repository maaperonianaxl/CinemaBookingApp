import { useRouter } from 'expo-router';
import { User } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import MovieCard from '../components/MovieCard';
import UpcomingMovieCard from '../components/UpcomingMovieCard';
import { movies } from '../data/movies';
import { upcomingMovies } from '../data/upcomingmovies';

const capitalize = (text) => {
  const clean = text.trim().toLowerCase();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
};

export default function Movies() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  // Unique genres from both lists
  const genres = [
    'All',
    ...new Set([...movies, ...upcomingMovies].flatMap((m) => m.genre.split('/').map(capitalize))),
  ];

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch =
      movie.title.toLowerCase().includes(search.toLowerCase()) ||
      movie.genre.toLowerCase().includes(search.toLowerCase());
    const matchesGenre =
      selectedGenre === 'All' ||
      movie.genre.split('/').some((g) => capitalize(g) === selectedGenre);
    return matchesSearch && matchesGenre;
  });

  // DYNAMIC ROUTE: only the id is passed -> /showtimes/3
  const openMovie = (movieId) => router.push(`/showtimes/${movieId}`);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.logo}>CINEMA</Text>
        <Pressable style={styles.profileButton} onPress={() => router.push('/profile')}>
          <User size={18} color="#FF4655" fill="#FF4655" />
        </Pressable>
      </View>

      <Text style={styles.tagline}>YOUR NEXT MOVIE EXPERIENCE</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search movies or genres..."
        placeholderTextColor="#888888"
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
            <Text style={[styles.genreText, selectedGenre === genre && styles.selectedGenreText]}>
              {genre}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>NOW SHOWING</Text>
      {filteredMovies.length > 0 ? (
        filteredMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onPress={() => openMovie(movie.id)} />
        ))
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#101113' },
  content: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 35 },
  logo: { fontSize: 30, fontWeight: '900', color: '#FF4655', letterSpacing: 3 },
  tagline: { color: '#888888', fontSize: 11, letterSpacing: 2, marginTop: 8, marginBottom: 25 },
  profileButton: { backgroundColor: '#1C1D21', borderWidth: 1, borderColor: '#FF4655', padding: 10, borderRadius: 4 },
  searchInput: {
    backgroundColor: '#1C1D21', borderWidth: 1, borderColor: '#3A3B40', borderRadius: 4,
    padding: 14, color: '#FFFFFF', fontSize: 14, marginBottom: 25,
  },
  sectionTitle: { color: '#FF4655', fontSize: 18, fontWeight: '900', letterSpacing: 2, marginTop: 15, marginBottom: 15 },
  genreContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  genreButton: { borderWidth: 1, borderColor: '#444444', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20 },
  selectedGenreButton: { backgroundColor: '#FF4655', borderColor: '#FF4655' },
  genreText: { color: '#AAAAAA', fontWeight: 'bold' },
  selectedGenreText: { color: '#FFFFFF' },
  emptyText: { color: '#AAAAAA', textAlign: 'center', padding: 20 },
});