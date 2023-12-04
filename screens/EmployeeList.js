import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import { firebase } from '../firebase';

const EmployeeList = () => {
  const [users, setUsers] = useState([]);
  const todoRef = firebase.firestore().collection('timeEntries');

  useEffect(() => {
    todoRef.onSnapshot((querySnapshot) => {
      const userList = [];
      querySnapshot.forEach((doc) => {
        const { date, userName, userEmail, eventType, timestamp } = doc.data();
        userList.push([date, userName, userEmail, eventType, timestamp]);
      });
      setUsers(userList);
    });
  }, []);

  const tableHead = ['Date', 'Name','Email', 'TimeIn / TimeOut','Timestamp'];

  return (
    <View style={styles.container}>
      <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
        <Row data={tableHead} style={styles.head} textStyle={styles.text} />
        <Rows data={users} textStyle={styles.text} />
      </Table>
    </View>
  );
};

export default EmployeeList;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 },
});
