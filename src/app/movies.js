import { useState } from 'react';
import { User } from 'lucide-react-native';

import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import MovieCard from '../components/MovieCard';
import UpcomingMovieCard from '../components/UpcomingMovieCard';

export default function Movies() {
  const router = useRouter();

  // Search and filter states
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  // Movies currently showing
  const movies = [
    {
      id: '1',
      title: 'Spider-Man: Brand New Day',
      genre: 'Action / Adventure / Sci-Fi',
      duration: '2h 28m',
    },
    {
      id: '2',
      title: 'Resident Evil',
      genre: 'Action / Horror / Sci-Fi',
      duration: '2h 56m',
    },
    {
      id: '3',
      title: 'Toy Story 5',
      genre: 'Animation / Comedy / Family / Adventure',
      duration: '1h 40m',
    },
    
    {
      id: '4',
      title: 'The End of Oak Street',
      genre: 'Mystery / Sci-Fi / Thriller',
      duration: '1h 39m',
    },

    {
      id: '5',
      title: 'Forgotten Island',
      genre: 'Animation / Adventure / Family / Fantasy / Comedy',
      duration: '1h 38m',
    },

    {
      id: '6',
      title: 'Backrooms',
      genre: 'Mystery / Sci-Fi / Thriller',
      duration: '3h 1m',
    },

  ];

  // Upcoming movies
  const upcomingMovies = [
    {
      id: '5',
      title: 'Chiikawa the Movie: The Secret of the Mermaid Island',
      genre: 'Animation / Adventure',
      releaseDate: 'Coming Soon',
    },
    {
      id: '6',
      title: 'Avengers: DoomsDay',
      genre: 'Action / sci-fi / Adventure',
      releaseDate: 'Coming Soon',
    },
    {
      id: '7',
      title: 'Spider-Man: Beyond the Spider-Verse',
      genre: 'Animation / Action / Adventure / Sci-Fi',
      releaseDate: 'Coming Soon',
    },
    {
      id: '8',
      title: 'ClayFace',
      genre: 'Thriller / Mystery / Sci-Fi',
      releaseDate: 'Coming Soon',
    },
    {
      id: '9',
      title: 'Man Of Tomorrow',
      genre: 'Action / Adventure / Sci-Fi',
      releaseDate: 'Coming Soon',
    },
  ];

  // Combine now showing and upcoming movies
const allMovies = [...movies, ...upcomingMovies];

// Get all genres and remove duplicates
const genres = [
  'All',
  ...new Set(
    allMovies.flatMap((movie) =>
      movie.genre.split('/').map((genre) => {
        // Make each genre look consistent
        const cleanGenre = genre.trim().toLowerCase();

        return cleanGenre.charAt(0).toUpperCase()
          + cleanGenre.slice(1);
      })
    )
  ),
];

  // FILTER: search by title and genre
  const filteredMovies = movies.filter((movie) => {
  const matchesSearch =
    movie.title.toLowerCase().includes(search.toLowerCase()) ||
    movie.genre.toLowerCase().includes(search.toLowerCase());

  const matchesGenre =
    selectedGenre === 'All' ||
    movie.genre
      .split('/')
      .some(
        (genre) =>
          genre.trim().toLowerCase() ===
          selectedGenre.toLowerCase()
      );

  return matchesSearch && matchesGenre;
});

  // FIND: get the selected movie by its ID
    const selectMovie = (movieId) => {
    const selectedMovie = movies.find(
        (movie) => movie.id === movieId
    );

    if (selectedMovie) {
        router.push({
        pathname: '/showtimes',
        params: {
            title: selectedMovie.title,
            genre: selectedMovie.genre,
            duration: selectedMovie.duration,
        },
        });
    }
    };

  // Reusable movie card
  const renderMovie = (movie) => (
    <View key={movie.id} style={styles.movieCard}>
      <Text style={styles.movieTitle}>
        {movie.title}
      </Text>

      <Text style={styles.details}>
        Genre: {movie.genre}
      </Text>

      <Text style={styles.details}>
        Duration: {movie.duration}
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => selectMovie(movie.id)}
      >
        <Text style={styles.buttonText}>
          BOOK NOW
        </Text>
      </Pressable>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>CINEMA</Text>

        <Pressable
          style={styles.profileButton}
          onPress={() => router.push('/profile')}
        >
          <Text style={styles.profileButtonText}>
            <User size={18} color="#FF4655" fill="#FF4655" />
          </Text>
        </Pressable>
      </View>

      <Text style={styles.tagline}>
        YOUR NEXT MOVIE EXPERIENCE
      </Text>

      {/* Search bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search movies or genres..."
        placeholderTextColor="#888888"
        value={search}
        onChangeText={setSearch}
      />

      {/* Genre filters */}
      <Text style={styles.sectionTitle}>
        BROWSE BY GENRE
      </Text>

        <ScrollView
  horizontal={true}
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.genreContainer}
>
  {genres.map((genre) => (
    <Pressable
      key={genre}
      style={[
        styles.genreButton,
        selectedGenre === genre &&
          styles.selectedGenreButton,
      ]}
      onPress={() => setSelectedGenre(genre)}
    >
      <Text
        style={[
          styles.genreText,
          selectedGenre === genre &&
            styles.selectedGenreText,
        ]}
      >
        {genre}
      </Text>
    </Pressable>
  ))}
</ScrollView>

      {/* Now Showing */}
      <Text style={styles.sectionTitle}>
        NOW SHOWING
      </Text>

      {filteredMovies.length > 0 ? ( 
        filteredMovies.map((movie) => (
        <MovieCard
            key={movie.id}
            movie={movie}
            onPress={() => selectMovie(movie.id)} 
        />
  ))
) : (
  <Text style={styles.emptyText}>
    No movies found.
  </Text>
)}

      {/* Upcoming Movies */}
      <Text style={styles.sectionTitle}>
        UPCOMING MOVIES
      </Text>

        <ScrollView
            style={{ maxHeight: 300 }}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
        >
        {upcomingMovies.map((movie) => (
            <UpcomingMovieCard
            key={movie.id}
            movie={movie}
            />
        ))}
        </ScrollView>
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
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 35,
  },

  logo: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FF4655',
    letterSpacing: 3,
  },

  tagline: {
    color: '#888888',
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 8,
    marginBottom: 25,
  },

  profileButton: {
    backgroundColor: '#1C1D21',
    borderWidth: 1,
    borderColor: '#FF4655',
    padding: 10,
    borderRadius: 4,
  },

  profileButtonText: {
    color: '#FF4655',
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
  },

  searchInput: {
    backgroundColor: '#1C1D21',
    borderWidth: 1,
    borderColor: '#3A3B40',
    borderRadius: 4,
    padding: 14,
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 25,
  },

  sectionTitle: {
    color: '#FF4655',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 15,
    marginBottom: 15,
  },

  genreContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
  gap: 10,
},

  genreButton: {
    borderWidth: 1,
    borderColor: '#444444',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexShrink: 0,
  },

  selectedGenreButton: {
    backgroundColor: '#FF4655',
    borderColor: '#FF4655',
  },

  genreText: {
    color: '#AAAAAA',
    fontWeight: 'bold',
  },

  selectedGenreText: {
    color: '#FFFFFF',
  },

  emptyText: {
    color: '#AAAAAA',
    textAlign: 'center',
    padding: 20,
  },

});