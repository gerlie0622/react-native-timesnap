import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth, dbFirestore } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const CreateAccount = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [salary, setSalary] = useState('620');
  const [schedule, setSchedule] = useState('opening');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('employee');


  const handleCreateAccount = async () => {
    console.log('Starting handleCreateAccount');
    try {
      // Create a new user in Firebase Authentication
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const newUser = userCredential.user;
  
      // Save user details to Firestore
      const usersRef = collection(dbFirestore, 'users');
      const newUserDocRef = await addDoc(usersRef, {
        uid: newUser.uid,
        name,
        email,
        contactNumber,
        salary,
        schedule,
        type,
      });
  
      console.log('User registered successfully with ID:', newUserDocRef.id);
      
      // Additional actions after successful registration
      Alert.alert('Account Created!', 'Your account has been created successfully.', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
  
    } catch (error) {
      console.error('Error creating account:', error.message);
      // Handle error (e.g., show an alert)
    }
    console.log('Finished handleCreateAccount');
  };

  return (
    <View style={styles.container}>
      <Text>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        value={contactNumber}
        onChangeText={(text) => setContactNumber(text)}
      />

      <Text>Select Salary:</Text>
      <Picker
        style={styles.picker}
        selectedValue={salary}
        onValueChange={(itemValue, itemIndex) => setSalary(itemValue)}
      >
        <Picker.Item label="P 620" value="620" />
        <Picker.Item label="P 720" value="720" />
        {/* Add other salary options as needed */}
      </Picker>

      <Text>Select Schedule:</Text>
      <Picker
        style={styles.picker}
        selectedValue={schedule}
        onValueChange={(itemValue, itemIndex) => setSchedule(itemValue)}
      >
        <Picker.Item label="Opening" value="opening" />
        <Picker.Item label="Closing" value="closing" />
      </Picker>

      <Text>Select Type:</Text>
      <Picker
        style={styles.picker}
        selectedValue={type}
        onValueChange={(itemValue, itemIndex) => setType(itemValue)}
      >
        <Picker.Item label="Employee" value="employee" />
        <Picker.Item label="Admin" value="admin" />
      </Picker>


      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      <TouchableOpacity onPress={handleCreateAccount} style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  picker: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
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

export default CreateAccount;
