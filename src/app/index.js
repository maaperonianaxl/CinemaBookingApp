import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View, } from 'react-native';

import { useRouter } from 'expo-router';

import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';

export default function Login() {
  const router = useRouter(); //navigate between screens
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isValidEmail = (email) => { // Function to validate email format
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailPattern.test(email);
};

  const login = () => {
  if (email.trim() === '' || password === '') {
    Alert.alert(
      'Error',
      'Please fill in all fields.'
    );
    return;
  }

  if (!isValidEmail(email.trim())) {
    Alert.alert(
      'Invalid Email',
      'Please enter a valid email address.'
    );
    return;
  }

  router.push('/movies');
};

  return (
    <View style={styles.container}>

      <Text style={styles.title}> Movie Masters </Text>

      <Text style={styles.subtitle}> Welcome to Movie Masters! Browse and book movies easily. </Text>

      <InputField
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />

      <InputField
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <CustomButton title="LOGIN" onPress={login}/>

      <View style={styles.bottom}>

        <Text style={styles.text}> Don't have an account? </Text>

        <Pressable
          onPress={() => router.push('/signup')}
        >
          <Text style={styles.link}>
            {' '}Sign Up
          </Text>
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
  },

  title: {
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    color: '#FF4655',
    marginBottom: 15,
    letterSpacing: 3,
  },

  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 35,
    color: '#AAAAAA',
  },

  bottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },

  link: {
    color: '#FF4655',
    fontWeight: 'bold',
  },

  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

});

