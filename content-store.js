/**
 * ContentStore - Single Source of Truth for CMS Content
 * 
 * This class manages all content loading with a clear hierarchy:
 * 1. Firebase (production data)
 * 2. localStorage (backup/fallback)
 * 3. Defaults (always available)
 * 
 * No race conditions, no multiple fallbacks, just clean Promise-based loading.
 */

class ContentStore {
    constructor() {
        this.state = 'initializing';
        this.content = null;
        this.error = null;
        
        // Single defaults instance (not recreated 180 times)
        this.defaults = this.createDefaults();
        
        // Promise that resolves when content is loaded
        this.ready = this.initialize();
    }
    
    /**
     * Initialize content loading
     * Returns a Promise that resolves when content is ready
     */
    async initialize() {
        try {
            this.state = 'loading';
            console.log('📦 ContentStore: Initializing...');
            
            // Try sources in order: Firebase -> localStorage -> defaults
            this.content = await this.loadFromSources();
            
            // Validate content is complete
            if (!this.validateContent(this.content)) {
                console.warn('⚠️ ContentStore: Loaded content is incomplete, merging with defaults');
                this.content = this.mergeWithDefaults(this.content);
            }
            
            this.state = 'ready';
            console.log('✅ ContentStore: Ready');
            console.log(`   - Navigation: ${this.content.navigation?.length || 0} items`);
            console.log(`   - Live Properties: ${this.content.liveProperties?.length || 0} items`);
            
            return this.content;
            
        } catch (error) {
            this.state = 'error';
            this.error = error;
            console.error('❌ ContentStore: Initialization failed:', error.message);
            
            // Fallback to defaults on complete failure
            this.content = this.defaults;
            this.state = 'ready';
            
            return this.content;
        }
    }
    
    /**
     * Load content from available sources
     */
    async loadFromSources() {
        // Try Firebase first
        const firebaseData = await this.loadFromFirebase();
        if (firebaseData && this.validateContent(firebaseData)) {
            console.log('📥 ContentStore: Loaded from Firebase');
            this.saveToLocalStorage(firebaseData); // Backup to localStorage
            return firebaseData;
        }
        
        // Try localStorage
        const localData = this.loadFromLocalStorage();
        if (localData && this.validateContent(localData)) {
            console.log('📥 ContentStore: Loaded from localStorage');
            return localData;
        }
        
        // Use defaults
        console.log('📥 ContentStore: Using defaults');
        return this.defaults;
    }
    
