// Firebase Configuration for SafeReport
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDns1gdULSgBjEoopCuSFaWm3eZt4di6es",
  authDomain: "sriram-project-1-aea78.firebaseapp.com",
  projectId: "sriram-project-1-aea78",
  storageBucket: "sriram-project-1-aea78.firebasestorage.app",
  messagingSenderId: "972940288633",
  appId: "1:972940288633:web:9a265bdbc5971d8b236aa8",
  measurementId: "G-K77Q5WET70"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
