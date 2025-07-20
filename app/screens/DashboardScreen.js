import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen({ navigation }) {
  const [user, setUser] = useState({});
  const [city, setCity] = useState('');
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch('http://192.168.1.118:3000/api/users/current', {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

        const data = await response.json();
        setUser(data);
        console.log("User data from server:", data);
      } catch (err) {
        console.error("Error fetching user:", err.message);
      }
    };

    const fetchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Location permission denied');
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        const geo = await Location.reverseGeocodeAsync(loc.coords);
        if (geo.length > 0) {
          const { suburb, city, region } = geo[0];
          setCity(suburb || city || region || 'your area');
        }
      } catch (error) {
        console.log(error);
        setLocationError('Unable to get location');
      }
    };

    fetchUser();
    fetchLocation();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.navigate('Home');
  };

  const calculateBMI = () => {
    if (!user.height || !user.weight) return null;
    const heightM = user.height / 100;
    return (user.weight / (heightM * heightM)).toFixed(2);
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return '';
    const num = parseFloat(bmi);
    if (num < 18.5) return 'Underweight';
    if (num < 24.9) return 'Normal weight';
    if (num < 29.9) return 'Overweight';
    return 'Obese';
  };

  const calculateDailyCalories = () => {
    if (!user.height || !user.weight || !user.age || !user.gender) return null;
    const w = user.weight, h = user.height, a = user.age;
    if (user.gender === "male") return (10 * w + 6.25 * h - 5 * a + 5).toFixed(0);
    if (user.gender === "female") return (10 * w + 6.25 * h - 5 * a - 161).toFixed(0);
    return null;
  };

  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(bmi);
  const calories = calculateDailyCalories();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoutContainer}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Welcome to NutriCal, {user.email_id}!</Text>
        <Text style={styles.subtitle}>{user.is_admin ? "Admin Dashboard" : "Your Health Dashboard"}</Text>

        {!user.is_admin && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Health Summary</Text>
            {bmi && <Text>BMI: {bmi} ({bmiCategory})</Text>}
            {calories && <Text>Estimated Daily Calorie Needs: {calories} kcal/day</Text>}

            {city && (
              <View style={styles.locationBox}>
                <Text style={styles.locationText}>📍 You're currently in: {city}</Text>
                <Text style={styles.tip}> Tip: Try eating local seasonal foods around {city} for better nutrition!</Text>
              </View>
            )}
            {locationError && <Text style={styles.error}>{locationError}</Text>}
          </View>
        )}

        <View style={styles.buttons}>
          {user.is_admin ? (
            <>
              <Button title="View Ingredients" onPress={() => navigation.navigate('Ingredients')} color="#996515"/>
              <Button title="View All Recipes" onPress={() => navigation.navigate('Recipe')} color="#996515"/>
              <Button title="View Meal Boxes" onPress={() => navigation.navigate('MealBoxes')} color="#996515"/>
              <Button title="View All Users" onPress={() => navigation.navigate('Users')} color="#996515"/>
            </>
          ) : (
            <>
              <Button title="View Recipes" onPress={() => navigation.navigate('Recipe')} color="#996515"/>
              <Button title="View Meal Logs" onPress={() => navigation.navigate('MealLogs')} color="#996515"/>
              <Button title="View Meal Boxes" onPress={() => navigation.navigate('MealBoxes')} color="#996515"/>
              <Button title="View Cart" onPress={() => navigation.navigate('Cart')} color="#996515"/>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fdf9f4' },
  container: { padding: 20, justifyContent: 'center', backgroundColor: '#fdf9f4', flexGrow: 1 },
  logoutContainer: { alignItems: 'flex-end', marginBottom: 10 },
  logoutButton: { padding: 6, paddingHorizontal: 12, backgroundColor: '#e53935', borderRadius: 6 },
  logoutText: { color: '#fff', fontWeight: 'bold' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  section: { marginBottom: 30, alignItems: 'center' },
  sectionTitle: { fontWeight: 'bold', marginBottom: 10 },
  buttons: { gap: 12 },
  locationBox: {
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center'
  },
  locationText: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: '500'
  },
  tip: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#333'
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  }
});
