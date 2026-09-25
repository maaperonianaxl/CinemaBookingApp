import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Alert, Animated, Pressable, StyleSheet, Text, View, } from 'react-native';

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

  const drift = useRef(new Animated.Value(0)).current;
const pulse = useRef(new Animated.Value(0)).current;

useEffect(() => {
  const driftAnimation = Animated.loop(
    Animated.sequence([
      Animated.timing(drift, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: true,
      }),
      Animated.timing(drift, {
        toValue: 0,
        duration: 5000,
        useNativeDriver: true,
      }),
    ])
  );

  const pulseAnimation = Animated.loop(
    Animated.sequence([
      Animated.timing(pulse, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true,
      }),
      Animated.timing(pulse, {
        toValue: 0,
        duration: 2500,
        useNativeDriver: true,
      }),
    ])
  );

  driftAnimation.start();
  pulseAnimation.start();

  return () => {
    driftAnimation.stop();
    pulseAnimation.stop();
  };
}, [drift, pulse]);

const driftY = drift.interpolate({
  inputRange: [0, 1],
  outputRange: [-18, 18],
});

const pulseOpacity = pulse.interpolate({
  inputRange: [0, 1],
  outputRange: [0.12, 0.3],
});

const pulseScale = pulse.interpolate({
  inputRange: [0, 1],
  outputRange: [1, 1.2],
});

  return (
    
    <View style={styles.container}>
      <Animated.View
  pointerEvents="none"
  style={[
    styles.glow,
    styles.glowTop,
    {
      opacity: pulseOpacity,
      transform: [{ translateY: driftY }, { scale: pulseScale }],
    },
  ]}
/>

<Animated.View
  pointerEvents="none"
  style={[
    styles.glow,
    styles.glowBottom,
    {
      opacity: pulseOpacity,
      transform: [{ translateY: Animated.multiply(driftY, -1) }],
    },
  ]}
/>
<View style={styles.content}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101113',
    justifyContent: 'center',
    padding: 25,
    overflow: 'hidden',
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
   glow: {
  position: 'absolute',
  width: 280,
  height: 280,
  borderRadius: 140,
  backgroundColor: '#FF4655',
},

glowTop: {
  top: -120,
  right: -100,
},

glowBottom: {
  bottom: -150,
  left: -120,
  width: 330,
  height: 330,
  borderRadius: 165,
},

content: {
  zIndex: 1,
},
});