import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

export const palettes = {
  dark: {
    bg: '#101113',
    card: '#1C1D21',
    cardAlt: '#292A30',
    border: '#3A3B40',
    borderStrong: '#444444',
    divider: '#33343A',
    text: '#FFFFFF',
    textMuted: '#AAAAAA',
    textDim: '#888888',
    accent: '#FF4655',
    accentSoft: '#332024',
    onAccent: '#FFFFFF',
  },
  light: {
    bg: '#F4F4F6',
    card: '#FFFFFF',
    cardAlt: '#ECECF0',
    border: '#D6D6DD',
    borderStrong: '#C4C4CD',
    divider: '#E3E3E9',
    text: '#16171A',
    textMuted: '#55565D',
    textDim: '#7B7C84',
    accent: '#E63946',
    accentSoft: '#FDE7EA',
    onAccent: '#FFFFFF',
  },
};

const ThemeContext = createContext(null);
export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const system = useColorScheme();
  const [preference, setPreference] = useState('dark'); // 'dark' | 'light' | 'system'
  const [ready, setReady] = useState(false);

  // Restore the saved theme
  useEffect(() => {
    AsyncStorage.getItem('theme')
      .then((saved) => {
        if (saved === 'dark' || saved === 'light' || saved === 'system') setPreference(saved);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const setTheme = (value) => {
    setPreference(value);
    AsyncStorage.setItem('theme', value).catch(() => {});
  };

  const mode = preference === 'system' ? (system === 'light' ? 'light' : 'dark') : preference;

  const value = useMemo(
    () => ({ colors: palettes[mode], mode, preference, setTheme, ready }),
    [mode, preference, ready]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}