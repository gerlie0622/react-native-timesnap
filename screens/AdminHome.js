import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { dbFirestore } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';


const UserCount = () => {
  const [userCount, setUserCount] = useState(0);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);

  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        // Fetch the user collection from Firestore
        const usersRef = collection(dbFirestore, 'users');
        const usersSnapshot = await getDocs(usersRef);

        // Set the total registered user count
        setUserCount(usersSnapshot.size);
      } catch (error) {
        console.error('Error fetching user count:', error.message);
      }
    };

    const fetchTimeEntries = async () => {
      try {
        // Fetch the timeEntries collection from Firestore
        const timeEntriesRef = collection(dbFirestore, 'timeEntries');
        const timeEntriesSnapshot = await getDocs(timeEntriesRef);

        let presentCount = 0;
        let absentCount = 0;

        // Use a set to keep track of users who missed "Time In" on a given day
        const absentUsers = new Set();

        timeEntriesSnapshot.forEach((doc) => {
          const eventType = doc.data().eventType;
          const userEmail = doc.data().email;

          if (eventType === 'Time In') {
            presentCount++;
          } else if (eventType === 'Time Out' && !absentUsers.has(userEmail)) {
            // Check if the user missed "Time In" on the same day
            absentUsers.add(userEmail);
            absentCount++;
          }
        });

        // Set the counts for presents and absents
        setPresentCount(presentCount);
        setAbsentCount(absentCount);
      } catch (error) {
        console.error('Error fetching time entries:', error);
      }
    };

    // Fetch user count and time entries when the component mounts
    fetchUserCounts();
    fetchTimeEntries();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Total Number of Employees:</Text>
        <Text style={styles.cardValue}>{userCount}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Present Today:</Text>
        <Text style={styles.cardValue}>{presentCount}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Absent Today:</Text>
        <Text style={styles.cardValue}>{absentCount}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    width: '100%',
  },
  cardLabel: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
    fontWeight: 'bold',
  },
  cardValue: {
    fontSize: 24,
    color: '#0782F9', // or your preferred color
    fontWeight: 'bold',
  },
});

export default UserCount;
