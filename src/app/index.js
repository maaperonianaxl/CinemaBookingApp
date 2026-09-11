import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View, } from 'react-native';

import { useRouter } from 'expo-router';

import InputField from '../components/InputField';

export default function Login() {
  const router = useRouter(); //navigate between screens
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = () => {
    if (email !== '' && password !== '') {
      Alert.alert( 'Hello User!', 'Login Successfully!' );
    } else {
      Alert.alert( 'Error', 'Please fill in all fields.' ); // check if any field is empty
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}> LOGIN </Text>

      <Text style={styles.subtitle}> Please enter your email & password to login. </Text>

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
      <BuCustomtton title="LOGIN" onPress={login}/>

      <View style={styles.bottom}>

        <Text> Don't have an account? </Text>

        <Pressable> 
          onPress={() => router.push('/signup')}
        </Pressable>

          <Text style={styles.link}>
            {' '}Sign Up
          </Text>
          
          <Pressable
          onPress={() => router.push('/profile')}
        >
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

  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: 'gray',
    fontFamily: 'Arial',
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

