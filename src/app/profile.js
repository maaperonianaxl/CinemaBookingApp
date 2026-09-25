import { StyleSheet, Text } from 'react-native';

import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
  const router = useRouter();
 
  //lets find a way to get the user info from the login/signup screen and display it here

 return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>User Profile</Text>
      <Text style={styles.name}>Not finished</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101113',
    padding: 25,
    justifyContent: 'center',
  },

  header: {
    fontSize: 25,
    fontWeight: '900',
    color: '#FF4655',
    textAlign: 'center',
    letterSpacing: 3,
    marginBottom: 30,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF4655',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 15,
  },

  avatarText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  email: {
    fontSize: 14,
    color: '#AAAAAA',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 30,
  },

  card: {
    backgroundColor: '#1C1D21',
    padding: 20,
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#FF4655',
    marginBottom: 25,
  },

  sectionTitle: {
    color: '#FF4655',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 20,
  },

  label: {
    color: '#888888',
    fontSize: 12,
    marginBottom: 5,
  },

  value: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },

  divider: {
    height: 1,
    backgroundColor: '#3A3B40',
    marginVertical: 15,
  },

  button: {
    backgroundColor: '#FF4655',
    padding: 15,
    alignItems: 'center',
    borderRadius: 4,
    marginBottom: 12,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: 1,
  },

  logoutButton: {
    borderWidth: 1,
    borderColor: '#FF4655',
    padding: 14,
    alignItems: 'center',
    borderRadius: 4,
  },

  logoutText: {
    color: '#FF4655',
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  backButton: {
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#AAAAAA',
    padding: 12,
    borderRadius: 4,
  },

  backText: {
    color: '#AAAAAA',
    fontSize: 13,
  },
});