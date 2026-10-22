import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import CustomButton from './CustomButton';

export default function MovieCard({ movie, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={movie.image} style={styles.image} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.details}>Genre: {movie.genre}</Text>
        <Text style={styles.details}>Duration: {movie.duration}</Text>
        <CustomButton title="BOOK NOW" onPress={onPress} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#1C1D21', borderRadius: 8, overflow: 'hidden', marginBottom: 18 },
  image: { width: '100%', height: 220 },
  info: { padding: 16 },
  title: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  details: { color: '#AAAAAA', fontSize: 13, marginTop: 3 },
});