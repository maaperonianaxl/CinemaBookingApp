
import { Pressable, Text, View } from 'react-native';


import { useRouter } from 'expo-router';


export default function profile() {

  const router = useRouter(); //navigate between screens
return (
  <View>
    <Text>Profile</Text>
    
    <Pressable> 
          onPress={() => router.push('/profile')}
        </Pressable>
  </View>
)}
