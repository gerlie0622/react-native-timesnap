import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, dbFirestore } from '../firebase';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeScreen2 = () => {
  const navigation = useNavigation();
  

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


  const renderButton = (label, iconName, onPress) => {
    const buttonStyle = label === 'Logout' ? styles.logoutButton : styles.button;
  
    return (
      <TouchableOpacity style={buttonStyle} onPress={onPress}>
        <View style={styles.buttonContent}>
          <Icon name={iconName} size={20} color="white" />
          <Text style={styles.buttonText}>{label}</Text>
        </View>
      </TouchableOpacity>
    );
    }
  return (
    <View style={styles.container}>
    <View style={styles.header}>
        <Icon name="user-circle" size={40} color="#333" />
        <Text style={styles.greeting}>Welcome, {auth.currentUser?.email}!</Text>
         </View>
        {renderButton('Mark Attendance', 'calendar', handleAttendance)}
        {renderButton('Employee Status', 'users', handleEmployeeList)}
        {renderButton('Employee Details', 'list', handleAllEmployees)}
        {renderButton('Salary Information', 'money', handleSalary)}
        {renderButton('Create New Account', 'user-plus', handleCreateAccount)}
        {renderButton('About Us', 'info-circle', handleAboutUs)}
        {renderButton('Logout', 'sign-out', handleSignOut)}
      </View>
    );
  };
  

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5F5F5', // Light background color for a clean look
    },
    greeting: {
      fontSize: 24,
      marginBottom: 20,
      fontWeight: 'bold',
      color: '#333',
      marginLeft: 20,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    userIcon: {
      marginRight: 50, // Adjust the spacing between the icon and text
      marginBottom: 20,
    },
    button: {
      backgroundColor: '#3498DB', // Blue color for action buttons
      width: '80%',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 20,
    },
    buttonOutline: {
      width: '100%', // Adjust width for both web and mobile
      padding: 12, // Adjust padding for both web and mobile
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#3498DB',
      borderRadius: 8,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontWeight: '700',
      fontSize: 16,
      marginLeft: 10, // Adjust the spacing between icon and text
    },
    logoutButton: {
      backgroundColor: '#E74C3C', // Red color for logout button
      width: '80%',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 20,
    },
  });
  
  export default HomeScreen2;