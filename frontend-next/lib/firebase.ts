/**
 * Firebase client-side initialization
 * Used for authentication on the frontend
 */
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate configuration
function validateConfig() {
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  ];

  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    console.warn(
      '⚠️ Missing Firebase configuration:',
      missing.join(', '),
      '\nPlease update .env.local with your Firebase credentials'
    );
    return false;
  }

  return true;
}

let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;

// Initialize Firebase
export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === 'undefined') return null; // Server-side

  if (!validateConfig()) {
    return null;
  }

  if (!firebaseApp) {
    try {
      firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    } catch (error) {
      console.error('Firebase initialization error:', error);
      return null;
    }
  }

  return firebaseApp;
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();
  if (!app) return null;

  if (!auth) {
    auth = getAuth(app);
  }

  return auth;
}

export { firebaseConfig };
