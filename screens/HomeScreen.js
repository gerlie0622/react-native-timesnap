import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { auth, firestore } from '../firebase'

const HomeScreen = () => {
  const navigation = useNavigation()

  const handleAttendance = () => {
    navigation.navigate("Attendance")
  };

  const handleSchedule = () => {
    console.log('Schedule button clicked');
  };
  const handleSalary = () => {
    console.log('Salary button clicked');
  };

  const handleCreateAccount = () => {
      navigation.navigate("CreateAccount")
    }


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
  
  

return (
  <View style={styles.container}>
  <Text>Hi, {auth.currentUser?.email}</Text>

  <TouchableOpacity style={styles.button} onPress={handleAttendance}>
        <Text style={styles.buttonText}>Attendance</Text>
      </TouchableOpacity>

  <TouchableOpacity style={styles.button} onPress={handleSchedule}>
        <Text style={styles.buttonText}>Schedule</Text>
      </TouchableOpacity>

  <TouchableOpacity style={styles.button} onPress={handleSalary}>
        <Text style={styles.buttonText}>Salary</Text>
      </TouchableOpacity>

  <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
        <Text style={styles.buttonText}>CreateAccount</Text>
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
  },
  button: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
export default HomeScreen