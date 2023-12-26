import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Button, ScrollView } from 'react-native';
import { Table, Row, Rows } from 'react-native-reanimated-table';
import { firebase } from '../firebase';

const SalaryAdmin = () => {
  const [originalUsers, setOriginalUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchName, setSearchName] = useState('');
  const todoRef = firebase.firestore().collection('timeEntriesDraft');

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
          entry.duration,
          calculateSalary(entry.duration), // Added Salary column
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

    return () => unsubscribe(); // Unsubscribe from the snapshot listener when the component unmounts
  }, []);

  const calculateSalary = (duration) => {
    const hours = parseFloat(duration); // Assuming the duration is in hours
    const hourlyRate = 77.5;
    const salary = isNaN(hours) ? 0 : hours * hourlyRate;
    return salary.toFixed(2); // Format to two decimal places
  };

  const filterData = () => {
    let filteredData = originalUsers;

    // Filter by name
    if (searchName) {
      filteredData = filteredData.filter((user) => user[1].toLowerCase().includes(searchName.toLowerCase()));
    }

    // Filter by date range
    if (startDate && endDate) {
      filteredData = filteredData.filter((user) => {
        const entryDate = new Date(user[0]);
        const startFilterDate = new Date(startDate);
        const endFilterDate = new Date(endDate);

        return entryDate >= startFilterDate && entryDate <= endFilterDate;
      });
    }

    setFilteredUsers(filteredData);
  };

  const resetFilter = () => {
    setStartDate('');
    setEndDate('');
    setSearchName('');
    setFilteredUsers(originalUsers);
  };

  const tableHead = ['Date', 'Name', 'Email', 'TimeIn / TimeOut', 'Timestamp', 'Duration', 'Salary']; // Added 'Salary' column

  return (
    <ScrollView style={styles.container}>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Name"
          value={searchName}
          onChangeText={(text) => setSearchName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Start Date (YYYY-MM-DD)"
          value={startDate}
          onChangeText={(text) => setStartDate(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="End Date (YYYY-MM-DD)"
          value={endDate}
          onChangeText={(text) => setEndDate(text)}
        />
        <View style={styles.buttonContainer}>
          <Button title="Search" onPress={filterData} style={styles.button} />
          <Button title="Reset" onPress={resetFilter} style={styles.button} />
        </View>
      </View>
      <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
        <Row data={tableHead} style={styles.head} textStyle={styles.text} />
        <Rows data={filteredUsers} textStyle={styles.text} />
      </Table>
    </ScrollView>
  );
};

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
  buttonContainer: {
    flexDirection: 'row',
    marginLeft: 10, // Adjust the margin as needed
  },
  button: {
    flex: 1,
    marginRight: 10, // Adjust the margin as needed
  },
});

export default SalaryAdmin;
