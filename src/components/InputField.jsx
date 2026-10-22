import { forwardRef } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

const InputField = forwardRef(function InputField(
  { label, style, containerStyle, ...props },
  ref
) {
  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        ref={ref}
        style={[styles.input, style]}
        placeholderTextColor="#888888"
        autoCapitalize="none"
        {...props}
      />
    </View>
  );
});

export default InputField;

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { color: '#FFFFFF', fontWeight: 'bold', marginBottom: 6 },
  input: {
    backgroundColor: '#1C1D21',
    borderWidth: 1,
    borderColor: '#3A3B40',
    borderRadius: 4,
    padding: 14,
    color: '#FFFFFF',
    fontSize: 14,
  },
});