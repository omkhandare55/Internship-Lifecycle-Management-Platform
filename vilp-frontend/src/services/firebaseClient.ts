import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

/**
 * Firebase Configuration for VILP Realtime Services & Push Notifications
 * Replace these environment variables in your .env / Vercel dashboard with your Firebase project keys.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoKeyVILP2026AcademicPlatform',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'vilp-ghr-ecosystem.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'vilp-ghr-ecosystem',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'vilp-ghr-ecosystem.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '104857629384',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:104857629384:web:a78b9c0d1e2f3a4b',
};

// Initialize Firebase safely (prevent duplicate instance warnings during HMR)
export const firebaseApp: FirebaseApp = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

export const firestoreDb: Firestore = getFirestore(firebaseApp);
