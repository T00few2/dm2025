// lib/firebaseClient.ts
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';

/** 
 * Replace with your own config from the Firebase console. 
 * The API key and other fields are not secret in typical client usage.
 */
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: "https://dzr-member-site-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only once per client
function initFirebase() {
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
}

// A helper to get the Realtime Database instance
export function getDb() {
  initFirebase();
  return getDatabase();
}
