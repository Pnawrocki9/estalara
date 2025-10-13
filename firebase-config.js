// Firebase Configuration for Estalara CMS
// Auto-generated with user credentials

const firebaseConfig = {
  apiKey: "AIzaSyAjsYOYP5IvNKo5KkN7AxN2br0oC4Mbs0w",
  authDomain: "estalara-8e22a.firebaseapp.com",
  databaseURL: "https://estalara-8e22a-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "estalara-8e22a",
  storageBucket: "estalara-8e22a.firebasestorage.app",
  messagingSenderId: "296468410777",
  appId: "1:296468410777:web:7171b74908b747dadfa308",
  measurementId: "G-G15DR28Y5J"
};

// Initialize Firebase
try {
  firebase.initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized successfully');
  console.log('📦 Project:', firebaseConfig.projectId);
  console.log('🗄️ Database:', firebaseConfig.databaseURL);
  
  // Get references to Firebase services
  window.firebaseDb = firebase.database();
  window.firebaseAuth = firebase.auth();
  
  console.log('✅ Firebase services ready');
  console.log('🔐 Auth ready');
  console.log('💾 Database ready');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  alert('Firebase connection failed. Please check your configuration and internet connection.');
}

// Database reference helper
window.getAdminDataRef = () => {
  return window.firebaseDb.ref('adminData');
};

// Export for use in other scripts
window.firebaseConfig = firebaseConfig;

console.log('🔥 Firebase Config Loaded - Estalara CMS');
