// Firebase Authentication Helper Functions
// Handles user authentication for CMS access

class FirebaseAuthService {
  constructor() {
    this.auth = firebase.auth();
    this.currentUser = null;
    
    // Listen for auth state changes
    this.auth.onAuthStateChanged((user) => {
      this.currentUser = user;
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
  async waitForAuth() {
    return new Promise((resolve) => {
      const unsubscribe = this.auth.onAuthStateChanged((user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }
}

// Initialize auth service after Firebase is ready
function initializeAuthService() {
  if (typeof firebase === 'undefined' || !firebase.apps || firebase.apps.length === 0) {
    console.warn('⏳ Waiting for Firebase to initialize before creating auth service...');
    setTimeout(initializeAuthService, 100);
    return;
  }
  
  // Create global auth service instance
  window.authService = new FirebaseAuthService();

  // Convenience functions
  window.firebaseSignIn = (email, password) => window.authService.signIn(email, password);
  window.firebaseSignOut = () => window.authService.signOut();
  window.isAuthenticated = () => window.authService.isAuthenticated();
  window.requireAuth = (redirectUrl) => window.authService.requireAuth(redirectUrl);

  console.log('✅ Firebase Auth Service initialized');
}

// Start initialization
initializeAuthService();
