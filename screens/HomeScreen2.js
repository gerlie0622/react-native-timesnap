// HomeScreen2.js
import { useNavigation } from '@react-navigation/core';
import React, { useLayoutEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, dbFirestore } from '../firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../styles';

const HomeScreen2 = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Hide the header
    });
  }, [navigation]);
  

  const handleAttendance = () => {
    navigation.navigate('AdminHome');
  };
  const handleEmployeeList = () => {
    navigation.navigate('EmployeeList');
  };
  const handleAllEmployees = () => {
    navigation.navigate('AllEmployees');
  };
  const handleSalary = () => {
    navigation.navigate('SalaryAdmin');
  };
  const handleCreateAccount = () => {
    navigation.navigate('CreateAccount');
  };
  const handleEmployeeImages = () => {
    // Navigating to EmployeeImages
    navigation.navigate('EmployeeImages', { userEmail: 'test@example.com' });
  };
  const handleAboutUs = () => {
    console.log('About Us button clicked');
  };
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error) => alert(error.message));
  };


    const renderButton = (label, iconName, onPress) => (
      <TouchableOpacity style={styles.buttonHome} onPress={onPress}>
        <View style={styles.buttonContent}>
          <Icon name={iconName} size={20} color="white" />
          <Text style={styles.buttonText}>{label}</Text>
        </View>
      </TouchableOpacity>
    );
    return (
      <View style={styles.container}>
        <Text style={styles.greeting}>Welcome, {auth.currentUser?.email}!</Text>
  
        {renderButton('Mark Attendance', 'calendar', handleAttendance)}
        {renderButton('Employee Status', 'users', handleEmployeeList)}
        {renderButton('Employee Details', 'list', handleAllEmployees)}
        {renderButton('Salary Information', 'money', handleSalary)}
        {renderButton('Create New Account', 'user-plus', handleCreateAccount)}
        {renderButton('Employee Images', 'image', handleEmployeeImages)}
        {renderButton('About Us', 'info-circle', handleAboutUs)}
        {renderButton('Logout', 'sign-out', handleSignOut)}
      </View>
    );
  };
  
  
  export default HomeScreen2;
