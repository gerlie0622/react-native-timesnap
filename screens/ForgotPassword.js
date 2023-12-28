import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../firebase';
import styles from '../styles';

const ForgotPassword = () => {
  const sendPasswordResetEmail = () => {
    const user = auth.currentUser;

    if (user) {
      auth
        .sendPasswordResetEmail(user.email)
        .then(() => {
          alert('Password reset email sent. Please check your email.');
        })
        .catch((error) => {
          alert(error.message);
        });
    } else {
      alert('No user is currently signed in.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>
        Hi, {auth.currentUser?.email}! To reset your password, please click the button below. 
        We will send you an email with instructions.
      </Text>
      <TouchableOpacity
        onPress={sendPasswordResetEmail}
        style={[styles.button, styles.buttonOutline]}
      >
        <Text style={styles.text}>Forget Password</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ForgotPassword;
