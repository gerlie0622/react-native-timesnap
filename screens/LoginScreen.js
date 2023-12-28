import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import { auth } from '../firebase'
import { dbFirestore } from '../firebase';
import styles from '../styles';

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleLogin}
          style={[styles.button, loading && styles.disabledButton]}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleForgotPassword} // Updated this line for "Forgot Password" feature
          style={[styles.button, styles.buttonOutline, loading && styles.disabledButton]}
          disabled={loading}
        >
          <Text style={styles.buttonOutlineText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};


export default LoginScreen