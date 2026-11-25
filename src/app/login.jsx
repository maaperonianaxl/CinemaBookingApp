
import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AnimatedBackground from '../components/AnimatedBackground';
import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (email.trim() === '' || password === '') {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (!isValidEmail(email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.ok) Alert.alert('Login Failed', result.error);
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />

      <View style={styles.content}>
        <Text style={styles.title}>Movie Masters</Text>
        <Text style={styles.subtitle}>
          Welcome to Movie Masters! Browse and book movies easily.
        </Text>

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
          secureTextEntry={!showPassword}
          rightAccessory={
            <Pressable
              onPress={() => setShowPassword((previous) => !previous)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff size={20} color={colors.textMuted} />
              ) : (
                <Eye size={20} color={colors.textMuted} />
              )}
            </Pressable>
          }
        />

        <CustomButton
          title="LOGIN"
          onPress={handleLogin}
          loading={loading}
        />

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

const makeStyles = (c) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.bg,
      justifyContent: 'center',
      padding: 25,
      overflow: 'hidden',
    },
    content: { zIndex: 1 },
    title: {
      fontSize: 36,
      fontWeight: '900',
      textAlign: 'center',
      color: c.accent,
      marginBottom: 15,
      letterSpacing: 3,
    },
    subtitle: {
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 35,
      color: c.textMuted,
    },
    bottom: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 25,
    },
    link: { color: c.accent, fontWeight: 'bold' },
    text: { color: c.text, fontWeight: 'bold' },
  });
