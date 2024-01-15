import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, Button, Alert, Picker } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getFirestore, doc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';

const EditUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [salary, setSalary] = useState('620');
  const [schedule, setSchedule] = useState('Opening');

  const navigation = useNavigation();
  const route = useRoute();

  const { user } = route.params;

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setContactNumber(user.contactNumber);
    setSalary(user.salary);
    setSchedule(user.schedule);
  }, [user]);

  const handleUpdate = async () => {
    try {
      const db = getFirestore();
      const usersCollectionRef = collection(db, 'users');
  
      // Query to get the user document with matching uid
      const userDocSnapshot = await getDocs(query(usersCollectionRef, where('uid', '==', user.uid)));
  
      if (userDocSnapshot.docs.length > 0) {
        // Assuming there's only one document with the specified uid
        const userRef = doc(usersCollectionRef, userDocSnapshot.docs[0].id);
  
        await updateDoc(userRef, {
          name: name,
          email: email,
          contactNumber: contactNumber,
          salary: parseInt(salary),
          schedule: schedule,
          type: 'employee', // Assuming type remains constant for an existing user
        });
  
        Alert.alert('Success', 'User updated successfully');
        navigation.goBack();
      } else {
        // Handle the case when the user document with the specified uid is not found
        Alert.alert('Error', 'User not found');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      Alert.alert('Error', 'Failed to update user');
    }
  };  
  
  
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={(text) => setName(text)}
        />
      </View>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>Contact Number:</Text>
        <TextInput
          style={styles.input}
          value={contactNumber}
          onChangeText={(text) => setContactNumber(text)}
        />
      </View>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>Salary:</Text>
        <Picker
          selectedValue={salary}
          onValueChange={(itemValue) => setSalary(itemValue)}
        >
          <Picker.Item label="620" value="620" />
          <Picker.Item label="720" value="720" />
        </Picker>
      </View>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>Schedule:</Text>
        <Picker
          selectedValue={schedule}
          onValueChange={(itemValue) => setSchedule(itemValue)}
        >
          <Picker.Item label="Opening" value="Opening" />
          <Picker.Item label="Closing" value="Closing" />
        </Picker>
      </View>
      <Button title="Update" onPress={handleUpdate} />
    </View>
  );
};

export default EditUser;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  labelContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  label: { marginRight: 8, fontWeight: 'bold' },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 16, padding: 8 },
});
