import { StyleSheet, Text, View } from 'react-native';

export default function UpcomingMovieCard({ movie }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.details}>{movie.genre}</Text>
      <Text style={styles.release}>{movie.releaseDate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#1C1D21', borderLeftWidth: 4, borderLeftColor: '#FF4655', borderRadius: 5, padding: 14, marginBottom: 10 },
  title: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
  details: { color: '#AAAAAA', fontSize: 12, marginTop: 4 },
  release: { color: '#FF4655', fontSize: 11, fontWeight: 'bold', letterSpacing: 1, marginTop: 6 },
});