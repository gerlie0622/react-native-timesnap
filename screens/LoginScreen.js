import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { auth } from '../firebase';
import { dbFirestore } from '../firebase';



const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleForgotPassword = async () => {
    try {
      setLoading(true);
      await auth.sendPasswordResetEmail(email);
      alert('Password reset email sent. Please check your email.');
    } catch (error) {
      console.error('Error during password reset:', error.message);
      alert('Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);

      const userCredentials = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredentials.user;

      // Fetch user data from Firestore to determine type
      const usersCollectionRef = dbFirestore.collection('users');
      const userDocSnapshot = await usersCollectionRef.where('uid', '==', user.uid).get();

      if (!userDocSnapshot.empty) {
        const userDoc = userDocSnapshot.docs[0];
        const userData = userDoc.data();

        console.log('User Data:', userData);

        if (userData && userData.type) {
          console.log('User Type:', userData.type);

          if (userData.type === 'admin') {
            navigation.navigate('HomeScreen2', { user: userData });
          } else {
            navigation.navigate('EmployeeHomeScreen', { user: userData });
          }
        } else {
          console.error('User data exists, but type is missing or falsy.');
        }
      } else {
        console.error('User document does not exist in Firestore.');
        alert('User data not found. Please register first.');
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      alert('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={-100}>
      <View style={styles.inputContainer}>
      <View style={styles.centeredContainer}></View>
       {/* Clock Logo */}
      <Image 
      source={require('../assets/timesnap-logo2.png')} 
      style={styles.logo} 
      />

        {/* Email Input with Icon */}
        <View style={styles.inputWithIcon}>
          <MaterialCommunityIcons name="email" size={20} color="black" style={styles.icon} />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={[styles.input, styles.inputWithIconInput]}
          />
        </View>

        {/* Password Input with Icon */}
        <View style={styles.inputWithIcon}>
          <MaterialCommunityIcons name="lock" size={20} color="black" style={styles.icon} />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={[styles.input, styles.inputWithIconInput]}
            secureTextEntry
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          style={[styles.button, loading && styles.disabledButton]}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Forgot Password Button */}
        <TouchableOpacity
          onPress={handleForgotPassword}
          style={[styles.button, styles.buttonOutline, loading && styles.disabledButton]}
          disabled={loading}
        >
          <Text style={styles.buttonOutlineText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498DB" />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#F5F5F5', // Light gray background color
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: '100%', // Take up full width
    justifyContent: 'center', // Center horizontally
    alignItems: 'center', // Center vertically
    backgroundColor: '#FFFFFF', // White background color
    padding: 20, // Adjust padding as needed
    borderRadius: 10, // Add borderRadius as needed
    marginBottom: 20, // Add margin as needed
  },
  logo: {
    width: 300, // Adjust the width as needed
    height: 300, // Adjust the height as needed
    resizeMode: 'contain',
   
  },
  grayContainer: {
    width: '80%',
    backgroundColor: '#F5F5F5', // Light gray background color
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: 20,
    width: '80%', // Adjust width as needed for both web and mobile
    maxWidth: 500, // Optional: Set a maximum width for larger screens
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16, // Adjust font size for both web and mobile
    height: 40,
  },
  inputWithIconInput: {
    flex: 1,
    fontSize: 14,
    paddingLeft: 5,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    maxWidth: 300, // Optional: Set a maximum width for larger screens
    marginTop: 20,
  },
  button: {
    width: '100%', // Adjust width for both web and mobile
    padding: 12, // Adjust padding for both web and mobile
    backgroundColor: '#3498DB',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonOutline: {
    width: '100%', // Adjust width for both web and mobile
    padding: 12, // Adjust padding for both web and mobile
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#3498DB',
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  buttonOutlineText: {
    color: '#3498DB',
    fontSize: 14,
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

// Media query for web styles
if (StyleSheet.absoluteFillObject) {
  styles['@media (min-width: 600px)'] = {
    container: {
      flexDirection: 'row', // Change to row layout for larger screens if needed
    },
  };
}

export default LoginScreen;