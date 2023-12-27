import { useNavigation } from '@react-navigation/core'
import React, { useLayoutEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { auth, firestore } from '../firebase'

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
  <Text style={styles.textStyle}>Hi, {auth.currentUser?.email}</Text>

  <TouchableOpacity style={styles.button} onPress={handleAttendance}>
        <Text style={styles.buttonText}>Attendance</Text>
      </TouchableOpacity>
      
  <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
        <Text style={styles.buttonText}>Forgot Password</Text>
      </TouchableOpacity>


  <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#1A8FE3',
  },

  textStyle: {

    padding:50,
    color:'#fff',

  },

  button: {
    backgroundColor: '#F17105',
    width: '60%',
    padding: 8,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#EAE0C8',
    
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
export default EmployeeHomeScreen