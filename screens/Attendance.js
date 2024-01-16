import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { dbFirestore } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome
import { Alert } from 'react-native';
import styles from '../styles';

const Attendance = () => {
  const [currentDateTime, setCurrentDateTime] = useState(getCurrentDateTime());
  const [isTimeInEnabled, setTimeInEnabled] = useState(true);
  const [isTimeOutEnabled, setTimeOutEnabled] = useState(false);
  const [timeInTimestamp, setTimeInTimestamp] = useState(null);
  const [disabledTimeIn, setDisabledTimeIn] = useState(false);
  const [disabledTimeOut, setDisabledTimeOut] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Hide the header
    });
  }, [navigation]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = getCurrentDateTime();
      setCurrentDateTime(now);

      if (now.time === '00:00:01') {
        setTimeInEnabled(true);
        setTimeOutEnabled(false);
        AsyncStorage.setItem(`isTimeInEnabled_${userEmail}`, 'true');
        AsyncStorage.setItem(`isTimeOutEnabled_${userEmail}`, 'false');
      }
    }, 1000);

    const loadButtonStates = async () => {
      const timeInEnabled = await AsyncStorage.getItem(`isTimeInEnabled_${userEmail}`);
      const timeOutEnabled = await AsyncStorage.getItem(`isTimeOutEnabled_${userEmail}`);

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
  }, [userEmail]);

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
    const currentTime = new Date().toISOString();
    const confirmationMessage = `The time right now is ${currentDateTime.time}. Are you sure you want to time in?`;

    Alert.alert('Confirmation', confirmationMessage, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          setTimeInTimestamp(currentTime); 
          saveTimeToFirestore('Time In', currentTime);
          setTimeInEnabled(false);
          setTimeOutEnabled(true);
          AsyncStorage.setItem(`isTimeInEnabled_${userEmail}`, 'false');
          AsyncStorage.setItem(`isTimeOutEnabled_${userEmail}`, 'true');
          setDisabledTimeIn(true);
          setDisabledTimeOut(false);
        },
      },
    ]);
  };

  const handleTimeOut = () => {
    const currentTime = new Date().toISOString();
    const confirmationMessage = `The time right now is ${currentDateTime.time}. Are you sure you want to time out?`;

    Alert.alert('Confirmation', confirmationMessage, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          saveTimeToFirestore('Time Out', currentTime);
          setTimeOutEnabled(false);
          AsyncStorage.setItem(`isTimeOutEnabled_${userEmail}`, 'false');
          setDisabledTimeIn(true);
          setDisabledTimeOut(true);
        },
      },
    ]);
  };

  const enableButtons = () => {
    setTimeInEnabled((prev) => {
      if (!prev) {
        AsyncStorage.setItem(`isTimeInEnabled_${userEmail}`, 'true');
        setDisabledTimeIn(false);
      }
      return true;
    });

    setTimeOutEnabled((prev) => {
      if (!prev) {
        AsyncStorage.setItem(`isTimeOutEnabled_${userEmail}`, 'true');
        setDisabledTimeOut(false);
      }
      return true;
    });
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
      const timeEntriesRef = collection(dbFirestore, 'timeEntriesNew');

      let duration = null;
      if (eventType === 'Time Out' && timeInTimestamp) {
        const timeInDate = new Date(timeInTimestamp);
        const timeOutDate = new Date(currentTime);
        const durationMilliseconds = timeOutDate - timeInDate;

        const hours = Math.floor(durationMilliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((durationMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

        duration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
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

  const handleCamera = () => {
    navigation.navigate('Camera');
  };

  const goToHomeScreen = () => {
    navigation.navigate('EmployeeHomeScreen'); // Replace 'EmployeeHomeScreen' with the actual screen name
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton} onPress={goToHomeScreen}>
        <Icon name="home" size={30} color="white" />
      </TouchableOpacity>
      <Text style={styles.textStylee}>{currentDateTime.time}</Text>
      <Text style={styles.textStyle}>{currentDateTime.date}</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleCamera}>
        <Text style={styles.buttonText}>Camera</Text>
      </TouchableOpacity>
      <TouchableOpacity title="Enable Buttons" onPress={enableButtons} style={styles.button}>
        <Text style={styles.buttonText}>Activate</Text>
      </TouchableOpacity>
    </View>
  );
};


export default Attendance;
