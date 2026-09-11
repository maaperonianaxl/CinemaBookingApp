import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function CustomButton({ title, onPress,}) {
  return (
    
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
    >
      <Text style={styles.text}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 45,
    backgroundColor: '#333',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});