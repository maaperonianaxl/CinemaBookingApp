import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function UpcomingMovieCard({ movie }) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.details}>{movie.genre}</Text>
      <Text style={styles.release}>{movie.releaseDate}</Text>
    </View>
  );
}

const makeStyles = (c) =>
  StyleSheet.create({
    card: { backgroundColor: c.card, borderLeftWidth: 4, borderLeftColor: c.accent, borderRadius: 5, padding: 14, marginBottom: 10 },
    title: { color: c.text, fontSize: 15, fontWeight: 'bold' },
    details: { color: c.textMuted, fontSize: 12, marginTop: 4 },
    release: { color: c.accent, fontSize: 11, fontWeight: 'bold', letterSpacing: 1, marginTop: 6 },
  });