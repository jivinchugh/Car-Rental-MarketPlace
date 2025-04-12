// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//1. import firestore service from firebase/firestore
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnsNvWCU13E0lDIluqJnFF5rVqIWi6EOM",
  authDomain: "car-marketplace-9e718.firebaseapp.com",
  projectId: "car-marketplace-9e718",
  storageBucket: "car-marketplace-9e718.firebasestorage.app",
  messagingSenderId: "135434987043",
  appId: "1:135434987043:web:b1b52e331ef4243acf7396",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//2. initialize firestore service
const db = getFirestore(app);
const auth = getAuth(app);
//3. export firestore service for use in other files
export { db, auth };
