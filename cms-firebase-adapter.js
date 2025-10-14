// CMS Firebase Adapter
// Provides backward-compatible localStorage-like API for cms.js
// This allows cms.js to work with minimal changes

class CMSFirebaseAdapter {
    constructor() {
        this.db = null;
        this.adminDataRef = null;
        this.cache = null;
        this.initialized = false;
        
        // Delay Firebase initialization until Firebase SDK is ready
        this.initializeFirebaseRefs();
    }
    
    // Initialize Firebase references after Firebase is ready
    async initializeFirebaseRefs(retryCount = 0, maxRetries = 3) {
        try {
            // Wait for Firebase to be ready using the Promise from firebase-config.js
            // FIX: Add timeout to prevent infinite waiting
            const timeout = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Firebase initialization timeout')), 10000)
            );
            
            await Promise.race([
                window.firebaseReadyPromise,
                timeout
            ]);
            
            this.db = firebase.database();
            this.adminDataRef = this.db.ref('adminData');
            console.log('✅ Firebase adapter references initialized');
        } catch (error) {
            console.error(`❌ Failed to initialize Firebase adapter references (attempt ${retryCount + 1}/${maxRetries + 1}):`, error);
            
            // FIX: Retry logic with exponential backoff
            if (retryCount < maxRetries) {
                const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
                console.log(`🔄 Retrying Firebase initialization in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.initializeFirebaseRefs(retryCount + 1, maxRetries);
            } else {
                console.error('❌ Firebase initialization failed after all retries, continuing without Firebase');
            }
        }
    }

    // Initialize and load data from Firebase
    async init(retryCount = 0, maxRetries = 3) {
        if (this.initialized) return this.cache;
        
        // FIX: Add timeout to prevent infinite waiting
        let waitTime = 0;
        const maxWaitTime = 5000; // 5 seconds max wait
        while (!this.adminDataRef && waitTime < maxWaitTime) {
            await new Promise(resolve => setTimeout(resolve, 100));
            waitTime += 100;
        }
        
        if (!this.adminDataRef) {
            console.error('❌ Firebase refs not initialized after timeout, using empty cache');
            this.cache = {};
            this.initialized = true;
            return this.cache;
        }
        
        try {
            const snapshot = await this.adminDataRef.once('value');
            this.cache = snapshot.val() || {};
            this.initialized = true;
            console.log('✅ CMS Firebase Adapter initialized');
            return this.cache;
        } catch (error) {
            console.error(`❌ Failed to initialize Firebase adapter (attempt ${retryCount + 1}/${maxRetries + 1}):`, error);
            
            // FIX: Retry logic with exponential backoff
            if (retryCount < maxRetries) {
                const delay = Math.pow(2, retryCount) * 500; // 500ms, 1s, 2s
                console.log(`🔄 Retrying Firebase data load in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.init(retryCount + 1, maxRetries);
            } else {
                console.error('❌ Firebase data load failed after all retries, using empty cache');
                this.cache = {};
                this.initialized = true;
                return this.cache;
            }
        }
    }

    // Get admin data (localStorage-like API)
    async getAdminData() {
        if (!this.initialized) {
            await this.init();
        }
        return this.cache;
    }

    // Save admin data to Firebase
    async saveAdminData(data) {
        // Wait for Firebase refs to be initialized
        while (!this.adminDataRef) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        try {
            // Add timestamp
            data.lastUpdated = firebase.database.ServerValue.TIMESTAMP;
            
            // Save to Firebase
            await this.adminDataRef.set(data);
            
            // Update cache
            this.cache = data;
            
            console.log('✅ Admin data saved to Firebase');
            return { success: true };
        } catch (error) {
            console.error('❌ Failed to save admin data:', error);
            return { success: false, error: error.message };
        }
    }

    // Load admin data from localStorage or use defaults (for backward compatibility)
    loadAdminData() {
        // First check localStorage for backward compatibility
        const stored = localStorage.getItem('estalaraAdminData');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.warn('Failed to parse localStorage data:', e);
            }
        }
        
        // Return empty object if no data
        return null;
    }

    // Synchronous save to localStorage (for backward compatibility during migration)
    saveToLocalStorage(data) {
        localStorage.setItem('estalaraAdminData', JSON.stringify(data));
    }
}

// Create global instance
window.cmsFirebaseAdapter = new CMSFirebaseAdapter();

// Helper function to load admin data with Firebase fallback
window.loadAdminDataAsync = async function() {
    // Try Firebase first
    const firebaseData = await window.cmsFirebaseAdapter.getAdminData();
    if (firebaseData && Object.keys(firebaseData).length > 0) {
        console.log('📥 Loaded data from Firebase');
        return firebaseData;
    }
    
    // Fallback to localStorage
    const localData = window.cmsFirebaseAdapter.loadAdminData();
    if (localData) {
        console.log('📥 Loaded data from localStorage (consider migrating to Firebase)');
        return localData;
    }
    
    // Return empty structure
    console.log('⚠️ No data found, returning empty structure');
    return {};
};

// Helper function to save admin data to Firebase
window.saveAdminDataAsync = async function(data) {
    // Save to Firebase
    const result = await window.cmsFirebaseAdapter.saveAdminData(data);
    
    // Also save to localStorage as backup during transition
    window.cmsFirebaseAdapter.saveToLocalStorage(data);
    
    return result;
};

// Auto-sync localStorage changes to Firebase
// This intercepts localStorage.setItem calls for 'estalaraAdminData'
(function setupAutoSync() {
    const originalSetItem = localStorage.setItem;
    
    localStorage.setItem = function(key, value) {
        // Call original setItem
        originalSetItem.call(localStorage, key, value);
        
        // If this is our CMS data, also save to Firebase
        if (key === 'estalaraAdminData' && window.cmsFirebaseAdapter) {
            try {
                const data = JSON.parse(value);
                // Save to Firebase asynchronously (don't block)
                window.cmsFirebaseAdapter.saveAdminData(data)
                    .then(() => console.log('🔄 Auto-synced to Firebase'))
                    .catch(err => console.error('❌ Auto-sync failed:', err));
            } catch (e) {
                console.warn('Failed to auto-sync to Firebase:', e);
            }
        }
    };
    
    console.log('✅ Auto-sync to Firebase enabled for localStorage');
})();

console.log('✅ CMS Firebase Adapter loaded');
