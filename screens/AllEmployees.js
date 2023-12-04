import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, Button, Alert } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../firebase';

const AllEmployees = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const usersRef = firebase.firestore().collection('users');

    const unsubscribe = usersRef.onSnapshot((querySnapshot) => {
      const userList = [];
      querySnapshot.forEach((doc) => {
        const { name, email, contactNumber, salary, schedule, uid } = doc.data();
        userList.push({ name, email, contactNumber, salary, schedule, uid });
      });

      setUsers(userList);
    });

    return () => unsubscribe();
  }, []);

  const handleRowPress = (uid) => {
    // Implement the logic to navigate to the UserDetails screen with the user's UID
    navigation.navigate('UserDetails', { uid });
  };

  const handleEdit = (uid) => {
    // Implement the logic to navigate to the Edit screen with the user's UID
    navigation.navigate('EditUser', { uid });
  };

  const handleDelete = async (uid) => {
    try {
      const userRef = firebase.firestore().collection('users').doc(uid);
      await userRef.delete();
      Alert.alert('Success', 'User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      Alert.alert('Error', 'Failed to delete user');
    }
  };

  const handleSearch = () => {
    // Implement the logic to filter users based on the searchQuery
    const filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setUsers(filteredUsers);
  };

  const handleReset = () => {
    // Reset the search query and display the original list of users
    setSearchQuery('');
    const usersRef = firebase.firestore().collection('users');

    usersRef.get().then((querySnapshot) => {
      const userList = [];
      querySnapshot.forEach((doc) => {
        const { name, email, contactNumber, salary, schedule, uid } = doc.data();
        userList.push({ name, email, contactNumber, salary, schedule, uid });
      });

      setUsers(userList);
    });
  };

  const renderActions = (uid) => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity onPress={() => handleEdit(uid)}>
        <Text style={styles.editText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDelete(uid)}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const tableHead = ['Name', 'Email', 'Contact Number', 'Salary', 'Schedule', 'Actions'];

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <Button title="Search" onPress={handleSearch} />
        <Button title="Reset" onPress={handleReset} />
      </View>
      <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
        <Row data={tableHead} style={[styles.head, styles.border]} textStyle={styles.text} />
        {users.map((user, index) => (
          <Row
            key={index}
            data={[
              user.name,
              user.email,
              user.contactNumber,
              user.salary,
              user.schedule,
              renderActions(user.uid),
            ]}
            style={styles.border}
            textStyle={styles.text}
          />
        ))}
      </Table>
    </View>
  );
};

export default AllEmployees;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 },
  border: { borderWidth: 1, borderColor: '#c8e1ff' },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  editText: { color: 'blue', fontWeight: 'bold' },
  deleteText: { color: 'red', fontWeight: 'bold' },
  searchContainer: { flexDirection: 'row', marginBottom: 10, alignItems: 'center' },
  searchInput: { flex: 1, marginRight: 10, borderWidth: 1, padding: 8 },
  buttonContainer: { width: 80, marginLeft: 10 },
});
