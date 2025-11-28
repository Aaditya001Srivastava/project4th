// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace with YOUR Firebase values
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBg3EdnQD3DKp79KCqzvATsyfBhoZF2ge8",
  authDomain: "smart-attendance-final.firebaseapp.com",
  projectId: "smart-attendance-final",
  storageBucket: "smart-attendance-final.firebasestorage.app",
  messagingSenderId: "179738147138",
  appId: "1:179738147138:web:56321276e53c05a6a030db",
  measurementId: "G-MHWRPSY779"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore & Storage
export const db = getFirestore(app);
export const storage = getStorage(app);
