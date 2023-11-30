import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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

  return (
    <View style={styles.container}>
      <Text style={styles.digitalClock}>{currentDateTime.time}</Text>
      <Text style={styles.date}>{currentDateTime.date}</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Time In</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
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
    color: 'gray', // Added color to make the date visible
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
