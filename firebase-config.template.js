// Firebase Configuration Template
// INSTRUCTIONS: Replace all placeholder values with your actual Firebase config
// Get these values from Firebase Console → Project Settings → Your Apps → Web App

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",              // e.g., "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
  authDomain: "YOUR_AUTH_DOMAIN_HERE",      // e.g., "estalara-cms.firebaseapp.com"
  databaseURL: "YOUR_DATABASE_URL_HERE",    // e.g., "https://estalara-cms-default-rtdb.europe-west1.firebasedatabase.app"
  projectId: "YOUR_PROJECT_ID_HERE",        // e.g., "estalara-cms"
  storageBucket: "YOUR_STORAGE_BUCKET_HERE", // e.g., "estalara-cms.appspot.com"
  messagingSenderId: "YOUR_SENDER_ID_HERE", // e.g., "123456789012"
  appId: "YOUR_APP_ID_HERE"                 // e.g., "1:123456789012:web:abc123def456"
};

// Initialize Firebase
try {
  firebase.initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized successfully');
  
  // Get references to Firebase services
  window.firebaseDb = firebase.database();
  window.firebaseAuth = firebase.auth();
  
  console.log('✅ Firebase services ready');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  alert('Firebase connection failed. Please check your configuration.');
}

// Database reference helper
window.getAdminDataRef = () => {
  return window.firebaseDb.ref('adminData');
};

// Export for use in other scripts
window.firebaseConfig = firebaseConfig;
