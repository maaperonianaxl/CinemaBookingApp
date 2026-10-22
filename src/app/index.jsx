import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Film } from 'lucide-react-native';
import AnimatedBackground from '../components/Animatedbackground';

export default function GetStarted() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <AnimatedBackground />

      <View style={styles.content}>
        <Text style={styles.logo}>MOVIE MASTERS</Text>
        <Film size={48} color="#FF4655" style={{ alignSelf: 'center', marginBottom: 20 }} />

        <Text style={styles.title}>Your next movie{'\n'}experience starts here.</Text>
        <Text style={styles.subtitle}>
          Browse movies, find your next favourite, and book your seats.
        </Text>

        <Pressable style={styles.button} onPress={() => router.push('/login')}>
          <Text style={styles.buttonText}>GET STARTED</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#101113', justifyContent: 'center', padding: 25, overflow: 'hidden' },
  content: { zIndex: 1 },
  logo: { color: '#FF4655', fontSize: 16, fontWeight: '900', letterSpacing: 4, textAlign: 'center', marginBottom: 35 },
  title: { color: '#FFFFFF', fontSize: 34, fontWeight: '900', lineHeight: 42, textAlign: 'center' },
  subtitle: { color: '#AAAAAA', fontSize: 15, lineHeight: 23, textAlign: 'center', marginTop: 16, marginBottom: 35 },
  button: { backgroundColor: '#FF4655', borderRadius: 4, padding: 16, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900', letterSpacing: 2 },
});