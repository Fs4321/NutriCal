import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.1.118:3000/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter both email and password');
      return;
    }

    const payload = { email_id: email.trim(), password: password.trim() };

    try {
      console.log("Sending login request:", payload);

      const response = await fetch(`${BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      console.log("Raw response:", text);
      console.log("Status code:", response.status);

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
        Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
      return;
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        Alert.alert('Error', 'Invalid server response format');
        return;
      }

      await AsyncStorage.setItem('token', data.accessToken);
      Alert.alert('Login Successful!');
      navigation.navigate('Dashboard');
    } catch (error) {
      console.log("Login error:", error.message);
      Alert.alert('Login Exception', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        autoCapitalize="none"
        style={styles.input}
      />

      <Text style={styles.label}>Password:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
        style={styles.input}
      />

      <Button title="Login" onPress={handleLogin} color="#996515"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fdf9f4' },
  label: { fontSize: 16, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 14,
    padding: 10,
    borderRadius: 6,
  },
});
