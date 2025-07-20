import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context'; 
import { CartProvider } from './context/Cart';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import CheckoutScreen from './screens/CheckoutScreen';

import { GlobalLayout } from './components/GlobalLayout';
import BottomTabs from './components/BottomTabs'; 

const Stack = createNativeStackNavigator();

const WithLayout = (Component) => (props) => (
  <GlobalLayout>
    <Component {...props} />
  </GlobalLayout>
);

export default function App() {
  return (
    <CartProvider>
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor="#e3dab7" translucent={false} />
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Login" component={WithLayout(LoginScreen)} />
            <Stack.Screen name="Register" component={WithLayout(RegisterScreen)} />
            <Stack.Screen name="Home" component={WithLayout(HomeScreen)} />
            <Stack.Screen name="Dashboard" component={BottomTabs} options={{ headerShown: false }} />
            <Stack.Screen name="Checkout" component={WithLayout(CheckoutScreen)} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </CartProvider>
  );
}
