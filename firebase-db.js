// Firebase Database Service
// Handles all database operations for CMS data

class FirebaseDatabaseService {
  constructor() {
    this.db = null;
    this.adminDataRef = null;
    this.cache = null;
    
    // Initialize database reference after ensuring Firebase is ready
    this.initDatabase();
  }
  
  // Initialize database reference
  initDatabase() {
    // Get database reference (this is now safe because we're called after Firebase init)
    this.db = firebase.database();
    this.adminDataRef = this.db.ref('adminData');
  }

  // Save all admin data to Firebase
  async saveAdminData(data) {
    // Ensure database is initialized
    while (!this.adminDataRef) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    try {
      console.log('💾 Saving admin data to Firebase...');
      
      // Add timestamp
      data.lastUpdated = firebase.database.ServerValue.TIMESTAMP;
      
      // Save to Firebase
      await this.adminDataRef.set(data);
      
      // Update cache
      this.cache = data;
      
      console.log('✅ Admin data saved to Firebase successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to save admin data:', error);
      return { success: false, error: error.message };
    }
  }

  // Load all admin data from Firebase
  async loadAdminData() {
    // Ensure database is initialized
    while (!this.adminDataRef) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    try {
      console.log('📥 Loading admin data from Firebase...');
      
      const snapshot = await this.adminDataRef.once('value');
      const data = snapshot.val();
      
      if (data) {
        console.log('✅ Admin data loaded from Firebase');
        this.cache = data;
        return { success: true, data };
      } else {
        console.log('⚠️ No data found in Firebase, using defaults');
        return { success: true, data: null };
      }
    } catch (error) {
      console.error('❌ Failed to load admin data:', error);
      return { success: false, error: error.message };
    }
  }

  // Update specific property in admin data
  async updateProperty(path, value) {
    // Ensure database is initialized
    while (!this.adminDataRef) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    try {
      console.log(`💾 Updating ${path} in Firebase...`);
      
      await this.adminDataRef.child(path).set(value);
      
      console.log(`✅ ${path} updated successfully`);
      return { success: true };
    } catch (error) {
      console.error(`❌ Failed to update ${path}:`, error);
      return { success: false, error: error.message };
    }
  }

  // Add item to array in Firebase
  async pushToArray(path, item) {
    // Ensure database is initialized
    while (!this.adminDataRef) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    try {
      console.log(`➕ Adding item to ${path}...`);
      
      const newRef = await this.adminDataRef.child(path).push(item);
      
      console.log(`✅ Item added to ${path}`);
      return { success: true, key: newRef.key };
    } catch (error) {
      console.error(`❌ Failed to add item to ${path}:`, error);
      return { success: false, error: error.message };
    }
  }

  // Delete item from Firebase
  async deleteProperty(path) {
    // Ensure database is initialized
    while (!this.adminDataRef) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    try {
      console.log(`🗑️ Deleting ${path} from Firebase...`);
      
      await this.adminDataRef.child(path).remove();
      
      console.log(`✅ ${path} deleted successfully`);
      return { success: true };
    } catch (error) {
      console.error(`❌ Failed to delete ${path}:`, error);
      return { success: false, error: error.message };
    }
  }

  // Listen for real-time changes
  onDataChange(callback) {
    // Ensure database is initialized
    if (!this.adminDataRef) {
      console.warn('⚠️ Database not initialized yet, cannot listen for changes');
      return;
    }
    
    this.adminDataRef.on('value', (snapshot) => {
      const data = snapshot.val();
      this.cache = data;
      callback(data);
    });
  }

  // Stop listening for changes
  offDataChange() {
    if (!this.adminDataRef) {
      return;
    }
    this.adminDataRef.off();
  }

  // Get cached data (instant, no Firebase call)
  getCachedData() {
    return this.cache;
  }

  // Export data as JSON (for backup)
  async exportData() {
    const result = await this.loadAdminData();
    if (result.success && result.data) {
      const dataStr = JSON.stringify(result.data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `estalara-cms-backup-${new Date().toISOString()}.json`;
      a.click();
      
      console.log('✅ Data exported successfully');
      return { success: true };
    }
    return { success: false, error: 'No data to export' };
  }

  // Import data from JSON (for restore)
  async importData(jsonData) {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      return await this.saveAdminData(data);
    } catch (error) {
      console.error('❌ Failed to import data:', error);
      return { success: false, error: error.message };
    }
  }
}

// Initialize database service after Firebase is ready
async function initializeDatabaseService() {
  try {
    // Wait for Firebase to be ready using the Promise from firebase-config.js
    await window.firebaseReadyPromise;
    
    // Create global database service instance
    window.dbService = new FirebaseDatabaseService();
    console.log('✅ Firebase Database Service initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Database Service:', error);
  }
}

// Start initialization
initializeDatabaseService();

// Convenience functions (with safety checks)
window.saveToFirebase = (data) => {
  if (!window.dbService) {
    console.error('❌ Database service not initialized yet');
    return Promise.resolve({ success: false, error: 'Database service not initialized' });
  }
  return window.dbService.saveAdminData(data);
};

window.loadFromFirebase = () => {
  if (!window.dbService) {
    console.error('❌ Database service not initialized yet');
    return Promise.resolve({ success: false, error: 'Database service not initialized' });
  }
  return window.dbService.loadAdminData();
};

window.updateFirebaseProperty = (path, value) => {
  if (!window.dbService) {
    console.error('❌ Database service not initialized yet');
    return Promise.resolve({ success: false, error: 'Database service not initialized' });
  }
  return window.dbService.updateProperty(path, value);
};
