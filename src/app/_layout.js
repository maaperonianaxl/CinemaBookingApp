import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack initialRouteName="Get_started">
      <Stack.Screen
        name="Get_started"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="signup"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="movies"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="profile"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}