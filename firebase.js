// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPU31PV5n85e6iiHpQ0T9vYAave-nlBKQ",
  authDomain: "timesnap-94e75.firebaseapp.com",
  projectId: "timesnap-94e75",
  storageBucket: "timesnap-94e75.appspot.com",
  messagingSenderId: "235347059653",
  appId: "1:235347059653:web:b4fe01244905d74e45a1ac"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0){
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app ()
}


const auth = app.auth();
const dbFirestore = app.firestore()


export { auth, dbFirestore };
