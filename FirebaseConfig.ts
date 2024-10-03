// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { setLogLevel } from "firebase/app";
setLogLevel("silent");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBV7XFCS6HH5OnxvNs3hMUQDnTgyVevh1A",
  authDomain: "movieapp-9b9a7.firebaseapp.com",
  projectId: "movieapp-9b9a7",
  storageBucket: "movieapp-9b9a7.appspot.com",
  messagingSenderId: "257998012360",
  appId: "1:257998012360:web:f826a6c04df91321608afd"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
