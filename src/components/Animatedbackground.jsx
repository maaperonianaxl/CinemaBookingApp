import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

export default function AnimatedBackground() {
  const drift = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = (value, duration) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, { toValue: 1, duration, useNativeDriver: true }),
          Animated.timing(value, { toValue: 0, duration, useNativeDriver: true }),
        ])
      );
    const a = loop(drift, 5000);
    const b = loop(pulse, 2500);
    a.start();
    b.start();
    return () => {
      a.stop();
      b.stop();
    };
  }, [drift, pulse]);

  const driftY = drift.interpolate({ inputRange: [0, 1], outputRange: [-18, 18] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.12, 0.3] });
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] });

  return (
    <>
      <Animated.View
        pointerEvents="none"
        style={[styles.glow, styles.glowTop, { opacity, transform: [{ translateY: driftY }, { scale }] }]}
      />
      <Animated.View
        pointerEvents="none"
        style={[styles.glow, styles.glowBottom, { opacity, transform: [{ translateY: Animated.multiply(driftY, -1) }] }]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  glow: { position: 'absolute', width: 280, height: 280, borderRadius: 140, backgroundColor: '#FF4655' },
  glowTop: { top: -120, right: -100 },
  glowBottom: { bottom: -150, left: -120, width: 330, height: 330, borderRadius: 165 },
});