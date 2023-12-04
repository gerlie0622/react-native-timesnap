import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Button } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import { firebase } from '../firebase';

const EmployeeList = () => {
  const [originalUsers, setOriginalUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const todoRef = firebase.firestore().collection('timeEntries');

  useEffect(() => {
    const unsubscribe = todoRef.onSnapshot((querySnapshot) => {
      const userList = [];
      querySnapshot.forEach((doc) => {
        const { date, userName, userEmail, eventType, timestamp } = doc.data();
        userList.push([date, userName, userEmail, eventType, timestamp]);
      });
      setOriginalUsers(userList);
      setFilteredUsers(userList);
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
    <View style={styles.container}>
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
    </View>
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
