import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function InputField({ label, placeholder, value, onChangeText, secureTextEntry = false,}) {
  return (
    
    <View style={styles.container}>

      <Text style={styles.label}>
        {label}
      </Text>

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },

  label: {
    fontSize: 16,
    marginBottom: 5,
  },

  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
  },
});