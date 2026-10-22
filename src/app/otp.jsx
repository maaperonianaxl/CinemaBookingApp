import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';

const DUMMY_CODE = '1234'; // demo only

export default function Otp() {
  const router = useRouter();
  const [digits, setDigits] = useState(['', '', '', '']);
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    const next = [...digits];
    next[index] = text.replace(/[^0-9]/g, '');
    setDigits(next);
    if (next[index] && index < 3) inputs.current[index + 1]?.focus();
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && digits[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const verify = () => {
    if (digits.join('') !== DUMMY_CODE) {
      Alert.alert('Invalid Code', `Wrong code. For this demo, use ${DUMMY_CODE}.`);
      return;
    }
    router.replace('/movies');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Account Verification</Text>
      <Text style={styles.hint}>Enter the 4-digit code (demo: {DUMMY_CODE})</Text>

      <View style={styles.otpRow}>
        {digits.map((digit, i) => (
          <InputField
            key={i}
            ref={(el) => (inputs.current[i] = el)}
            value={digit}
            onChangeText={(t) => handleChange(t, i)}
            onKeyPress={(e) => handleKeyPress(e, i)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
            containerStyle={{ marginBottom: 0 }}
            style={styles.otpInput}
          />
        ))}
      </View>

      <CustomButton title="VERIFY" onPress={verify} />
      <Text style={styles.resend}>
        Didn't receive the code? <Text style={styles.resendLink}>Resend</Text>
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#101113', justifyContent: 'center', padding: 30 },
  title: { fontSize: 28, fontWeight: '900', textAlign: 'center', color: '#FF4655', letterSpacing: 2 },
  hint: { color: '#AAAAAA', textAlign: 'center', marginTop: 10, marginBottom: 30 },
  otpRow: { flexDirection: 'row', justifyContent: 'center', gap: 14 },
  otpInput: { width: 56, height: 60, fontSize: 22, fontWeight: 'bold', padding: 0 },
  resend: { color: '#FFFFFF', textAlign: 'center', marginTop: 16 },
  resendLink: { color: '#FF4655', fontWeight: 'bold' },
});