import React, { useEffect, useState, useCallback } from 'react';
import {View, Text, Button, StyleSheet, Alert,  FlatList} from 'react-native';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import MealLogCard from '../components/MealLogCard';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

export default function MealLogScreen({ navigation }) {
  const [mealLogs, setMealLogs] = useState([]);
  const [groupedLogs, setGroupedLogs] = useState({});
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');

  const scale = useSharedValue(1);
  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = event.scale;
    })
    .onEnd(() => {
      scale.value = withSpring(1);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const BASE_URL = 'http://192.168.1.118:3000/api';
  const mealTypes = ["breakfast", "lunch", "dinner", "snacks"];

  useEffect(() => {
    fetchCity();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchMealLogs();
    }, [])
  );

  const fetchCity = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      let loc = await Location.getCurrentPositionAsync({});
      let geo = await Location.reverseGeocodeAsync(loc.coords);
      if (geo.length > 0) {
        setCity(geo[0].suburb || geo[0].city || 'your area');
      }
    } catch (err) {
      console.error("Location error:", err);
    }
  };

  
  const fetchMealLogs = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/meallog?page=1&limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setMealLogs(data.logs || []);
      groupLogs(data.logs || []);
    } 
    catch (err) {
      console.error("Failed to fetch meal logs", err);
    } 
    finally {
      setLoading(false);
    }
  };
  

  const groupLogs = (logs) => {
    const grouped = {};
    mealTypes.forEach(type => {
      grouped[type] = logs.filter(log => log.mealType === type);
    });
    setGroupedLogs(grouped);
  };

  const getToday = () => new Date().toISOString().split("T")[0];

  const todaysLogs = mealLogs.filter(log => 
    new Date(log.date).toISOString().split("T")[0] === getToday()
  );

  const dailySummary = todaysLogs.reduce((acc, log) => {
    log.recipes.forEach(recipe => {
      acc.calories += recipe.caloriesPerServing || 0;
      acc.protein += recipe.proteinPerServing || 0;
      acc.fat += recipe.fatPerServing || 0;
      acc.carbs += recipe.carbsPerServing || 0;
    });
    return acc;
  }, { calories: 0, protein: 0, fat: 0, carbs: 0 });

  const handleAddMeal = (type) => {
    AsyncStorage.setItem('selectedMealType', type);
    navigation.navigate("Recipe");
  };

  const handleDelete = async (logId) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await fetch(`${BASE_URL}/meallog/${logId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Failed to delete");
      fetchMealLogs();
    } 
    catch (err) {
      Alert.alert("Error", "Could not delete meal.");
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={pinchGesture}>
        <Animated.ScrollView style={[styles.container, animatedStyle]}>
          <Text style={styles.title}>Today's Meal Log</Text>

          <View style={styles.summaryBox}>
            <Text style={styles.subTitle}>Today's Summary</Text>
            <Text>
              Total: {dailySummary.calories.toFixed(1)} kcal — 
              Protein: {dailySummary.protein.toFixed(1)}g, 
              Fat: {dailySummary.fat.toFixed(1)}g, 
              Carbs: {dailySummary.carbs.toFixed(1)}g
            </Text>
          </View>

          {mealTypes.map(type => {
            const logs = groupedLogs[type] || [];
            const summary = logs.reduce((acc, log) => {
              log.recipes.forEach(recipe => {
                acc.calories += recipe.caloriesPerServing || 0;
                acc.protein += recipe.proteinPerServing || 0;
                acc.fat += recipe.fatPerServing || 0;
                acc.carbs += recipe.carbsPerServing || 0;
              });
              return acc;
            }, { calories: 0, protein: 0, fat: 0, carbs: 0 });

            return (
              <View key={type} style={styles.mealSection}>
                <Text style={styles.mealType}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>

                <Button title="+ Add Meal" onPress={() => handleAddMeal(type)} />

                {logs.length === 0 ? (
                  <Text style={{ marginTop: 8 }}>No meals logged yet.</Text>
                ) : (
                  <>
                    <Text style={styles.mealSummary}>
                      Summary: {summary.calories.toFixed(1)} kcal — Protein: {summary.protein.toFixed(1)}g, Fat: {summary.fat.toFixed(1)}g, Carbs: {summary.carbs.toFixed(1)}g
                    </Text>

                    <FlatList
                    data={logs}
                    keyExtractor={(log) => log._id}
                    renderItem={({ item: log }) => (
                      <MealLogCard log={log} onDelete={handleDelete} city={city} />
                    )}
                    ListEmptyComponent={<Text style={{ marginTop: 8 }}>No meals logged yet.</Text>}
                    scrollEnabled={false}
                  />


                  </>
                )}
              </View>
            );
          })}
        </Animated.ScrollView>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fdf9f4" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12, textAlign: "center" },
  subTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  summaryBox: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 6,
    marginBottom: 20,
  },
  mealSection: { marginBottom: 30 },
  mealType: { fontSize: 18, fontWeight: "bold", marginTop: 12 },
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
  mealSummary: {
    marginTop: 6,
    fontStyle: "italic",
    fontSize: 13,
    marginBottom: 6
  }
});
