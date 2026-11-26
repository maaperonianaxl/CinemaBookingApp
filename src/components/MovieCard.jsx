
import { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import CustomButton from './CustomButton';

export default function MovieCard({ movie, onPress }) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image
        source={movie.image}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>

        <Text style={styles.details} numberOfLines={1}>
          {movie.genre}
        </Text>

        <Text style={styles.details}>
          {movie.duration}
        </Text>

        <CustomButton title="VIEW DETAILS" onPress={onPress} />
      </View>
    </Pressable>
  );
}

const makeStyles = (c) =>
  StyleSheet.create({
    card: {
      width: '48%',
      backgroundColor: c.card,
      borderRadius: 8,
      overflow: 'hidden',
      marginBottom: 14,
    },
    image: {
      width: '100%',
      height: 185,
    },
    info: {
      padding: 10,
      gap: 5,
    },
    title: {
      color: c.text,
      fontSize: 15,
      fontWeight: 'bold',
      marginBottom: 3,
    },
    details: {
      color: c.textMuted,
      fontSize: 11,
    },
  });
