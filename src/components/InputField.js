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
        placeholderTextColor="#888888"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FF4655',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  input: {
    height: 50,
    backgroundColor: '#1C1D21',
    borderWidth: 1,
    borderColor: '#3A3B40',
    borderRadius: 4,
    paddingHorizontal: 15,
    fontSize: 15,
    color: '#ffffff',
  },
});