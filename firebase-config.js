// Firebase configuration
// Using Firebase compat version (already loaded via CDN)

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
const app = firebase.initializeApp(firebaseConfig);

// Initialize Firestore Database
const db = firebase.firestore();

// Initialize Firebase Authentication
const auth = firebase.auth();

// Initialize Firebase Analytics (only in browser environment)
let analytics;
try {
    if (typeof window !== 'undefined') {
        analytics = firebase.analytics();
    }
} catch (error) {
    console.warn('Analytics not available:', error);
}

// Make available globally
window.db = db;
window.auth = auth;
window.analytics = analytics;
window.firebaseApp = app;
