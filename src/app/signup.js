import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View, } from 'react-native';

import { useRouter } from 'expo-router';

import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';

export default function Signup() {

  const router = useRouter(); //navigate between screens

  const isValidEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailPattern.test(email);
};

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const signup = () => {
  if (
    name.trim() === '' ||
    email.trim() === '' ||
    password === ''
  ) {
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

  if (password.length < 8) {
    Alert.alert(
      'Weak Password',
      'Password must be at least 8 characters.'
    );
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert(
      'Password Mismatch',
      'Password and Confirm Password do not match.'
    );
    return;
  }
    
    // check logs if values are captured correctly
    console.log(name);
    console.log(email);
    console.log(password);
    console.log(confirmPassword);

    Alert.alert('Success', 'Account created successfully WAAHOOOO!' );

    // Clear the fields
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        SIGN UP
      </Text>

      <InputField
        label="Name"
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />

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

      <InputField
        label="Confirm Password"
        placeholder="Confirm your password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
      />

      <CustomButton
        title="SIGN UP"
        onPress={signup}
      />

      <View style={styles.bottom}>

        <Text style={styles.text}>
          Already have an account?
        </Text>

        <Pressable
          onPress={() => router.push('/')}
        >
          <Text style={styles.link}>
            {' '}Login
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
    marginBottom: 30,
    letterSpacing: 3,
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
  },
   
});