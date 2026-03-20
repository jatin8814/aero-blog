import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// ⚠️ Move these to .env file:
// REACT_APP_FIREBASE_API_KEY=...
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyAfGXJFDt2G98nrREUhqqSdYB4ZV9vx3e4",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "aero-blog-6a7f8.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "aero-blog-6a7f8",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "aero-blog-6a7f8.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "477947102146",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:477947102146:web:db2af44cc32bc9b4b94c5b",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-KWR3PB8SJT",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);