import { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import CustomButton from './CustomButton';

export default function MovieCard({ movie, onPress }) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={movie.image} style={styles.image} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.details}>Genre: {movie.genre}</Text>
        <Text style={styles.details}>Duration: {movie.duration}</Text>
        <CustomButton title="VIEW DETAILS" onPress={onPress} />
      </View>
    </Pressable>
  );
}

const makeStyles = (c) =>
  StyleSheet.create({
    card: { backgroundColor: c.card, borderRadius: 8, overflow: 'hidden', marginBottom: 18 },
    image: { width: '100%', height: 220 },
    info: { padding: 16 },
    title: { color: c.text, fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    details: { color: c.textMuted, fontSize: 13, marginTop: 3 },
  });