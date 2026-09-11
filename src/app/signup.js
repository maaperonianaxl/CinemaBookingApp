import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View, } from 'react-native';

import { useRouter } from 'expo-router';

import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';

export default function Signup() {

  const router = useRouter(); //navigate between screens

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const signup = () => { 

    if (
      name === '' ||
      email === '' ||
      password === ''
    ) {
      Alert.alert( 'Error', 'Please fill in all fields.'); // check if any field is empty

      return;

    }
    // check if password and confirm password match 
    if (password !== confirmPassword) {
      Alert.alert( 'Error', 'Passwords do not match.' );
      return;
    }
    
    // check logs if values are captured correctly
    //console.log(name);
    //console.log(email);
    //console.log(password);
    //console.log(confirmPassword);

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

        <Text>
          Already have an account?
        </Text>

        <Pressable
          onPress={() => router.push('/')}
        >
          <Text style={styles.link}>
            {' '}Login
          </Text>

          <Text style={styles.link}>
            {' '}Profile
          </Text>
        </Pressable>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 25,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },

  bottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },

  link: {
    color: 'blue',
    fontWeight: 'bold',
  },
});