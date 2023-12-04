import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import CreateAccount from './screens/CreateAccount';
import Attendance from './screens/Attendance';
import ForgotPassword from './screens/ForgotPassword';
import EmployeeHomeScreen from './screens/EmployeeHomeScreen';
import AdminHome from './screens/AdminHome';
import HomeScreen2 from './screens/HomeScreen2';
import EmployeeList from './screens/EmployeeList';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen options = {{ headerShown: false }} name="Login" component={LoginScreen} /> 
      <Stack.Screen name="AdminHome" component={AdminHome} /> 
      <Stack.Screen name="CreateAccount" component={CreateAccount} /> 
      <Stack.Screen name="Attendance" component={Attendance} /> 
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} /> 
      <Stack.Screen name="EmployeeHomeScreen" component={EmployeeHomeScreen} /> 
      <Stack.Screen name="HomeScreen2" component={HomeScreen2} /> 
      <Stack.Screen name="EmployeeList" component={EmployeeList} /> 
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
