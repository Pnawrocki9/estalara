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
     * Load content from available sources - optimized for speed
     */
    async loadFromSources() {
        // Try localStorage first for instant loading on repeat visits
        const localData = this.loadFromLocalStorage();
        if (localData && this.validateContent(localData)) {
            console.log('📥 ContentStore: Loaded from localStorage (fast path)');
            
            // Load from Firebase in background to check for updates
            this.loadFromFirebase().then(firebaseData => {
                if (firebaseData && this.validateContent(firebaseData)) {
                    const normalized = this.normalizeData(firebaseData);
                    // Only update if data changed
                    if (JSON.stringify(normalized) !== JSON.stringify(localData)) {
                        console.log('🔄 ContentStore: Firebase data updated, reloading...');
                        this.content = normalized;
                        this.saveToLocalStorage(normalized);
                        // Trigger UI reload if EstalaraAdmin exists
                        if (window.estalaraAdmin) {
                            window.estalaraAdmin.content = normalized;
                            window.estalaraAdmin.loadUI();
                        }
                    }
                }
            }).catch(() => {
                // Firebase failed, but we already have localStorage data
            });
            
            return this.normalizeData(localData);
        }
        
        // Try Firebase (first time or localStorage unavailable)
        const firebaseData = await this.loadFromFirebase();
        if (firebaseData && this.validateContent(firebaseData)) {
            console.log('📥 ContentStore: Loaded from Firebase');
            const normalized = this.normalizeData(firebaseData);
            this.saveToLocalStorage(normalized); // Backup to localStorage
            return normalized;
        }
        
        // Use defaults
        console.log('📥 ContentStore: Using defaults');
        return this.defaults;
    }
    
    /**
     * Normalize data structure (handle admin.html vs frontend structure)
     */
    normalizeData(data) {
        // If data has .content wrapper (admin.html format), unwrap it
        if (data.content && typeof data.content === 'object') {
            const normalized = { ...data.content };
            
            // Keep properties array from top level if it exists
            if (Array.isArray(data.properties)) {
                normalized.properties = data.properties;
            }
            
            return normalized;
        }
        
        return data;
    }
    
    /**
     * Load from Firebase with timeout
     */
    async loadFromFirebase() {
        try {
            // Wait for Firebase to be ready (max 1 second for faster loading)
            await Promise.race([
                window.firebaseReadyPromise,
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Firebase timeout')), 1000)
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
        
        // Handle admin.html data structure (wrapped in .content)
        const actualData = data.content || data;
        
        // Must have navigation (can be in root or in content)
        if (!Array.isArray(actualData.navigation) || actualData.navigation.length === 0) {
            return false;
        }
        
        // Must have liveProperties OR properties (can be in root or in data.properties)
        const hasProperties = Array.isArray(actualData.liveProperties) || 
                             Array.isArray(actualData.properties) ||
                             Array.isArray(data.properties);
        if (!hasProperties) {
            return false;
        }
        
        // Must have pages structure
        if (!actualData.pages || typeof actualData.pages !== 'object') {
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
                        ctaText: "Explore Estalara App →",
                        ctaUrl: "https://app.estalara.com"
                    },
                    heroCta1Text: "Explore Estalara App →",
                    heroCta1Link: "https://app.estalara.com",
                    heroCta2Text: "How It Works",
                    heroCta2Link: "#how-it-works"
                },
                agents: {
                    hero: {
                        title: "Agents Go <span class=\"text-white\">GLOBAL</span>",
                        subtitle: "Attract and convert high-value global investors effortlessly. Livestream your listings and engage verified buyers in real time with AI-powered lead generation and automatic landing pages.",
                        ctaText: "Start Livestreaming →",
                        ctaUrl: "https://app.estalara.com"
                    },
                    heroCta1Text: "Start Livestreaming →",
                    heroCta1Link: "https://app.estalara.com",
                    heroCta2Text: "Explore Features",
                    heroCta2Link: "#features"
                },
                agencies: {
                    hero: {
                        title: "Agencies Go <span class=\"text-white\">ENTERPRISE</span>",
                        subtitle: "Transform your real estate agency into a global powerhouse. Scale operations, manage multiple agents, and expand internationally with Estalara's enterprise solutions designed for growing agencies.",
                        ctaText: "Scale Your Agency →",
                        ctaUrl: "https://app.estalara.com"
                    },
                    heroCta1Text: "Scale Your Agency →",
                    heroCta1Link: "https://app.estalara.com",
                    heroCta2Text: "Explore Solutions",
                    heroCta2Link: "#enterprise-features"
                },
                investors: {
                    hero: {
                        title: "Invest <span class=\"text-white\">WORLDWIDE</span>",
                        subtitle: "Discover, evaluate, and purchase properties worldwide with confidence. Attend live property tours with real agents and understand legal, cost, and location details in your own language through EstalaraAI.",
                        ctaText: "Explore Properties →",
                        ctaUrl: "https://app.estalara.com"
                    },
                    heroCta1Text: "Explore Properties →",
                    heroCta1Link: "https://app.estalara.com",
                    heroCta2Text: "Learn Benefits",
                    heroCta2Link: "#benefits"
                },
                about: {
                    hero: {
                        title: "Revolutionizing <span class=\"text-white\">GLOBAL REAL ESTATE</span>",
                        subtitle: "Estalara connects real estate agents and international investors through AI and live experiences. Our mission is to simplify global property transactions and make international real estate accessible to everyone.",
                        ctaText: "Join Our Platform →",
                        ctaUrl: "https://app.estalara.com"
                    },
                    heroCta1Text: "Join Our Platform →",
                    heroCta1Link: "https://app.estalara.com",
                    heroCta2Text: "Our Story",
                    heroCta2Link: "#story"
                }
            },
            
            footer: {
                socialLinks: [
                    { platform: "LinkedIn", url: "https://linkedin.com/company/estalara", icon: "linkedin" },
                    { platform: "Twitter", url: "https://twitter.com/estalara", icon: "twitter" },
                    { platform: "Instagram", url: "https://instagram.com/estalara", icon: "instagram" },
                    { platform: "Facebook", url: "https://facebook.com/estalara", icon: "facebook" }
                ]
            },
            
            howItWorks: {
                heading: "How It Works",
                subtitle: "Three simple steps to revolutionize your real estate experience",
                steps: [
                    {
                        number: "1",
                        title: "Go Live",
                        description: "Stream your properties to global investors in real-time with our advanced livestreaming technology."
                    },
                    {
                        number: "2",
                        title: "Connect",
                        description: "Engage with verified investors through AI-powered matching and instant translation capabilities."
                    },
                    {
                        number: "3",
                        title: "Close Fast",
                        description: "Complete transactions efficiently with our trusted network and streamlined processes."
                    }
                ]
            }
        };
    }
}

// Create global singleton
window.contentStore = new ContentStore();

console.log('✅ ContentStore loaded');
