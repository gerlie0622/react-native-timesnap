import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { firebase } from '../firebase'; // Import your Firebase configuration

const MyRecord = () => {
  const [timeEntries, setTimeEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTimeEntries = async () => {
      const currentUser = firebase.auth().currentUser;

      if (currentUser) {
        const currentUserUid = currentUser.uid;

        try {
          const timeEntriesRef = await firebase
            .firestore()
            .collection('timeEntriesDraft')
            .where('uid', '==', currentUserUid)
            .get();

          const entriesList = timeEntriesRef.docs.map((doc) => {
            const { date, timeIn, timeOut, uid } = doc.data();
            return { id: doc.id, date, timeIn, timeOut, uid };
          });

          setTimeEntries(entriesList);
        } catch (error) {
          console.error('Error fetching time entries:', error);
        }
      }
    };

    fetchTimeEntries();
  }, []);

  return (
    <View style={styles.container}>
      {/* Your rendering logic goes here */}
      <FlatList
        data={timeEntries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.recordContainer}>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.time}>{item.timeIn}</Text>
            <Text style={styles.time}>{item.timeOut}</Text>
          </View>
        )}
        ListHeaderComponent={() => (
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Date</Text>
            <Text style={styles.headerText}>Time In</Text>
            <Text style={styles.headerText}>Time Out</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // Your styles go here
});

export default MyRecord;
