// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, onValue, get, child } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9a26i_IlVhmRFdDQMI1961JoiSet7Cb0",
  authDomain: "ingsoft3-a4ed3.firebaseapp.com",
  projectId: "ingsoft3-a4ed3",
  storageBucket: "ingsoft3-a4ed3.appspot.com",
  messagingSenderId: "720855693265",
  appId: "1:720855693265:web:4a217628e579a1f9cad2f0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, set, push, onValue, get, child };