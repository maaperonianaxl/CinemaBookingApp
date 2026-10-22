import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import AnimatedBackground from '../components/Animatedbackground';
import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = () => {
    if (email.trim() === '' || password === '') {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (!isValidEmail(email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    router.replace('/movies');
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />

      <View style={styles.content}>
        <Text style={styles.title}>Movie Masters</Text>
        <Text style={styles.subtitle}>Welcome to Movie Masters! Browse and book movies easily.</Text>

        <InputField
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <InputField
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <CustomButton title="LOGIN" onPress={login} />

        <View style={styles.bottom}>
          <Text style={styles.text}>Don't have an account?</Text>
          <Pressable onPress={() => router.push('/signup')}>
            <Text style={styles.link}> Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#101113', justifyContent: 'center', padding: 25, overflow: 'hidden' },
  content: { zIndex: 1 },
  title: { fontSize: 36, fontWeight: '900', textAlign: 'center', color: '#FF4655', marginBottom: 15, letterSpacing: 3 },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 35, color: '#AAAAAA' },
  bottom: { flexDirection: 'row', justifyContent: 'center', marginTop: 25 },
  link: { color: '#FF4655', fontWeight: 'bold' },
  text: { color: '#FFFFFF', fontWeight: 'bold' },
});