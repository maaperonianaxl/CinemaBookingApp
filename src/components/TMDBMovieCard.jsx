
import { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getMoviePoster } from '../services/tmdb';

export default function TMDBMovieCard({ movie, onPress }) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const posterUrl = getMoviePoster(movie.poster_path);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {posterUrl ? (
        <Image
          source={{ uri: posterUrl }}
          style={styles.poster}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>No Poster</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>

        <Text style={styles.details}>
          Release: {movie.release_date || 'TBA'}
        </Text>

        <Text style={styles.rating}>
          Rating: {movie.vote_average?.toFixed(1) || 'N/A'} / 10
        </Text>
      </View>
    </Pressable>
  );
}

const makeStyles = (c) =>
  StyleSheet.create({
    card: {
      width: 145,
      backgroundColor: c.card,
      borderRadius: 8,
      overflow: 'hidden',
      marginRight: 12,
    },
    poster: {
      width: '100%',
      height: 205,
    },
    placeholder: {
      width: '100%',
      height: 205,
      backgroundColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    placeholderText: {
      color: c.textMuted,
    },
    info: {
      padding: 10,
    },
    title: {
      color: c.text,
      fontSize: 13,
      fontWeight: 'bold',
      marginBottom: 6,
    },
    details: {
      color: c.textMuted,
      fontSize: 11,
      marginBottom: 4,
    },
    rating: {
      color: c.accent,
      fontSize: 11,
      fontWeight: 'bold',
    },
  });
