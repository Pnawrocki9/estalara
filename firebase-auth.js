// Firebase Authentication Helper Functions
// Handles user authentication for CMS access

class FirebaseAuthService {
  constructor() {
    this.auth = null;
    this.currentUser = null;
    this.authInitialized = false;
    
    // Initialize auth reference after ensuring Firebase is ready
    this.initAuth();
  }
  
  // Initialize auth reference and setup listeners
  initAuth() {
    // Get auth reference (this is now safe because initializeAuthService already checked)
    this.auth = firebase.auth();
    
    // Set persistence to LOCAL (survives browser restarts)
    this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        console.log('✅ Firebase Auth persistence set to LOCAL');
      })
      .catch((error) => {
        console.error('❌ Error setting persistence:', error);
      });
    
    // Listen for auth state changes
    this.auth.onAuthStateChanged((user) => {
      this.currentUser = user;
      this.authInitialized = true;
      this.onAuthStateChange(user);
    });
  }

  // Auth state change callback
  onAuthStateChange(user) {
    console.log('Auth state changed:', user ? `Logged in as ${user.email}` : 'Logged out');
    
    // Update UI based on auth state
    const event = new CustomEvent('authStateChanged', { detail: { user } });
    window.dispatchEvent(event);
  }

  // Sign in with email and password
  async signIn(email, password) {
    // Ensure auth is initialized
    if (!this.auth) {
      return { success: false, error: 'Firebase Auth not initialized yet' };
    }
    
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      console.log('✅ User signed in:', userCredential.user.email);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('❌ Sign in failed:', error);
      
      // User-friendly error messages
      let message = 'Login failed. Please try again.';
      switch (error.code) {
        case 'auth/invalid-email':
          message = 'Invalid email address.';
          break;
        case 'auth/user-disabled':
          message = 'This account has been disabled.';
          break;
        case 'auth/user-not-found':
          message = 'No account found with this email.';
          break;
        case 'auth/wrong-password':
          message = 'Incorrect password.';
          break;
        case 'auth/too-many-requests':
          message = 'Too many failed attempts. Please try again later.';
          break;
      }
      
      return { success: false, error: message };
    }
  }

  // Sign out
  async signOut() {
    // Ensure auth is initialized
    if (!this.auth) {
      return { success: false, error: 'Firebase Auth not initialized yet' };
    }
    
    try {
      await this.auth.signOut();
      console.log('✅ User signed out');
      return { success: true };
    } catch (error) {
      console.error('❌ Sign out failed:', error);
      return { success: false, error: 'Sign out failed. Please try again.' };
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Get current user email
  getUserEmail() {
    return this.currentUser ? this.currentUser.email : null;
  }

  // Require authentication (redirect if not authenticated)
  requireAuth(redirectUrl = '/cms-login.html') {
    if (!this.isAuthenticated()) {
      console.warn('⚠️ Authentication required. Redirecting to login...');
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  }

  // Wait for auth to initialize
  async waitForAuth(timeout = 5000) {
    // Wait for auth reference to be available
    while (!this.auth) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // If already initialized, return current user immediately
    if (this.authInitialized) {
      return this.currentUser;
    }
    
    return new Promise((resolve) => {
      let timeoutId = null;
      
      const unsubscribe = this.auth.onAuthStateChanged((user) => {
        if (timeoutId) clearTimeout(timeoutId);
        unsubscribe();
        resolve(user);
      });
      
      // Timeout fallback
      timeoutId = setTimeout(() => {
        unsubscribe();
        console.warn('⚠️ Auth initialization timeout, using current state');
        resolve(this.currentUser);
      }, timeout);
    });
  }
}

// Initialize auth service after Firebase is ready
async function initializeAuthService() {
  try {
    // Wait for Firebase to be ready using the Promise from firebase-config.js
    await window.firebaseReadyPromise;
    
    // Create global auth service instance
    window.authService = new FirebaseAuthService();

    // Convenience functions
    window.firebaseSignIn = (email, password) => window.authService.signIn(email, password);
    window.firebaseSignOut = () => window.authService.signOut();
    window.isAuthenticated = () => window.authService.isAuthenticated();
    window.requireAuth = (redirectUrl) => window.authService.requireAuth(redirectUrl);

    console.log('✅ Firebase Auth Service initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Auth Service:', error);
  }
}

// Start initialization
initializeAuthService();
