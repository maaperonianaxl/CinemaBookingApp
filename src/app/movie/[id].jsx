import { useMemo } from 'react';
import { Alert, Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Play } from 'lucide-react-native';
import CustomButton from '../../components/CustomButton';
import { useTheme } from '../../context/ThemeContext';
import { movies } from '../../data/movies';

export default function MovieDetails() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams(); // dynamic segment from /movie/[id]
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const movie = movies.find((m) => m.id === id);

  if (!movie) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Movie not found.</Text>
        <CustomButton title="BACK" onPress={() => router.back()} />
      </View>
    );
  }

  const genres = movie.genre.split('/').map((g) => g.trim());

  const openTrailer = async () => {
    try {
      await Linking.openURL(movie.trailerUrl);
    } catch {
      Alert.alert('Trailer', 'Could not open the trailer link.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={movie.image} style={styles.poster} resizeMode="cover" />

        <View style={styles.body}>
          <Text style={styles.title}>{movie.title}</Text>

          <View style={styles.genreRow}>
            {genres.map((genre) => (
              <View key={genre} style={styles.genreChip}>
                <Text style={styles.genreChipText}>{genre}</Text>
              </View>
            ))}
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>DURATION</Text>
              <Text style={styles.infoValue}>{movie.duration}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>RELEASED</Text>
              <Text style={styles.infoValue}>{movie.releaseDate}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>SYNOPSIS</Text>
          <Text style={styles.paragraph}>{movie.synopsis}</Text>

          <Text style={styles.sectionTitle}>DIRECTOR</Text>
          <Text style={styles.paragraph}>{movie.director}</Text>

          <Text style={styles.sectionTitle}>CAST</Text>
          <View style={styles.castRow}>
            {movie.cast.map((name) => (
              <View key={name} style={styles.castChip}>
                <Text style={styles.castText}>{name}</Text>
              </View>
            ))}
          </View>

          <CustomButton title="WATCH TRAILER" variant="outline" onPress={openTrailer} />
          <CustomButton title="BOOK TICKETS" onPress={() => router.push(`/showtimes/${movie.id}`)} />
        </View>
      </ScrollView>

      <Pressable style={[styles.backButton, { top: insets.top + 10 }]} onPress={() => router.back()}>
        <ArrowLeft color="#FFFFFF" size={22} />
      </Pressable>
    </View>
  );
}

const makeStyles = (c) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    content: { paddingBottom: 40 },
    poster: { width: '100%', height: 400 },
    backButton: {
      position: 'absolute', left: 16, width: 40, height: 40, borderRadius: 20,
      backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center',
    },
    body: { padding: 20 },
    title: { color: c.text, fontSize: 26, fontWeight: '900' },
    genreRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
    genreChip: { backgroundColor: c.accentSoft, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12 },
    genreChipText: { color: c.accent, fontSize: 12, fontWeight: 'bold' },
    infoCard: { flexDirection: 'row', backgroundColor: c.card, borderRadius: 8, padding: 16, marginTop: 20 },
    infoItem: { flex: 1 },
    infoLabel: { color: c.textDim, fontSize: 10, fontWeight: 'bold', letterSpacing: 1.5 },
    infoValue: { color: c.text, fontSize: 15, fontWeight: 'bold', marginTop: 6 },
    sectionTitle: { color: c.accent, fontSize: 14, fontWeight: '900', letterSpacing: 2, marginTop: 26, marginBottom: 10 },
    paragraph: { color: c.textMuted, fontSize: 14, lineHeight: 22 },
    castRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    castChip: { backgroundColor: c.card, borderWidth: 1, borderColor: c.border, borderRadius: 6, paddingVertical: 8, paddingHorizontal: 12 },
    castText: { color: c.text, fontSize: 13 },
    notFound: { flex: 1, backgroundColor: c.bg, justifyContent: 'center', padding: 30 },
    notFoundText: { color: c.text, fontSize: 18, textAlign: 'center' },
  });