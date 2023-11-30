import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { dbFirestore } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Attendance = () => {
  const [currentDateTime, setCurrentDateTime] = useState(getCurrentDateTime());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(getCurrentDateTime());
    }, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  function getCurrentDateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');

    return {
      time: `${hours}:${minutes}:${seconds}`,
      date: `${year}-${month}-${day}`,
    };
  }

  const handleTimeIn = () => {
    console.log('Time In button pressed');
    const currentTime = new Date().toISOString();
    saveTimeToFirestore('Time In', currentTime);
  };

  const handleTimeOut = () => {
    console.log('Time Out button pressed');
    const currentTime = new Date().toISOString();
    saveTimeToFirestore('Time Out', currentTime);
  };

  const auth = getAuth();
  let userEmail = '';

  onAuthStateChanged(auth, (user) => {
    if (user) {
      userEmail = user.email;
    } else {
      // User is not logged in
      userEmail = ''; // Handle accordingly
    }
  });

  const saveTimeToFirestore = async (eventType, timestamp) => {
    console.log('Saving time to Firestore...');

    try {
      // Reference to the Firestore collection and document
      const timeEntriesRef = collection(dbFirestore, "timeEntries");
  
      // Adding a document to the 'timeEntries' collection with auto-generated ID
      const autoIdDocRef = await addDoc(timeEntriesRef, {
        userEmail,
        eventType,
        timestamp: getCurrentDateTime().time,
        date: getCurrentDateTime().date,
      });
      
  
      console.log('Time saved successfully with ID:', autoIdDocRef.id);
    } catch (error) {
      console.error('Error saving time:', error);
    }
  };  

  return (
    <View style={styles.container}>
      <Text style={styles.digitalClock}>{currentDateTime.time}</Text>
      <Text style={styles.date}>{currentDateTime.date}</Text>
      <TouchableOpacity title='Time In' onPress={handleTimeIn} style={styles.button}>
        <Text style={styles.buttonText}>Time In</Text>
      </TouchableOpacity>
      <TouchableOpacity title='Time Out' onPress={handleTimeOut} style={styles.button}>
        <Text style={styles.buttonText}>Time Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitalClock: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 50,
    color: 'gray',
  },
  button: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default Attendance;
