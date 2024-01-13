import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import CreateAccount from './screens/CreateAccount';
import Attendance from './screens/Attendance';
import ForgotPassword from './screens/ForgotPassword';
import EmployeeHomeScreen from './screens/EmployeeHomeScreen';
import UserCount from './screens/AdminHome';
import HomeScreen2 from './screens/HomeScreen2';
import EmployeeList from './screens/EmployeeList';
import CameraTake from './screens/Camera';
import SalaryAdmin from './screens/SalaryAdmin';
import AllEmployees from './screens/AllEmployees';
import EditUser from './screens/EditUser';
import SplashScreen from 'react-native-splash-screen'
import EmployeeImages from './screens/EmployeeImages';


const Stack = createNativeStackNavigator();

export default function App() {

  const [isSplashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    // Simulate a delay (e.g., 2 seconds) before hiding the splash screen
    const delay = setTimeout(() => {
      setSplashVisible(false);
    }, 2000);

    // Clear the timeout when the component is unmounted
    return () => clearTimeout(delay);
  }, []);

  return (

      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
          <Stack.Screen name="AdminHome" component={UserCount} />
          <Stack.Screen name="CreateAccount" component={CreateAccount} />
          <Stack.Screen name="Attendance" component={Attendance} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="AllEmployees" component= { AllEmployees} />
          <Stack.Screen name="Camera" component={CameraTake} />
          <Stack.Screen name="EditUser" component={EditUser} />
          <Stack.Screen name="EmployeeImages" component={EmployeeImages} />
        
          


          <Stack.Screen
            name="EmployeeHomeScreen"
            component={EmployeeHomeScreen}
            options={({ navigation }) => ({
              title: 'Employee Home',
              headerLeft: () => null, 
            })}
          />
          <Stack.Screen
            name="HomeScreen2"
            component={HomeScreen2}
            options={({ navigation }) => ({
              title: 'HomeScreen',
              headerLeft: () => null, 
            })}
          />
          <Stack.Screen name="EmployeeList" component={EmployeeList} />
          <Stack.Screen name="SalaryAdmin" component={SalaryAdmin} />
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
