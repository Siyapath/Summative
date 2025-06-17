import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWVpJsAu6F5-xiM8ihKgAdrXrr1YPv9yo",
  authDomain: "ics4u-99035.firebaseapp.com",
  projectId: "ics4u-99035",
  storageBucket: "ics4u-99035.firebasestorage.app",
  messagingSenderId: "670163564627",
  appId: "1:670163564627:web:851772cf50c3ce0eb62ea6"
};


// Uncomment the following lines after pasting your firebaseConfig
const config = initializeApp(firebaseConfig)
const auth = getAuth(config);
const firestore = getFirestore(config);

export { auth, firestore };
