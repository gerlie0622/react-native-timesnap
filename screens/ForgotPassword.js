import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../firebase';

const ForgotPassword = () => {
  const sendPasswordResetEmail = () => {
    const user = auth.currentUser;

    if (user) {
      user
        .sendEmailVerification()
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
      <Text style={styles.messageText}>
        Hi, {auth.currentUser?.email}! To reset your password, please click the button below.
      </Text>
      <TouchableOpacity
        onPress={sendPasswordResetEmail}
        style={[styles.button, styles.buttonOutline]}
      >
        <Text style={styles.buttonText}>Forget Password</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  messageText: {
    textAlign: 'center',
    color: 'black', // Choose your desired text color
    marginBottom: 20,
  },
});
