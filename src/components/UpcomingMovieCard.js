import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function UpcomingMovieCard({ movie }) {
  return (
    <View style={styles.upcomingCard}>
      <View style={styles.upcomingInfo}>
        <Text style={styles.movieTitle}>
          {movie.title}
        </Text>

        <Text style={styles.details}>
          Genre: {movie.genre}
        </Text>

        <Text style={styles.releaseDate}>
          {movie.releaseDate}
        </Text>
      </View>

      <View style={styles.comingSoonBadge}>
        <Text style={styles.comingSoonText}>
          SOON
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  upcomingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1C1D21',
    padding: 16,
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#555555',
    marginBottom: 12,
  },

  upcomingInfo: {
    flex: 1,
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

  releaseDate: {
    color: '#FF4655',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },

  comingSoonBadge: {
    backgroundColor: '#333333',
    paddingVertical: 7,
    paddingHorizontal: 9,
    borderRadius: 3,
    marginLeft: 8,
  },

  comingSoonText: {
    color: '#FF4655',
    fontWeight: 'bold',
    fontSize: 10,
  },
});