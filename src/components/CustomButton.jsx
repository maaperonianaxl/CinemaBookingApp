import { ActivityIndicator, Pressable, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';

// variant: 'primary' (filled) or 'outline'
export default function CustomButton({ title, onPress, loading = false, disabled = false, variant = 'primary', style }) {
  const { colors } = useTheme();
  const filled = variant === 'primary';
  const inactive = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      style={[
        {
          minHeight: 52,
          backgroundColor: filled ? colors.accent : 'transparent',
          borderWidth: filled ? 0 : 1,
          borderColor: colors.accent,
          borderRadius: 4,
          paddingHorizontal: 16,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 20,
          opacity: inactive ? 0.55 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={filled ? colors.onAccent : colors.accent} />
      ) : (
        <Text style={{ color: filled ? colors.onAccent : colors.accent, fontSize: 15, fontWeight: '900', letterSpacing: 2 }}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}