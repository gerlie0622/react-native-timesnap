import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import CreateAccount from './screens/CreateAccount';
import Attendance from './screens/Attendance';
import ForgotPassword from './screens/ForgotPassword';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen options = {{ headerShown: false }} name="Login" component={LoginScreen} /> 
      <Stack.Screen name="Home" component={HomeScreen} /> 
      <Stack.Screen name="CreateAccount" component={CreateAccount} /> 
      <Stack.Screen name="Attendance" component={Attendance} /> 
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} /> 
    </Stack.Navigator>
  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
