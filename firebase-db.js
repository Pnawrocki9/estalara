// Firebase Database Service
// Handles all database operations for CMS data

class FirebaseDatabaseService {
  constructor() {
    this.db = firebase.database();
    this.adminDataRef = this.db.ref('adminData');
    this.cache = null;
  }

  // Save all admin data to Firebase
  async saveAdminData(data) {
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
    this.adminDataRef.on('value', (snapshot) => {
      const data = snapshot.val();
      this.cache = data;
      callback(data);
    });
  }

  // Stop listening for changes
  offDataChange() {
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

// Create global database service instance
window.dbService = new FirebaseDatabaseService();

// Convenience functions
window.saveToFirebase = (data) => window.dbService.saveAdminData(data);
window.loadFromFirebase = () => window.dbService.loadAdminData();
window.updateFirebaseProperty = (path, value) => window.dbService.updateProperty(path, value);

console.log('✅ Firebase Database Service initialized');
