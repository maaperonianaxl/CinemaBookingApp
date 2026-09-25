import { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Film } from 'lucide-react-native';

export default function GetStarted() {
  const router = useRouter();
  const drift = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const driftAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }),
      ])
    );

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    );

    driftAnimation.start();
    pulseAnimation.start();

    return () => {
      driftAnimation.stop();
      pulseAnimation.stop();
    };
  }, [drift, pulse]);

  const driftY = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [-18, 18],
  });

  const pulseOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.12, 0.3],
  });

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  return (
    <View style={styles.container}>
      {/* Animated background accents */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.glow,
          styles.glowTop,
          {
            opacity: pulseOpacity,
            transform: [{ translateY: driftY }, { scale: pulseScale }],
          },
        ]}
      />

      <Animated.View
        pointerEvents="none"
        style={[
          styles.glow,
          styles.glowBottom,
          {
            opacity: pulseOpacity,
            transform: [{ translateY: Animated.multiply(driftY, -1) }],
          },
        ]}
      />

      {/* Foreground content */}
      <View style={styles.content}>
        <Text style={styles.logo}>MOVIE MASTERS</Text>
        <Film size={48} color="#FF4655" style={{ alignSelf: 'center', marginBottom: 20 }} />

        <Text style={styles.title}>
          Your next movie{'\n'}experience starts here.
        </Text>

        <Text style={styles.subtitle}>
          Browse movies, find your next favourite, and book your seats.
        </Text>

        <Pressable
          style={styles.button}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.buttonText}>GET STARTED</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101113',
    justifyContent: 'center',
    padding: 25,
    overflow: 'hidden',
  },

  glow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#FF4655',
  },

  glowTop: {
    top: -120,
    right: -100,
  },

  glowBottom: {
    bottom: -150,
    left: -120,
    width: 330,
    height: 330,
    borderRadius: 165,
  },

  content: {
    zIndex: 1,
  },

  logo: {
    color: '#FF4655',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 4,
    textAlign: 'center',
    marginBottom: 35,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 42,
    textAlign: 'center',
  },

  subtitle: {
    color: '#AAAAAA',
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 35,
  },

  button: {
    backgroundColor: '#FF4655',
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 2,
  },
});