import React from 'react';
import { Pressable, StyleSheet, Text, View, Image } from 'react-native';

export default function MovieCard({ movie, onPress }) {
  const imageSource = typeof movie.image === 'string'
    ? { uri: movie.image }
    : movie.image;

  return (
    <View style={styles.movieCard}>
      <Image source={imageSource} style={styles.movieImage} resizeMode="cover" />

      <View style={styles.infoContainer}>
        <Text style={styles.movieTitle} numberOfLines={2}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  movieCard: {
    backgroundColor: '#1C1D21',
    padding: 12,
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#FF4655',
    marginBottom: 15,
    flexDirection: 'row',
  },
  movieImage: {
    width: 110,
    height: 160,
    borderRadius: 4,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  movieTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  details: {
    color: '#AAAAAA',
    fontSize: 13,
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#FF4655',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1,
    alignSelf: 'center',
  },
});