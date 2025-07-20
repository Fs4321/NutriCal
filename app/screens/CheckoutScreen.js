import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { CartContext } from '../context/Cart';
import { useNavigation } from '@react-navigation/native';

export default function CheckoutScreen() {
  const navigation = useNavigation();
  const { clearCart } = useContext(CartContext);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConfirm = () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      Alert.alert("Missing fields", "Please fill out all fields.");
      return;
    }

    Alert.alert("Order Confirmed", "Thank you for your purchase!");
    clearCart();
    navigation.navigate('Dashboard');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Checkout</Text>
      <TextInput
        placeholder="Full Name"
        value={formData.fullName}
        onChangeText={(text) => handleChange('fullName', text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Phone Number"
        value={formData.phone}
        onChangeText={(text) => handleChange('phone', text)}
        keyboardType="phone-pad"
        style={styles.input}
      />
      <TextInput
        placeholder="Shipping Address"
        value={formData.address}
        onChangeText={(text) => handleChange('address', text)}
        multiline
        style={[styles.input, { height: 80 }]}
      />

      <View style={styles.buttonGroup}>
        <Button title="Confirm Order" onPress={handleConfirm} color="#996515"/>
        <Button title="Cancel" onPress={() => navigation.navigate('Dashboard')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fdf9f4', flex: 1 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  buttonGroup: { marginTop: 20, gap: 10 },
});
