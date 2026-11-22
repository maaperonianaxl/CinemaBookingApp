import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import AnimatedBackground from '../components/AnimatedBackground';
import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function Signup() {
  const router = useRouter();
  const { startSignup } = useAuth();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = () => {
    if (name.trim() === '' || email.trim() === '' || password === '') {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (!isValidEmail(email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Weak Password', 'Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Password and Confirm Password do not match.');
      return;
    }

    // The account is created after the OTP step
    startSignup({ name, email, password });
    router.push('/otp');
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />

      <View style={styles.content}>
        <Text style={styles.title}>SIGN UP</Text>

        <InputField label="Name" placeholder="Enter your name" value={name} onChangeText={setName} autoCapitalize="words" />
        <InputField label="Email" placeholder="Enter your email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <InputField label="Password" placeholder="Enter your password" value={password} onChangeText={setPassword} secureTextEntry />
        <InputField label="Confirm Password" placeholder="Confirm your password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

        <CustomButton title="SIGN UP" onPress={handleSignup} />

        <View style={styles.bottom}>
          <Text style={styles.text}>Already have an account?</Text>
          <Pressable onPress={() => router.push('/login')}>
            <Text style={styles.link}> Login</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const makeStyles = (c) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg, justifyContent: 'center', padding: 25, overflow: 'hidden' },
    content: { zIndex: 1 },
    title: { fontSize: 36, fontWeight: '900', textAlign: 'center', color: c.accent, marginBottom: 30, letterSpacing: 3 },
    bottom: { flexDirection: 'row', justifyContent: 'center', marginTop: 25 },
    link: { color: c.accent, fontWeight: 'bold' },
    text: { color: c.text },
  });