import { forwardRef } from 'react';
import { Text, TextInput, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const InputField = forwardRef(function InputField({ label, style, containerStyle, ...props }, ref) {
  const { colors } = useTheme();

  return (
    <View style={[{ marginBottom: 16 }, containerStyle]}>
      {label ? <Text style={{ color: colors.text, fontWeight: 'bold', marginBottom: 6 }}>{label}</Text> : null}
      <TextInput
        ref={ref}
        placeholderTextColor={colors.textDim}
        autoCapitalize="none"
        style={[
          {
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 4,
            padding: 14,
            color: colors.text,
            fontSize: 14,
          },
          style,
        ]}
        {...props}
      />
    </View>
  );
});

export default InputField;