import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Button, ScrollView } from 'react-native';
import { Table, Row, Rows } from 'react-native-reanimated-table';
import { firebase } from '../firebase';
import jsPDF from 'jspdf';
import 'jspdf-autotable'


const EmployeeList = () => {
  const [originalUsers, setOriginalUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [searchName, setSearchName] = useState('');
  const todoRef = firebase.firestore().collection('timeEntriesDraft');
  const usersRef = firebase.firestore().collection('users');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timeEntriesSnapshot = await todoRef.where('eventType', '==', 'Time In').get();
        const timeEntriesData = timeEntriesSnapshot.docs.map((doc) => doc.data());
    
        const usersSnapshot = await usersRef.get();
        const usersData = usersSnapshot.docs.reduce((acc, doc) => {
          acc[doc.data().email] = doc.data();
          return acc;
        }, {});
    
        const userList = timeEntriesData.map((entry) => {
          const user = usersData[entry.userEmail] || { name: 'Unknown', schedule: {} };
          const schedule = user.schedule || {};
          const timeInDate = new Date(entry.timestamp);
    
          // Determine status based on timestamp in "timeentriesdraft"
          let status = 'On Time';
          const entryHour = timeInDate.getHours();
          const entryMinute = timeInDate.getMinutes();
          const entrySecond = timeInDate.getSeconds();
    
          if (entryHour > 9 || (entryHour === 9 && entryMinute > 0)) {
            status = 'Late';
          }
    
          const timeIn = `${('0' + entryHour).slice(-2)}:${('0' + entryMinute).slice(-2)}:${('0' + entrySecond).slice(-2)}`;
    
          return [
            entry.date,
            user.name,
            entry.userEmail,
            entry.eventType,
            entry.timestamp,
            status,
          ];
        });
    
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

  const filterData = () => {
    let filteredData = originalUsers;

    if (searchName) {
      filteredData = filteredData.filter((user) => user[1].toLowerCase().includes(searchName.toLowerCase()));
    }

    if (selectedDate) {
      filteredData = filteredData.filter((user) => user[0] === selectedDate);
    }

    setFilteredUsers(filteredData);
  };

  const resetFilter = () => {
    setSelectedDate('');
    setSearchName('');
    setFilteredUsers(originalUsers);
  };

  const tableHead = ['Date', 'Name', 'Email', 'EventType', 'Timestamp', 'Status'];

 const exportToPDF=()=>{
    const doc = new jsPDF()
    doc.text("Employee Status",20,10)
    doc.autoTable({
      columns:tableHead,
      body:filteredUsers
    })

    doc.save('employee_status.pdf')
  }

  
  
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
          placeholder="Enter Date (YYYY-MM-DD)"
          value={selectedDate}
          onChangeText={(text) => setSelectedDate(text)}
        />
        <View style={styles.buttonContainer}>
          <Button title="Search" onPress={filterData} style={styles.button} />
          <Button title="Reset" onPress={resetFilter} style={styles.button} />
          <Button title="Export"  onPress={exportToPDF} style={styles.button} />
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

export default EmployeeList;