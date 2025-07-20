import React, { useEffect, useState, useContext } from 'react';
import {
  View, Text, TextInput, Button, ScrollView, StyleSheet, Alert, TouchableOpacity, FlatList
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartContext } from '../context/Cart'; 
import MealBoxCard from '../components/MealBoxCard';

export default function MealBoxesScreen() {
  const BASE_URL = 'http://192.168.1.118:3000/api';

  const [mealBoxes, setMealBoxes] = useState([]);
  const [user, setUser] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const [order, setOrder] = useState('asc');

  const { addToCart } = useContext(CartContext); 

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchMealBoxes();
  }, [search, sortBy, order]);

  const fetchUser = async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/user/current`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setUser(data);
    setIsAdmin(data.is_admin);
  };

  const fetchMealBoxes = async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/mealbox?search=${search}&sortBy=${sortBy}&order=${order}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setMealBoxes(data.mealBoxes || []);
  };

  const handleOrder = async (box) => {
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/mealbox/order/${box._id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quantity: 1 })
    });

    if (res.ok) {
      addToCart(box); //Add to frontend cart
      Alert.alert('Success', 'Meal box added to cart!');
      fetchMealBoxes();
    } else {
      Alert.alert('Error', 'Could not place order.');
    }
  };

  const handleDelete = async (boxId) => {
    if (!isAdmin) return;
    const token = await AsyncStorage.getItem('token');

    const confirm = await new Promise(resolve =>
      Alert.alert("Confirm Delete", "Are you sure?", [
        { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
        { text: "Delete", style: "destructive", onPress: () => resolve(true) }
      ])
    );
    if (!confirm) return;

    const res = await fetch(`${BASE_URL}/mealbox/${boxId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      Alert.alert('Deleted');
      fetchMealBoxes();
    } else {
      Alert.alert('Error', 'Could not delete.');
    }
  };

  const handleRestock = async (boxId) => {
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/mealbox/request/${boxId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      Alert.alert('Requested restock');
    } else {
      Alert.alert('Failed to request restock');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Meal Boxes</Text>

      <TextInput
        placeholder="Search meal boxes..."
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />

      <View style={styles.sortRow}>
        <Picker
          selectedValue={sortBy}
          style={styles.picker}
          onValueChange={(val) => setSortBy(val)}
        >
          <Picker.Item label="Price" value="price" />
          <Picker.Item label="Calories" value="calories" />
        </Picker>

        <Picker
          selectedValue={order}
          style={styles.picker}
          onValueChange={(val) => setOrder(val)}
        >
          <Picker.Item label="↓ Ascending" value="asc" />
          <Picker.Item label="↑ Descending" value="desc" />
        </Picker>
      </View>

      <FlatList
      data={mealBoxes}
      keyExtractor={(box) => box._id}
      renderItem={({ item }) => (
        <MealBoxCard
          box={item}
          isAdmin={isAdmin}
          onOrder={handleOrder}
          onDelete={handleDelete}
          onRestock={handleRestock}
        />
      )}
      ListEmptyComponent={<Text>No meal boxes found.</Text>}
      scrollEnabled={false}
    />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fdf9f4" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12, textAlign: "center" },
  input: {
    borderWidth: 1, borderRadius: 6, padding: 10, marginBottom: 12, backgroundColor: "#fff"
  },
  sortRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  picker: { flex: 1 },
  card: {
    padding: 16, borderWidth: 1, borderColor: "#ccc", borderRadius: 8,
    marginBottom: 16, backgroundColor: "#fff"
  },
  name: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  orderBtn: {
    backgroundColor: "#996515", padding: 10, marginTop: 10, borderRadius: 6
  },
  deleteBtn: {
    backgroundColor: "red", padding: 10, marginTop: 10, borderRadius: 6
  },
  btnText: { color: "#fff", textAlign: "center" },
});
