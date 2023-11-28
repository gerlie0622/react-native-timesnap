import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import { auth, firestore } from '../firebase'


const CreateAccount = () => {
  const navigation = useNavigation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [salary, setSalary] = useState('620');
  const [schedule, setSchedule] = useState('opening')
  const [password, setPassword] = useState('')
  
     const handleCreateAccount = () => {
        auth
        .createUserWithEmailAndPassword(email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
   
        db.collection('users').doc(user.uid).set({
            name,
            email,
            contactNumber,
            salary,
            schedule,     
        })
            .then(() => {
            console.log('Registered with:', user.email);
            setName('');
            setEmail('');
            setContactNumber('');
            setSalary('620');
            setSchedule('opening');
            setPassword('');
            navigation.navigate('Home');
        })
     .catch(error => alert(error.message));
        console.error('Error saving user data to Firestore:', error);
  })
}

 return (
    <View style={styles.container}>
      <Text>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={text => setName(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        value={contactNumber}
        onChangeText={text => setContactNumber(text)}
      />

      <Text>Select Salary:</Text>
      <Picker
        style={styles.picker}
        selectedValue={salary}
        onValueChange={(itemValue, itemIndex) => setSalary(itemValue)}
      >
        <Picker.Item label="P 620" value="620" />
        <Picker.Item label="P 720" value="720" />
        <Picker.Item label="P 820" value="820" />
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

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={text => setPassword(text)}
      />

      <TouchableOpacity onPress={handleCreateAccount} style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
 )
 }
 export default CreateAccount

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
  })
  
  