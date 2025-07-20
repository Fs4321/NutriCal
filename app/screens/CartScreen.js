
import React, { useContext } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { CartContext } from '../context/Cart';
import { useNavigation } from '@react-navigation/native';

export default function CartScreen() {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigation = useNavigation();

  const total = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name} (x{item.quantity || 1}) - ${item.price}</Text>
          </View>
        )}
      />
      <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
      <View style={styles.buttonGroup}>
        <Button title="Proceed to Checkout" onPress={() => navigation.navigate('Checkout')} color="#996515"/>
        <Button title="Cancel" onPress={() => navigation.navigate('Dashboard')} color="#996515"/>
        <Button title="Clear Cart" onPress={clearCart} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fdf9f4', flex: 1 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  item: { paddingVertical: 8, borderBottomWidth: 1, borderColor: '#ddd' },
  total: { marginTop: 20, fontSize: 18 },
  buttonGroup: { marginTop: 20, gap: 10 }
});
