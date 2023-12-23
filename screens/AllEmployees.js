import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, Button, Alert } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../firebase';
import { FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


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
    navigation.navigate('UserDetails', { uid });
  };

  const handleEdit = (user) => {
    navigation.navigate('EditUser', {
      user,
      onUserUpdated: (updatedUser) => {
        // Update the user in the local state
        const updatedUsers = users.map((u) => (u.uid === updatedUser.uid ? updatedUser : u));
        setUsers(updatedUsers);
      },
    });
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
    const filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setUsers(filteredUsers);
  };

  const handleReset = () => {
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

  const renderActions = (user) => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity
        style={[styles.actionButton, styles.editButton]} // Apply styles for the Edit button
        onPress={() => handleEdit(user)}
      >
        <Text style={styles.editText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, styles.deleteButton]} // Apply styles for the Delete button
        onPress={() => handleDelete(user.uid)}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const tableHead = ['Name', 'Email', 'Contact Number', 'Salary', 'Schedule', 'Actions'];

  const handleCardPress = (uid) => {
    navigation.navigate('EmployeeDetails', { uid });
  };


  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Icon name="search" size={20} color="#FFF" /> {/* Magnifying glass icon */}
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={users}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleRowPress(item.uid)}
          >
            <Text style={styles.cardText}>{item.name}</Text>
            <Text style={styles.cardDetail}>Email: {item.email}</Text>
            <Text style={styles.cardDetail}>Contact Number: {item.contactNumber}</Text>
            <Text style={styles.cardDetail}>Salary: {item.salary}</Text>
            <Text style={styles.cardDetail}>Schedule: {item.schedule}</Text>
            {renderActions(item)}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#F5F5F5' }, // Light gray background color for the container
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: '#3498DB', // Formal blue color for the search container
    borderRadius: 10,
    padding: 8,
  },

  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchInput: { flex: 1, marginRight: 10, padding: 8, fontSize: 14, backgroundColor: '#FFF', borderRadius: 8 }, // White background color for the text input with rounded corners
  buttonContainer: { width: 80 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  cardText: { fontSize: 18, color: '#333', fontWeight: 'bold', marginBottom: 8 },
  cardDetail: { fontSize: 14, color: '#555', marginBottom: 4 },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  editText: { color: '#3498DB', fontWeight: 'bold' }, // Formal blue color for the edit text
  deleteText: { color: '#E74C3C', fontWeight: 'bold' }, // Red color for the delete text

  searchContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
    borderColor: '#3498DB', // Blue outline color for the search container
    borderWidth: 3,
    borderRadius: 10,
    padding: 8,
  },
  searchInput: {
    flex: 1,
    marginRight: 10,
    padding: 8,
    fontSize: 14,
    color: '#333', // Text color
  },
  searchButton: {
    width: 40,
    height: 40,
    backgroundColor: '#3498DB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    width: 80,
    backgroundColor: '#E74C3C', // Red color for the reset button background
    borderRadius: 8,
    marginLeft: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    color: '#FFF', // White text color for the reset button
    fontWeight: 'bold',
  },

  editButton: {
    backgroundColor: '#3498DB', // Blue color for the Edit button background
    marginRight: 8, // Added margin to separate Edit and Delete buttons
    borderColor: '#3498DB', // Blue color for the Edit button border
    borderWidth: 1, // Added border line to the Edit button
  },
  deleteButton: {
    backgroundColor: '#E74C3C', // Red color for the Delete button background
    marginLeft: 8, // Added margin to separate Edit and Delete buttons
    borderColor: '#E74C3C', // Red color for the Delete button border
    borderWidth: 1, // Added border line to the Delete button
  },
  editText: {
    color: '#FFF', // White text color for the Edit button
    fontWeight: 'bold',
  },
  deleteText: {
    color: '#FFF', // White text color for the Delete button
    fontWeight: 'bold',
  },

});


export default AllEmployees;