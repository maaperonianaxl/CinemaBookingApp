import { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import AnimatedBackground from '../components/AnimatedBackground';
import { useTheme } from '../context/ThemeContext';

export default function GetStarted() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <AnimatedBackground />

      <View style={styles.content}>
        <Text style={styles.logo}>MOVIE MASTERS</Text>
        <Image source={require('../../assets/images/icon.png')} style={styles.logoImage} />

        <Text style={styles.title}>Your next movie{'\n'}experience starts here.</Text>
        <Text style={styles.subtitle}>Browse movies, find your next favourite, and book your seats.</Text>

        <Pressable style={styles.button} onPress={() => router.push('/login')}>
          <Text style={styles.buttonText}>GET STARTED</Text>
        </Pressable>
      </View>
    </View>
  );
}

const makeStyles = (c) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg, justifyContent: 'center', padding: 25, overflow: 'hidden' },
    content: { zIndex: 1 },
    logo: { color: c.accent, fontSize: 16, fontWeight: '900', letterSpacing: 4, textAlign: 'center', marginBottom: 35 },
    logoImage: { width: 96, height: 96, borderRadius: 22, alignSelf: 'center', marginBottom: 24 },
    title: { color: c.text, fontSize: 34, fontWeight: '900', lineHeight: 42, textAlign: 'center' },
    subtitle: { color: c.textMuted, fontSize: 15, lineHeight: 23, textAlign: 'center', marginTop: 16, marginBottom: 35 },
    button: { backgroundColor: c.accent, borderRadius: 4, padding: 16, alignItems: 'center' },
    buttonText: { color: c.onAccent, fontSize: 15, fontWeight: '900', letterSpacing: 2 },
  });