    /**
     * Load from Firebase with timeout
     */
    async loadFromFirebase() {
        try {
            // Wait for Firebase to be ready (max 2 seconds for faster loading)
            await Promise.race([
                window.firebaseReadyPromise,
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Firebase timeout')), 2000)
                )
            ]);
            
            // Load data
            const db = firebase.database();
            const snapshot = await db.ref('adminData').once('value');
            const data = snapshot.val();
            
            return data;
            
        } catch (error) {
            console.warn('⚠️ ContentStore: Firebase unavailable:', error.message);
            return null;
        }
    }
    
    /**
     * Load from localStorage
     */
    loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem('estalaraAdminData');
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.warn('⚠️ ContentStore: localStorage unavailable:', error.message);
        }
        return null;
    }
    
    /**
     * Save to localStorage
     */
    saveToLocalStorage(data) {
        try {
            localStorage.setItem('estalaraAdminData', JSON.stringify(data));
        } catch (error) {
            console.warn('⚠️ ContentStore: Cannot save to localStorage:', error.message);
        }
    }
    
    /**
     * Validate content has all required fields
     * This prevents accepting empty {} from Firebase
     */
    validateContent(data) {
        if (!data || typeof data !== 'object') {
            return false;
        }
        
        // Must have navigation
        if (!Array.isArray(data.navigation) || data.navigation.length === 0) {
            return false;
        }
        
        // Must have liveProperties OR properties
        if (!Array.isArray(data.liveProperties) && !Array.isArray(data.properties)) {
            return false;
        }
        
        // Must have pages structure
        if (!data.pages || typeof data.pages !== 'object') {
            return false;
        }
        
        return true;
    }
    
    /**
     * Merge incomplete content with defaults
     */
    mergeWithDefaults(data) {
        const result = { ...this.defaults };
        
        if (data) {
            // Merge top-level properties
            Object.keys(data).forEach(key => {
                if (data[key] !== undefined && data[key] !== null) {
                    result[key] = data[key];
                }
            });
            
            // Ensure critical arrays exist
            if (!Array.isArray(result.navigation)) {
                result.navigation = this.defaults.navigation;
            }
            if (!Array.isArray(result.liveProperties)) {
                result.liveProperties = this.defaults.liveProperties;
            }
            if (!result.pages || typeof result.pages !== 'object') {
                result.pages = this.defaults.pages;
            }
        }
        
        return result;
    }
    
    /**
     * Get content (waits if not ready yet)
     */
    async getContent() {
        await this.ready;
        return this.content;
    }
    
    /**
     * Save content to all sources
     */
    async saveContent(newContent) {
        try {
            // Validate before saving
            if (!this.validateContent(newContent)) {
                throw new Error('Invalid content structure');
            }
            
            // Save to localStorage immediately
            this.saveToLocalStorage(newContent);
            
            // Save to Firebase (async, don't wait)
            this.saveToFirebase(newContent).catch(error => {
                console.error('❌ ContentStore: Failed to save to Firebase:', error.message);
            });
            
            // Update in-memory content
            this.content = newContent;
            
            console.log('✅ ContentStore: Content saved');
            return true;
            
        } catch (error) {
            console.error('❌ ContentStore: Failed to save content:', error.message);
            return false;
        }
    }
    
    /**
     * Save to Firebase
     */
    async saveToFirebase(data) {
        try {
            await window.firebaseReadyPromise;
            const db = firebase.database();
            await db.ref('adminData').set({
                ...data,
                lastUpdated: firebase.database.ServerValue.TIMESTAMP
            });
        } catch (error) {
            throw new Error(`Firebase save failed: ${error.message}`);
        }
    }
    
    /**
     * Create default content (called once)
     */
    createDefaults() {
        return {
            siteTitle: "Estalara - Go LIVE. Go GLOBAL.",
            siteDescription: "Estalara connects real estate agents and international investors through AI and live experiences.",
            contactEmail: "estalara@estalara.com",
            logoUrl: "assets/EstalaraLogo.png",
            
            navigation: [
                { label: "Home", url: "index.html" },
                { label: "For Agents", url: "agents.html" },
                { label: "For Agencies", url: "agencies.html" },
                { label: "For Investors", url: "investors.html" },
                { label: "About", url: "about.html" },
                { label: "FAQ", url: "faq.html" }
            ],
            
            liveProperties: [
                {
                    id: "1",
                    title: "Luxury Villa in Marbella",
                    location: "Marbella, Spain",
                    price: "€2,500,000",
                    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
                    beds: "5",
                    baths: "4",
                    area: "450m²",
                    link: "https://app.estalara.com"
                },
                {
                    id: "2",
                    title: "Modern Apartment in Dubai",
                    location: "Dubai Marina, UAE",
                    price: "$1,800,000",
                    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
                    beds: "3",
                    baths: "2",
                    area: "200m²",
                    link: "https://app.estalara.com"
                },
                {
                    id: "3",
                    title: "Penthouse in New York",
                    location: "Manhattan, NY",
                    price: "$5,200,000",
                    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
                    beds: "4",
                    baths: "3",
                    area: "320m²",
                    link: "https://app.estalara.com"
                },
                {
                    id: "4",
                    title: "Beach House in Miami",
                    location: "Miami Beach, FL",
                    price: "$3,800,000",
                    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
                    beds: "6",
                    baths: "5",
                    area: "520m²",
                    link: "https://app.estalara.com"
                },
                {
                    id: "5",
                    title: "Mountain Chalet in Switzerland",
                    location: "Zermatt, Switzerland",
                    price: "CHF 4,500,000",
                    image: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800",
                    beds: "7",
                    baths: "6",
                    area: "600m²",
                    link: "https://app.estalara.com"
                },
                {
                    id: "6",
                    title: "City Loft in London",
                    location: "Canary Wharf, UK",
                    price: "£1,200,000",
                    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
                    beds: "2",
                    baths: "2",
                    area: "150m²",
                    link: "https://app.estalara.com"
                }
            ],
            
            pages: {
                home: {
                    hero: {
                        title: "Go LIVE. Go GLOBAL.",
                        subtitle: "Connect real estate agents with international investors through AI-powered live experiences.",
                        ctaText: "Estalara Marketplace",
                        ctaUrl: "https://app.estalara.com"
                    }
                }
            },
            
            footer: {
                socialLinks: [
                    { platform: "LinkedIn", url: "https://linkedin.com/company/estalara", icon: "linkedin" },
                    { platform: "Twitter", url: "https://twitter.com/estalara", icon: "twitter" },
                    { platform: "Instagram", url: "https://instagram.com/estalara", icon: "instagram" },
                    { platform: "Facebook", url: "https://facebook.com/estalara", icon: "facebook" }
                ]
            }
        };
    }
}

// Create global singleton
window.contentStore = new ContentStore();

console.log('✅ ContentStore loaded');
