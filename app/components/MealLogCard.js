import React from 'react';
import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';

export default function MealLogCard({ log, onDelete, city }) {
  return (
    <Pressable
      onLongPress={() =>
        Alert.alert(
          "Delete Meal Log",
          "Are you sure you want to delete this log?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", onPress: () => onDelete(log._id), style: "destructive" }
          ]
        )
      }
      style={styles.mealCard}
    >
      <Text>{new Date(log.date).toLocaleDateString()} — Total: {log.totalCalories?.toFixed(1)} kcal</Text>
      {log.recipes.map(recipe => (
        <Text key={recipe._id}>
          {recipe.name} — {recipe.caloriesPerServing?.toFixed(1)} kcal | Protein: {recipe.proteinPerServing?.toFixed(1)}g, Fat: {recipe.fatPerServing?.toFixed(1)}g, Carbs: {recipe.carbsPerServing?.toFixed(1)}g
        </Text>
      ))}
      <Text style={styles.locationTag}>
        📍 Meal logged in {city || 'your area'} on {new Date(log.date).toLocaleDateString()}
      </Text>
      <Text style={styles.deleteHint}>(Long press to delete)</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  mealCard: {
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  locationTag: {
    marginTop: 4,
    fontSize: 13,
    fontStyle: "italic",
    color: "#555"
  },
  deleteHint: {
    marginTop: 4,
    color: "#888",
    fontSize: 12,
    fontStyle: "italic"
  },
});
