import { useNavigation } from '@react-navigation/core'
import React, { useLayoutEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { auth, firestore } from '../firebase'
import styles from '../styles';

const EmployeeHomeScreen = () => {
  const navigation = useNavigation()

  const handleAttendance = () => {
    navigation.navigate("Camera")
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword")
  }

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login")
      })
      .catch(error => alert(error.message))
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Hide the header
    });
  }, [navigation]);


  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hi, {auth.currentUser?.email}</Text>

      <TouchableOpacity style={styles.buttonHome} onPress={handleAttendance}>
        <Text style={styles.buttonText}>Attendance</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonHome} onPress={handleForgotPassword}>
        <Text style={styles.buttonText}>Forgot Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonHome} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

    </View>
  );
}

export default EmployeeHomeScreen
