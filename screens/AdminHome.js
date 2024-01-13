import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { dbFirestore } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Ionicons for the back button

const UserCount = ({ navigation }) => {
  const [userCount, setUserCount] = useState(0);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);

  useLayoutEffect(() => {
    if (navigation) {
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={30} color="#fff" style={styles.headerBackIcon} />
          </TouchableOpacity>
        ),
        headerShown: true,
        title: 'Admin Home',
        headerStyle: {
          backgroundColor: '#1A8FE3',
        },
        headerTintColor: '#fff',
      });
    }
  }, [navigation]);

  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        const usersRef = collection(dbFirestore, 'users');
        const usersSnapshot = await getDocs(usersRef);
        setUserCount(usersSnapshot.size);
      } catch (error) {
        console.error('Error fetching user count:', error.message);
      }
    };

    const fetchTimeEntries = async () => {
      try {
        const timeEntriesRef = collection(dbFirestore, 'timeEntriesDraft');
        const timeEntriesSnapshot = await getDocs(timeEntriesRef);

        let presentCount = 0;
        let absentCount = 0;
        const absentUsers = new Set();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        timeEntriesSnapshot.forEach((doc) => {
          const eventType = doc.data().eventType;
          const entryDate = new Date(doc.data().timestamp.toDate());

          if (entryDate >= today) {
            const userEmail = doc.data().email;

            if (eventType === 'Time In') {
              presentCount++;
            } else if (eventType === 'Time Out' && !absentUsers.has(userEmail)) {
              absentUsers.add(userEmail);
              absentCount++;
            }
          }
        });

        setPresentCount(presentCount);
        setAbsentCount(absentCount);
      } catch (error) {
        console.error('Error fetching time entries:', error.message);
      }
    };

    // Fetch user count and time entries when the component mounts
    fetchUserCounts();
    fetchTimeEntries();
  }, [navigation, userCount, presentCount, absentCount]);

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
    backgroundColor: '#F5F5F5F5',
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
    color: '#0782F9',
    fontWeight: 'bold',
  },
  headerBackIcon: {
    marginLeft: 16,
  },
});

export default UserCount;
