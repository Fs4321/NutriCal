import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import { GlobalLayout } from './GlobalLayout';

import DashboardScreen from '../screens/DashboardScreen';
import RecipeScreen from '../screens/RecipeScreen';
import MealLogScreen from '../screens/MealLogScreen';
import MealBoxScreen from '../screens/MealBoxScreen';
import CartScreen from '../screens/CartScreen';


const Tab = createBottomTabNavigator();

const WithLayout = (Component) => (props) => (
  <GlobalLayout>
    <Component {...props} />
  </GlobalLayout>
);

export default function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Dashboard: 'chart-pie',
            Recipe: 'utensils',
            MealLogs: 'book',
            MealBoxes: 'box',
            Cart: 'shopping-cart',
            
          };
          return (
            <FontAwesome5 name={icons[route.name]} size={size} color={color} />
          );
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={WithLayout(DashboardScreen)} />
      <Tab.Screen name="Recipe" component={WithLayout(RecipeScreen)} />
      <Tab.Screen name="MealLogs" component={WithLayout(MealLogScreen)} />
      <Tab.Screen name="MealBoxes" component={WithLayout(MealBoxScreen)} />
      <Tab.Screen name="Cart" component={WithLayout(CartScreen)} />
      
    </Tab.Navigator>
  );
}
