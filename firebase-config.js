// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyDQ4smGWtFgYG_c51Izpy8oTVk0zCyD2IE",
  authDomain: "prayer-report-app.firebaseapp.com",
  projectId: "prayer-report-app",
  storageBucket: "prayer-report-app.firebasestorage.app",
  messagingSenderId: "521783654727",
  appId: "1:521783654727:web:99b19cd1e3f8e8a5363462",
  measurementId: "G-63G4GX6NMZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
export const db = getFirestore(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firebase Analytics (only in browser environment)
let analytics;
try {
    if (typeof window !== 'undefined') {
        analytics = getAnalytics(app);
    }
} catch (error) {
    console.warn('Analytics not available:', error);
}
export { analytics };

export default app;
