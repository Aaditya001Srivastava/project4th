// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ⚠️ Replace the below config with YOUR Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyCmKE5st3sPRiy5rVxfcWcPLAVQgjoLC2Q",
  authDomain: "project4th-13037.firebaseapp.com",
  projectId: "project4th-13037",
  storageBucket: "project4th-13037.firebasestorage.app",
  messagingSenderId: "765227297724",
  appId: "1:765227297724:web:dceefc4fbbdb6ac3b6d9b9",
  measurementId: "G-Y13G92WLXF"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);