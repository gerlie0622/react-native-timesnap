import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Button, ScrollView } from 'react-native';
import { Table, Row, Rows } from 'react-native-reanimated-table';
import { firebase } from '../firebase';

const EmployeeList = () => {
  const [originalUsers, setOriginalUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const todoRef = firebase.firestore().collection('timeEntries');

  const usersRef = firebase.firestore().collection('users');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timeEntriesSnapshot = await todoRef.get();
        const timeEntriesData = timeEntriesSnapshot.docs.map((doc) => doc.data());

        const usersSnapshot = await usersRef.get();
        const usersData = usersSnapshot.docs.reduce((acc, doc) => {
          acc[doc.data().email] = doc.data().name;
          return acc;
        }, {});

        const userList = timeEntriesData.map((entry) => [
          entry.date,
          usersData[entry.userEmail] || 'Unknown', 
          entry.userEmail,
          entry.eventType,
          entry.timestamp,
        ]);

        setOriginalUsers(userList);
        setFilteredUsers(userList);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    const unsubscribe = todoRef.onSnapshot((querySnapshot) => {
      fetchData();
    });

    return () => unsubscribe(); // Unsubscribe from the snapshot listener when component unmounts
  }, []);

  const filterDataByDate = () => {
    const filteredData = originalUsers.filter((user) => user[0] === selectedDate);
    setFilteredUsers(filteredData);
  };

  const resetFilter = () => {
    setSelectedDate('');
    setFilteredUsers(originalUsers);
  };

  const tableHead = ['Date', 'Name', 'Email', 'TimeIn / TimeOut', 'Timestamp'];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Date (YYYY-MM-DD)"
          value={selectedDate}
          onChangeText={(text) => setSelectedDate(text)}
        />
        <Button title="Filter" onPress={filterDataByDate} />
        <Button title="Reset" onPress={resetFilter} />
      </View>
      <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
        <Row data={tableHead} style={styles.head} textStyle={styles.text} />
        <Rows data={filteredUsers} textStyle={styles.text} />
      </Table>
    </ScrollView>
  );
};

export default EmployeeList;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginRight: 10,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
  },
});
