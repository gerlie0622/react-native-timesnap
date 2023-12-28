import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth, dbFirestore } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import styles from '../styles';

const CreateAccount = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [salary, setSalary] = useState('620');
  const [schedule, setSchedule] = useState('opening');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('employee');

  const handleCreateAccount = async () => {
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const newUser = userCredential.user;

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

      setName('');
      setEmail('');
      setContactNumber('');
      setSalary('620');
      setSchedule('opening');
      setPassword('');
      setType('employee');

      Alert.alert('Account Created!', 'Your account has been created successfully.', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    } catch (error) {
      console.error('Error creating account:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')} // Replace with the path to your background image
        style={styles.backgroundImage}
      />
      <View style={styles.overlay} />

      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          style={styles.inputCreate}
          placeholder="Full Name"
          value={name}
          onChangeText={(text) => setName(text)}
        />

        <TextInput
          style={styles.inputCreate}
          placeholder="Email Address"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        <TextInput
          style={styles.inputCreate}
          placeholder="Contact Number"
          value={contactNumber}
          onChangeText={(text) => setContactNumber(text)}
        />

        <Text style={styles.label}>Select Salary:</Text>
        <Picker
          style={styles.picker}
          selectedValue={salary}
          onValueChange={(itemValue) => setSalary(itemValue)}
        >
          <Picker.Item label="P 620" value="620" />
          <Picker.Item label="P 720" value="720" />
        </Picker>

        <Text style={styles.label}>Select Schedule:</Text>
        <Picker
          style={styles.picker}
          selectedValue={schedule}
          onValueChange={(itemValue) => setSchedule(itemValue)}
        >
          <Picker.Item label="Opening" value="opening" />
          <Picker.Item label="Closing" value="closing" />
        </Picker>

        <Text style={styles.label}>Select Type:</Text>
        <Picker
          style={styles.picker}
          selectedValue={type}
          onValueChange={(itemValue) => setType(itemValue)}
        >
          <Picker.Item label="Employee" value="employee" />
          <Picker.Item label="Admin" value="admin" />
        </Picker>

        <TextInput
          style={styles.inputCreate}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        <TouchableOpacity onPress={handleCreateAccount} style={styles.buttonCreate}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateAccount;
