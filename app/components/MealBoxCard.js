import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function MealBoxCard({ box, isAdmin, onOrder, onDelete, onRestock }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{box.name}</Text>
      <Text>{box.description}</Text>
      <Text>Calories: {box.calories} kcal</Text>
      <Text>Price: ${box.price?.toFixed(2)}</Text>
      <Text>Stock Available: {box.stockAvailable}</Text>

      {isAdmin ? (
        <TouchableOpacity onPress={() => onDelete(box._id)} style={styles.deleteBtn}>
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      ) : box.stockAvailable > 0 ? (
        <TouchableOpacity onPress={() => onOrder(box)} style={styles.orderBtn}>
          <Text style={styles.btnText}>Order Meal Box</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => onRestock(box._id)} style={styles.orderBtn}>
          <Text style={styles.btnText}>Request Restock</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
