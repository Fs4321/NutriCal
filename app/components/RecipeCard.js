import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function RecipeCard({ recipe, selectedMealType, onMealTypeChange, onAddToLog }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{recipe.name}</Text>
      <Text>Calories: {recipe.caloriesPerServing?.toFixed(1)} / serving</Text>
      <Text>Protein: {recipe.proteinPerServing?.toFixed(1)}g</Text>
      <Text>Fat: {recipe.fatPerServing?.toFixed(1)}g</Text>
      <Text>Carbs: {recipe.carbsPerServing?.toFixed(1)}g</Text>

      <Picker
        selectedValue={selectedMealType || ''}
        onValueChange={onMealTypeChange}
        style={styles.picker}
      >
        <Picker.Item label="Select Meal Type" value="" />
        <Picker.Item label="Breakfast" value="breakfast" />
        <Picker.Item label="Lunch" value="lunch" />
        <Picker.Item label="Dinner" value="dinner" />
        <Picker.Item label="Snacks" value="snacks" />
      </Picker>

      <Button
        title="+ Add to Meal Log"
        onPress={onAddToLog}
        color="#996515"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 6,
    marginVertical: 10,
    backgroundColor: "#fff"
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  picker: {
    height: 50,
    width: "100%",
    marginVertical: 10,
  }
});
