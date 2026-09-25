import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen // define the screens in the stack navigator
        name="index"
        options={{ headerShown: false }} //hides the header for the login screen
      />

      <Stack.Screen
        name="signup"
        options={{ headerShown: false }} //hides the header for the signup screen
      />

      <Stack.Screen
        name="movies"
        options={{ headerShown: false }}
      />

     <Stack.Screen
        name="profile"
        options={{ headerShown: false }} //hides the header for the signup screen
      />

      <Stack.Screen
        name="showtimes"
        options={{ headerShown: false }} //hides the header for the signup screen
      />

    </Stack>
  );
}