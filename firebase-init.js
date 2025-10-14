/**
 * Firebase Initialization - Simplified
 * 
 * Single file for all Firebase initialization.
 * Replaces: firebase-config.js, firebase-db.js, cms-firebase-adapter.js
 */

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

/**
 * Initialize Firebase
 * Returns a Promise that resolves when Firebase is ready
 */
function initializeFirebase() {
    return new Promise((resolve, reject) => {
        // Wait for Firebase SDK to load
        const checkSDK = () => {
            if (typeof firebase === 'undefined') {
                return false;
            }
            return true;
        };

        // If SDK not loaded yet, wait
        if (!checkSDK()) {
            const timeout = setTimeout(() => {
                reject(new Error('Firebase SDK load timeout'));
            }, 10000);

            const interval = setInterval(() => {
                if (checkSDK()) {
                    clearInterval(interval);
                    clearTimeout(timeout);
                    initializeApp();
                }
            }, 100);
        } else {
            initializeApp();
        }

        function initializeApp() {
            try {
                // Initialize Firebase
                firebase.initializeApp(firebaseConfig);
                
                // Get service references
                window.firebaseDb = firebase.database();
                window.firebaseAuth = firebase.auth();
                
                console.log('✅ Firebase initialized');
                resolve();
                
            } catch (error) {
                console.error('❌ Firebase initialization failed:', error);
                reject(error);
            }
        }
    });
}

// Create the promise immediately
window.firebaseReadyPromise = initializeFirebase();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.firebaseReadyPromise.catch(error => {
            console.warn('⚠️ Firebase unavailable:', error.message);
        });
    });
}

console.log('✅ Firebase init loaded');
