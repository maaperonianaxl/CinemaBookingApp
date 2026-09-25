import { Pressable, StyleSheet, Text, View, } from 'react-native';

export default function MovieCard({ movie, onPress }) {
  return (
    <View style={styles.movieCard}>
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
        onPress={onPress}
      >
        <Text style={styles.buttonText}>
          BOOK NOW
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  movieCard: {
    backgroundColor: '#1C1D21',
    padding: 18,
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#FF4655',
    marginBottom: 15,
  },

  movieTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  details: {
    color: '#AAAAAA',
    fontSize: 13,
    marginBottom: 5,
  },

  button: {
    backgroundColor: '#FF4655',
    padding: 13,
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 12,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: 1,
  },
});