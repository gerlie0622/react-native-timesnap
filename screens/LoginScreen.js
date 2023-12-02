import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { auth } from '../firebase'
import { dbFirestore } from '../firebase';

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

const navigation = useNavigation();
  const handleSignUp = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Registered with:', user.email);
        setEmail('');
        setPassword('');
      })
      .catch(error => alert(error.message))
        
  }

  
  const handleLogin = async () => {
    try {
      const userCredentials = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredentials.user;
  
      // Fetch user data from Firestore to determine type
      const usersCollectionRef = dbFirestore.collection('users');
      
      // Use where clause to find the document by user's UID
      const userDocSnapshot = await usersCollectionRef.where('uid', '==', user.uid).get();
  
      if (!userDocSnapshot.empty) {
        // If there are matching documents, get the first one
        const userDoc = userDocSnapshot.docs[0];
        const userData = userDoc.data();
  
        console.log('User Data:', userData);
  
        if (userData && userData.type) {
          console.log('User Type:', userData.type);
  
          if (userData.type === 'admin') {
            navigation.navigate('HomeScreen', { user: userData });
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
    }
  };  


  useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(user => {
    if (user) {
    navigation.replace("Home")
      }
    })
    return unsubscribe
  }, []) 

  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%'
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
})

export default LoginScreen