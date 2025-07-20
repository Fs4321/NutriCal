import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert, StyleSheet } from 'react-native';

const BASE_URL = 'http://192.168.1.118:3000/api';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    first_name: '',
    family_name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    email_id: '',
    password: '',
    dietary_preference: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });

    // Live validation
    if (key === 'age') {
      if (Number(value) < 18) {
        setErrors(prev => ({ ...prev, age: 'Age must be at least 18.' }));
      } else {
        setErrors(prev => ({ ...prev, age: '' }));
      }
    }

    if (key === 'email_id') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setErrors(prev => ({
        ...prev,
        email_id: emailPattern.test(value) ? '' : 'Invalid email format (e.g., name@example.com)',
      }));
    }

    if (key === 'password') {
      const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
      setErrors(prev => ({
        ...prev,
        password: passwordPattern.test(value)
          ? ''
          : 'Password must be at least 6 characters, include 1 letter and 1 number.',
      }));
    }
  };

  const handleRegister = async () => {
    // Final validation before sending
    if (Object.values(errors).some(e => e)) {
      Alert.alert('Validation Error', 'Please fix all validation errors first.');
      return;
    }

    if (Object.values(form).some(val => !val.trim())) {
      Alert.alert('Missing Fields', 'Please fill in all the fields.');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const text = await response.text();
      console.log("Register response:", text);

      if (!response.ok) {
        Alert.alert('Registration Failed', text || 'Something went wrong.');
        return;
      }

      Alert.alert('Success', 'Registration successful! You can now log in.');
      navigation.navigate('Login');
    } catch (error) {
      console.error("Registration error:", error.message);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register for NutriCal</Text>

      {[
        ['first_name', 'First Name'],
        ['family_name', 'Family Name'],
        ['age', 'Age'],
        ['gender', 'Gender (male/female)'],
        ['height', 'Height (cm)'],
        ['weight', 'Weight (kg)'],
        ['email_id', 'Email'],
        ['password', 'Password (min 6 chars)'],
        ['dietary_preference', 'Dietary Preference'],
      ].map(([key, placeholder]) => (
        <View key={key}>
          <TextInput
            placeholder={placeholder}
            value={form[key]}
            onChangeText={(val) => handleChange(key, val)}
            keyboardType={['age', 'height', 'weight'].includes(key) ? 'numeric' : 'default'}
            secureTextEntry={key === 'password'}
            style={styles.input}
          />
          {errors[key] ? <Text style={styles.errorText}>{errors[key]}</Text> : null}
        </View>
      ))}

      <Button title="Register" onPress={handleRegister} color="#996515" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fdf9f4',
    flexGrow: 1,
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 6,
    padding: 10,
    borderRadius: 6,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    marginLeft: 4,
  },
});
