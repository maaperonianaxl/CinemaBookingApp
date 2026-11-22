import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

// Keep the splash screen visible until the saved session and theme are loaded
SplashScreen.preventAutoHideAsync();

function Navigator() {
  const { user, loading } = useAuth();
  const { mode, ready } = useTheme();
  const isReady = !loading && ready;

  useEffect(() => {
    if (isReady) SplashScreen.hideAsync();
  }, [isReady]);

  if (!isReady) return null;

  return (
    <>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        {/* Signed-in screens */}
        <Stack.Protected guard={!!user}>
          <Stack.Screen name="movies" />
          <Stack.Screen name="movie/[id]" />
          <Stack.Screen name="showtimes/[id]" />
          <Stack.Screen name="seats/[id]" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="settings" />
        </Stack.Protected>

        {/* Signed-out screens */}
        <Stack.Protected guard={!user}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="otp" />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Navigator />
      </AuthProvider>
    </ThemeProvider>
  );
}