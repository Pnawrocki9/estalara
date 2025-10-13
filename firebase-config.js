// Firebase Configuration for Estalara CMS
// Auto-generated with user credentials

const firebaseConfig = {
  apiKey: "AIzaSyAjsYOYP5IvNKo5KkN7AxN2br0oC4Mbs0w",
  authDomain: "estalara-8e22a.firebaseapp.com",
  databaseURL: "https://estalara-8e22a-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "estalara-8e22a",
  storageBucket: "estalara-8e22a.appspot.com",
  messagingSenderId: "296468410777",
  appId: "1:296468410777:web:7171b74908b747dadfa308",
  measurementId: "G-G15DR28Y5J"
};

// Initialize Firebase with proper error handling
function initializeFirebase() {
  try {
    // Check if Firebase SDK is loaded
    if (typeof firebase === 'undefined') {
      console.error('❌ Firebase SDK not loaded');
      throw new Error('Firebase SDK not loaded. Please check your internet connection.');
    }

    // Initialize Firebase
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
    
    return true;
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // Show user-friendly error message with help
    let errorMessage = 'Błąd połączenia Firebase';
    let helpText = '';
    
    if (error.code === 'auth/invalid-api-key') {
      errorMessage = 'Nieprawidłowy klucz API Firebase';
      helpText = '\n\nOtwórz test-firebase-connection.html aby zdiagnozować problem.';
    } else if (error.code === 'PERMISSION_DENIED') {
      errorMessage = 'Brak dostępu do bazy danych Firebase';
      helpText = '\n\nPrawdopodobnie reguły bezpieczeństwa blokują dostęp.\nOtwórz test-firebase-connection.html lub przeczytaj NAPRAWA_FIREBASE.md';
    } else if (error.message && error.message.includes('network')) {
      errorMessage = 'Brak połączenia internetowego';
      helpText = '\n\nSprawdź połączenie i odśwież stronę.';
    } else {
      errorMessage = `Nie można połączyć z Firebase: ${error.message}`;
      helpText = '\n\nOtwórz test-firebase-connection.html aby zdiagnozować problem\nlub przeczytaj NAPRAWA_FIREBASE.md';
    }
    
    alert(errorMessage + helpText);
    return false;
  }
}

// Wait for Firebase SDK to be fully loaded before initializing
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFirebase);
} else {
  initializeFirebase();
}

// Database reference helper
window.getAdminDataRef = () => {
  return window.firebaseDb.ref('adminData');
};

// Export for use in other scripts
window.firebaseConfig = firebaseConfig;

console.log('🔥 Firebase Config Loaded - Estalara CMS');
