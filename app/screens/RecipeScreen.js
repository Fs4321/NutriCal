import React, { useEffect, useState } from 'react';
import {View, Text, TextInput, Button, ScrollView, StyleSheet,FlatList, Alert, SafeAreaView} from 'react-native';
import RecipeCard from '../components/RecipeCard';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RecipeScreen() {
  const [user, setUser] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [ingredientQuantity, setIngredientQuantity] = useState(100);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [name, setName] = useState('');
  const [servings, setServings] = useState('1');
  const [mealTypeSelections, setMealTypeSelections] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const BASE_URL = 'http://192.168.1.118:3000/api';

  useEffect(() => {
    fetchUser();
    fetchIngredients();
    fetchRecipes(searchTerm);
  }, [searchTerm]);

  const fetchUser = async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/users/current`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setUser(data);
  };

  const fetchIngredients = async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/ingredient`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setIngredients(data.ingredients || []);
  };

  const fetchRecipes = async (term = '') => {
  const token = await AsyncStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/recipe?search=${term}&limit=50`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  setRecipes(data.recipes || []);
  setFilteredRecipes(data.recipes || []);
};

  const handleSearch = (text) => {
    setSearchTerm(text);
    const filtered = recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredRecipes(filtered);
  };

  const handleAddIngredient = () => {
    if (!selectedIngredient) return;
    if (!selectedIngredients.includes(selectedIngredient)) {
      setSelectedIngredients([...selectedIngredients, selectedIngredient]);
      setQuantities({ ...quantities, [selectedIngredient]: ingredientQuantity });
    }
    setSelectedIngredient('');
    setIngredientQuantity(100);
  };

  const handleCreateRecipe = async () => {
    if (!name || selectedIngredients.length === 0) {
      Alert.alert("Missing fields", "Enter recipe name and select ingredients.");
      return;
    }

    const token = await AsyncStorage.getItem('token');
    const payload = {
      name,
      servings: parseInt(servings),
      ingredients: selectedIngredients.map(id => ({
        ingredientId: id,
        quantity: quantities[id]
      }))
    };

    const res = await fetch(`${BASE_URL}/recipe`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      Alert.alert("Success", "Recipe created.");
      setName('');
      setServings('1');
      setSelectedIngredients([]);
      setQuantities({});
      fetchRecipes();
    } else {
      Alert.alert("Error", "Could not create recipe.");
    }
  };

  const handleAddToMealLog = async (id) => {
  const token = await AsyncStorage.getItem('token');
  let mealType = mealTypeSelections[id];

  if (!mealType) {
    mealType = await AsyncStorage.getItem('selectedMealType') || 'breakfast';
  }

  const res = await fetch(`${BASE_URL}/meallog`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      recipeIds: [id],
      mealType
    })
  });

  if (res.ok) {
    Alert.alert("Added", `Recipe added to ${mealType}`);
  } else {
    Alert.alert("Error", "Could not log meal.");
  }
};


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Create Recipe</Text>

        <TextInput placeholder="Recipe name" value={name} onChangeText={setName} style={styles.input} />
        <TextInput placeholder="Servings" value={servings} onChangeText={setServings} keyboardType="numeric" style={styles.input} />

        <Text style={styles.subHeader}>Select Ingredient</Text>
        <Picker
          selectedValue={selectedIngredient}
          onValueChange={(val) => setSelectedIngredient(val)}
          style={styles.picker}
        >
          <Picker.Item label="Select Ingredient" value="" />
          {ingredients.map(ing => (
            <Picker.Item key={ing._id} label={ing.name} value={ing._id} />
          ))}
        </Picker>

        <TextInput
          placeholder="Quantity (g)"
          keyboardType="numeric"
          value={ingredientQuantity.toString()}
          onChangeText={(val) => setIngredientQuantity(parseInt(val) || 0)}
          style={styles.input}
        />

        <Button title="Add Ingredient" onPress={handleAddIngredient} color="#B98615"/>

        {selectedIngredients.map(id => {
          const ing = ingredients.find(i => i._id === id);
          return (
            <View key={id} style={styles.selectedIngredient}>
              <Text>{ing?.name}</Text>
              <TextInput
                style={styles.inputSmall}
                keyboardType="numeric"
                value={quantities[id]?.toString()}
                onChangeText={(val) =>
                  setQuantities({ ...quantities, [id]: parseInt(val) || 0 })
                }
              />
              <Text>g</Text>
            </View>
          );
        })}

        <View style={{ marginTop: 20 }}>
          <Button title="Create Recipe" onPress={handleCreateRecipe} color="#996515"/>

        </View>
        

        <Text style={styles.header}>All Recipes</Text>
        <TextInput
          placeholder="Search recipes..."
          value={searchTerm}
          onChangeText={handleSearch}
          style={styles.input}
        />

        <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item._id}
        renderItem={({ item: recipe }) => (
        <RecipeCard
          recipe={recipe}
          selectedMealType={mealTypeSelections[recipe._id]}
          onMealTypeChange={(val) =>
            setMealTypeSelections({ ...mealTypeSelections, [recipe._id]: val })
          }
          onAddToLog={() => handleAddToMealLog(recipe._id)}
        />
      )}

        ListEmptyComponent={<Text>No recipes found.</Text>}
        scrollEnabled={false}
      />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fdf9f4" },
  container: { padding: 16 },
  header: { fontSize: 22, fontWeight: "bold", marginVertical: 12 },
  subHeader: { fontSize: 18, marginTop: 12, marginBottom: 6 },
  input: { borderWidth: 1, padding: 8, marginBottom: 12, borderRadius: 6 },
  inputSmall: { borderWidth: 1, padding: 4, width: 60, marginHorizontal: 8 },
  selectedIngredient: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  recipeCard: { padding: 12, borderWidth: 1, borderRadius: 6, marginVertical: 10 },
  recipeName: { fontWeight: "bold", fontSize: 16 },
  picker: { height: 50, width: "100%", marginVertical: 10 },
});
