import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { dbFirestore } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Attendance = () => {
  const [currentDateTime, setCurrentDateTime] = useState(getCurrentDateTime());
  const [isTimeInEnabled, setTimeInEnabled] = useState(true);
  const [isTimeOutEnabled, setTimeOutEnabled] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = getCurrentDateTime();
      setCurrentDateTime(now);

      // Enable "Time In" button at 00:00:01
      if (now.time === '00:00:01') {
        setTimeInEnabled(true);
        setTimeOutEnabled(false);
        AsyncStorage.setItem('isTimeInEnabled', 'true');
        AsyncStorage.setItem('isTimeOutEnabled', 'false');
      }
    }, 1000);

    // Load button states from AsyncStorage
    const loadButtonStates = async () => {
      const timeInEnabled = await AsyncStorage.getItem('isTimeInEnabled');
      const timeOutEnabled = await AsyncStorage.getItem('isTimeOutEnabled');

      if (timeInEnabled === 'false') {
        setTimeInEnabled(false);
      }

      if (timeOutEnabled === 'true') {
        setTimeOutEnabled(true);
      }
    };

    loadButtonStates();

    return () => {
      clearInterval(intervalId);
    };
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
    setTimeInEnabled(false); // Disable the "Time In" button
    setTimeOutEnabled(true); // Enable the "Time Out" button
    AsyncStorage.setItem('isTimeInEnabled', 'false');
    AsyncStorage.setItem('isTimeOutEnabled', 'true');
  };

  const handleTimeOut = () => {
    console.log('Time Out button pressed');
    const currentTime = new Date().toISOString();
    saveTimeToFirestore('Time Out', currentTime);
    setTimeOutEnabled(false); // Disable the "Time Out" button
    AsyncStorage.setItem('isTimeOutEnabled', 'false');
  };

  const auth = getAuth();
  let userEmail = '';

  onAuthStateChanged(auth, (user) => {
    if (user) {
      userEmail = user.email;
    } else {
      userEmail = '';
    }
  });

  const saveTimeToFirestore = async (eventType, currentTime) => {
    console.log('Saving time to Firestore...');

    try {
      const timeEntriesRef = collection(dbFirestore, 'timeEntries');
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
      <TouchableOpacity
        title="Time In"
        onPress={handleTimeIn}
        style={[styles.button, !isTimeInEnabled && styles.disabledButton]}
        disabled={!isTimeInEnabled}
      >
        <Text style={styles.buttonText}>Time In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        title="Time Out"
        onPress={handleTimeOut}
        style={[styles.button, !isTimeOutEnabled && styles.disabledButton]}
        disabled={!isTimeOutEnabled}
      >
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
  disabledButton: {
    backgroundColor: '#a0a0a0', // Use a different color for disabled state
  },
});

export default Attendance;
