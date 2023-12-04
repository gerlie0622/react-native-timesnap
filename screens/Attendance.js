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
  const [timeInTimestamp, setTimeInTimestamp] = useState(null);
  const [disabledTimeIn, setDisabledTimeIn] = useState(false);
  const [disabledTimeOut, setDisabledTimeOut] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const checkMidnight = () => {
      const now = getCurrentDateTime();
      if (now.time >= '00:00:00' && now.time < '00:00:01' && !isTimeInEnabled) {
        // Enable "Time In" button after midnight
        setTimeInEnabled(true);
        setTimeOutEnabled(false);
        AsyncStorage.setItem(`isTimeInEnabled_${userEmail}`, 'true');
        AsyncStorage.setItem(`isTimeOutEnabled_${userEmail}`, 'false');
      }
      if (now.time >= '00:00:00' && now.time < '00:00:01' && isTimeOutEnabled) {
        // Disable "Time Out" button after midnight
        setTimeOutEnabled(false);
        AsyncStorage.setItem(`isTimeOutEnabled_${userEmail}`, 'false');
      }
  
      // Schedule the next check for the next midnight
      const nextMidnight = new Date(now.date + 'T00:00:01').getTime();
      const timeUntilMidnight = nextMidnight - new Date().getTime();
      setTimeout(checkMidnight, timeUntilMidnight);
    };
  
    // Initial check for midnight
    checkMidnight();
  
    // Cleanup the timeout on component unmount
    return () => clearTimeout(checkMidnight);
  
  }, [userEmail, isTimeInEnabled, isTimeOutEnabled]);
  
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
    setTimeInTimestamp(currentTime); 
    saveTimeToFirestore('Time In', currentTime);
    setTimeInEnabled(false); 
    setTimeOutEnabled(true); 
    AsyncStorage.setItem(`isTimeInEnabled_${userEmail}`, 'false');
    AsyncStorage.setItem(`isTimeOutEnabled_${userEmail}`, 'true');
    setDisabledTimeIn(true);
    setDisabledTimeOut(false);
  };
  

  const handleTimeOut = () => {
    console.log('Time Out button pressed');
    const currentTime = new Date().toISOString();
    saveTimeToFirestore('Time Out', currentTime);
    setTimeOutEnabled(false); // Disable the "Time Out" button
    AsyncStorage.setItem(`isTimeOutEnabled_${userEmail}`, 'false');
    setDisabledTimeIn(true);
    setDisabledTimeOut(true);
  };

  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserEmail(user.email);
    } else {
      setUserEmail('');
    }
  });

  const saveTimeToFirestore = async (eventType, currentTime) => {
    console.log('Saving time to Firestore...');

    try {
      const timeEntriesRef = collection(dbFirestore, 'timeEntries');

      let duration = null;
      if (eventType === 'Time Out' && timeInTimestamp) {
        const timeInDate = new Date(timeInTimestamp);
        const timeOutDate = new Date(currentTime);
        const durationMilliseconds = timeOutDate - timeInDate;

        const hours = Math.floor(durationMilliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((durationMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

        duration = `${hours}h ${minutes}m`;
      }

      const autoIdDocRef = await addDoc(timeEntriesRef, {
        userEmail,
        eventType,
        timestamp: getCurrentDateTime().time,
        date: getCurrentDateTime().date,
        duration,
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
    backgroundColor: '#a0a0a0', // Use a different color for the disabled state
  },
});

export default Attendance;
