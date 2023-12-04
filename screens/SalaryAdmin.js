import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Button, ScrollView } from 'react-native';
import { Table, Row, Rows } from 'react-native-reanimated-table';
import { firebase } from '../firebase';

const SalaryAdmin = () => {

    const tableHead = ['Date','Duration','Salary'];

return(
    <ScrollView style={styles.container}>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter employee"
        />
        <Button title="Search"/>
      </View>
      <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
        <Row data={tableHead} style={styles.head} textStyle={styles.text} />
      </Table>
    </ScrollView>
);    
};

export default SalaryAdmin

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