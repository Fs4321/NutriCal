
import React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/splash-icon2.jpg')} style={styles.logo} />
      <Text style={styles.headline}>Get your next</Text>
      <Text style={styles.subheadline}>healthy lifestyle</Text>

      <View style={styles.buttons}>
        <Button title="Login" onPress={() => navigation.navigate('Login')} color="#996515"/>
        <View style={{ height: 12 }} />
        <Button title="Register" onPress={() => navigation.navigate('Register')} color="#996515"/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  logo: { width: 150, height: 150, marginBottom: 30 },
  headline: { fontSize: 24, color: '#0a2540' },
  subheadline: { fontSize: 28, fontWeight: 'bold', color: '#c5912c', marginBottom: 40 },
  buttons: { width: '100%' },
});
