import { StyleSheet, Text, View } from 'react-native';

export default function CreditScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Credit Information</Text>
      <Text style={styles.text}>Credits available: 1500</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  title: {
    color: '#34D399',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    color: '#A7F3D0',
    fontSize: 16,
  },
});