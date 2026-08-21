import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  type Auth,
  type UserCredential,
} from 'firebase/auth';

/**
 * Official Firebase Configuration for VILP Platform
 * Project: internship-life-cycle
 */
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAP-jCOTEFeybpobTeB5ZbwnFjurR3FgqA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "internship-life-cycle.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "internship-life-cycle",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "internship-life-cycle.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1017179263392",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1017179263392:web:00fc18be6db2f488d1d4c5",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-6NLHL5NHTE",
};

// Initialize Firebase App safely (prevent duplicate instance warnings during HMR)
export const firebaseApp: FirebaseApp = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

// Services
export const firestoreDb: Firestore = getFirestore(firebaseApp);
export const firebaseStorage: FirebaseStorage = getStorage(firebaseApp);
export const firebaseAuth: Auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();

// Configure Google Auth provider options
googleAuthProvider.setCustomParameters({
  prompt: 'select_account',
});

// ─── Firebase Auth Helper Functions ──────────────────────────────────────────

/**
 * Sign in with Google popup via Firebase Auth
 */
export async function firebaseSignInWithGoogle(): Promise<UserCredential> {
  return await signInWithPopup(firebaseAuth, googleAuthProvider);
}

/**
 * Sign in with Email and Password via Firebase Auth
 */
export async function firebaseSignInWithEmail(email: string, password: string): Promise<UserCredential> {
  return await signInWithEmailAndPassword(firebaseAuth, email, password);
}

/**
 * Sign up / Register with Email and Password via Firebase Auth
 */
export async function firebaseSignUpWithEmail(email: string, password: string): Promise<UserCredential> {
  return await createUserWithEmailAndPassword(firebaseAuth, email, password);
}

/**
 * Send password reset email via Firebase Auth
 */
export async function firebaseSendPasswordReset(email: string): Promise<void> {
  return await sendPasswordResetEmail(firebaseAuth, email);
}

/**
 * Sign out of Firebase Auth session
 */
export async function firebaseSignOut(): Promise<void> {
  return await signOut(firebaseAuth);
}

// Initialize Firebase Analytics safely (only in supported browser environments)
export let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(firebaseApp);
    }
  }).catch(() => {
    // Non-blocking fallback
  });
}
