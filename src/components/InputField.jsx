
import { forwardRef } from 'react';
import { Text, TextInput, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const InputField = forwardRef(function InputField(
  { label, style, containerStyle, rightAccessory, ...props },
  ref
) {
  const { colors } = useTheme();

  const inputStyle = {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    padding: 14,
    color: colors.text,
    fontSize: 14,
  };

  return (
    <View style={[{ marginBottom: 16 }, containerStyle]}>
      {label ? (
        <Text style={{
          color: colors.text,
          fontWeight: 'bold',
          marginBottom: 6,
        }}>
          {label}
        </Text>
      ) : null}

      {rightAccessory ? (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 4,
          paddingRight: 12,
        }}>
          <TextInput
            ref={ref}
            placeholderTextColor={colors.textDim}
            autoCapitalize="none"
            {...props}
            style={[
              inputStyle,
              {
                flex: 1,
                borderWidth: 0,
                backgroundColor: 'transparent',
              },
              style,
            ]}
          />
          {rightAccessory}
        </View>
      ) : (
        <TextInput
          ref={ref}
          placeholderTextColor={colors.textDim}
          autoCapitalize="none"
          style={[inputStyle, style]}
          {...props}
        />
      )}
    </View>
  );
});

export default InputField;
