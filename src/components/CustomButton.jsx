import { Pressable, StyleSheet, Text } from 'react-native';

export default function CustomButton({ title, onPress }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { backgroundColor: '#FF4655', borderRadius: 4, padding: 16, alignItems: 'center', marginTop: 20 },
  text: { color: '#FFFFFF', fontSize: 15, fontWeight: '900', letterSpacing: 2 },
});