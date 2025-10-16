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
            
            // Always merge with defaults to ensure all fields exist
            this.content = this.mergeWithDefaults(this.content);
            
            // Validate content is complete after merging with defaults
            if (!this.validateContent(this.content)) {
                console.warn('⚠️ ContentStore: Loaded content is incomplete after merge, using full defaults');
                this.content = this.defaults;
            }
            
            this.state = 'ready';
            console.log('✅ ContentStore: Ready');
            console.log(`   - Navigation: ${this.content.navigation?.length || 0} items`);
            console.log(`   - Live Properties: ${this.content.liveProperties?.length || 0} items`);
            console.log(`   - Statistics: ${this.content.statistics?.length || 0} items`);
            console.log(`   - How It Works: ${this.content.howItWorks ? '✅ Available' : '❌ Missing'}`);
            if (this.content.howItWorks) {
                console.log(`     Steps: ${this.content.howItWorks.steps?.length || 0}`);
            }
            
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
        if (localData) {
            console.log('📥 ContentStore: Loaded from localStorage (fast path)');

            // Merge local data with defaults so UI can render even if partial
            const normalizedLocal = this.normalizeData(localData);
            const mergedLocal = this.mergeWithDefaults(normalizedLocal);

            // Load from Firebase in background to check for updates
            this.loadFromFirebase().then(firebaseData => {
                if (firebaseData) {
                    const normalized = this.normalizeData(firebaseData);
                    const merged = this.mergeWithDefaults(normalized);
                    // Only update if data changed
                    if (JSON.stringify(merged) !== JSON.stringify(this.content)) {
                        console.log('🔄 ContentStore: Firebase data updated, reloading...');
                        this.content = merged;
                        this.saveToLocalStorage(merged);
                        // Trigger UI reload if EstalaraAdmin exists
                        if (window.estalaraAdmin) {
                            window.estalaraAdmin.content = merged;
                            window.estalaraAdmin.loadUI();
                        }
                    }
                }
            }).catch(() => {
                // Firebase failed, but we already have localStorage data
            });

            return mergedLocal;
        }

        // Try Firebase (first time or localStorage unavailable)
        const firebaseData = await this.loadFromFirebase();
        if (firebaseData) {
            console.log('📥 ContentStore: Loaded from Firebase');
            const normalized = this.normalizeData(firebaseData);
            const merged = this.mergeWithDefaults(normalized);
            this.saveToLocalStorage(merged); // Backup to localStorage
            return merged;
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
            
            // Keep statistics array from top level if it exists
            // Check both data.statistics and data.content.statistics
            if (Array.isArray(data.statistics)) {
                console.log('📊 ContentStore: Found statistics in top-level data:', data.statistics.length);
                normalized.statistics = data.statistics;
            } else if (Array.isArray(data.content.statistics)) {
                console.log('📊 ContentStore: Found statistics in content wrapper:', data.content.statistics.length);
                normalized.statistics = data.content.statistics;
            } else {
                console.log('📊 ContentStore: No statistics found in data');
            }
            
            // Migrate old CMS format to new structure
            normalized.pages = this.migratePageStructure(normalized.pages || data.pages);
            
            return normalized;
        }
        
        // Check for statistics in non-wrapped data
        if (Array.isArray(data.statistics)) {
            console.log('📊 ContentStore: Found statistics in direct data:', data.statistics.length);
        } else {
            console.log('📊 ContentStore: No statistics in direct data');
        }
        
        // Also migrate pages if data is in root level
        if (data.pages) {
            data.pages = this.migratePageStructure(data.pages);
        }
        
        return data;
    }
    
    /**
     * Migrate old CMS page structure to new hero structure
     * Old: pages.home.heroTitle, pages.home.heroSubtitle
     * New: pages.home.hero.title, pages.home.hero.subtitle
     */
    migratePageStructure(pages) {
        if (!pages || typeof pages !== 'object') return pages;
        
        const migratedPages = {};
        
        for (const [pageId, pageData] of Object.entries(pages)) {
            migratedPages[pageId] = { ...pageData };
            
            // Check if old format exists (heroTitle/heroSubtitle at page level)
            const hasOldFormat = pageData.heroTitle || pageData.heroSubtitle || 
                                 pageData.heroCta1Text || pageData.heroCta2Text;
            const hasNewFormat = pageData.hero && typeof pageData.hero === 'object';
            
            if (hasOldFormat && !hasNewFormat) {
                // Migrate old format to new
                console.log(`🔄 ContentStore: Migrating ${pageId} page from old to new hero structure`);
                
                migratedPages[pageId].hero = {
                    title: pageData.heroTitle || '',
                    subtitle: pageData.heroSubtitle || '',
                    ctaText: pageData.heroCta1Text || '',
                    ctaUrl: pageData.heroCta1Link || ''
                };
                
                // Keep CTA buttons for backward compatibility
                migratedPages[pageId].heroCta1Text = pageData.heroCta1Text;
                migratedPages[pageId].heroCta1Link = pageData.heroCta1Link;
                migratedPages[pageId].heroCta2Text = pageData.heroCta2Text;
                migratedPages[pageId].heroCta2Link = pageData.heroCta2Link;
                
                console.log(`✅ Migrated ${pageId}:`, {
                    title: migratedPages[pageId].hero.title,
                    subtitle: migratedPages[pageId].hero.subtitle?.substring(0, 50) + '...'
                });
            }
        }
        
        return migratedPages;
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
            // Ensure howItWorks exists
            if (!result.howItWorks || typeof result.howItWorks !== 'object') {
                result.howItWorks = this.defaults.howItWorks;
            }
            // Ensure features exist (deep-merge to guarantee homepage tiles)
            if (!result.features || typeof result.features !== 'object') {
                result.features = this.defaults.features;
            } else {
                // If .home list missing or empty, fall back to defaults so UI always renders
                const hasValidHomeFeatures = Array.isArray(result.features.home) && result.features.home.length > 0;
                if (!hasValidHomeFeatures) {
                    result.features.home = this.defaults.features.home;
                }
            }
            // Ensure whiteLabel exists
            if (!result.whiteLabel || typeof result.whiteLabel !== 'object') {
                result.whiteLabel = this.defaults.whiteLabel;
            }
            // Statistics: Only use what's in CMS, do not auto-populate defaults
            // Explicitly preserve statistics if they exist
            if (Array.isArray(data.statistics) && data.statistics.length > 0) {
                result.statistics = data.statistics;
                console.log('📊 ContentStore: Preserving statistics from data:', data.statistics.length, 'items');
            } else {
                // If no statistics in data, use empty array (don't show stale/default data)
                result.statistics = [];
                console.log('📊 ContentStore: No statistics in data, using empty array');
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
                    price: "$2,500,000",
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
            },
            
            features: {
                home: [
                    {
                        icon: "🎥",
                        title: "Live Property Tours",
                        description: "Showcase properties through immersive livestreams to global investors in real-time."
                    },
                    {
                        icon: "🤖",
                        title: "EstalaraAI Assistant",
                        description: "AI-powered natural language search and property recommendations in 25+ languages."
                    },
                    {
                        icon: "🌍",
                        title: "Global Network",
                        description: "Connect with verified investors and agents across 50+ countries worldwide."
                    },
                    {
                        icon: "⚡",
                        title: "Instant Matching",
                        description: "AI-powered lead generation automatically matches properties with interested investors."
                    },
                    {
                        icon: "🔒",
                        title: "Secure Transactions",
                        description: "Trusted network of notaries, title insurance, and legal support for safe deals."
                    },
                    {
                        icon: "📊",
                        title: "Analytics Dashboard",
                        description: "Track viewer engagement, lead quality, and conversion metrics in real-time."
                    }
                ]
            },
            
            whiteLabel: {
                title: "Idol Brands — White label for real estate agencies",
                subtitle: "We offer dedicated white label implementations — your brand, our technology. Launch a complete live commerce and social video platform under your agency's branding: on your own domain, with custom visual identity and configuration tailored to your sales processes.",
                benefitsTitle: "What you get",
                benefits: [
                    "Your own branding: logo, colors, domain/subdomain",
                    "Branded livestreams and short‑videos — without exposure of our brand",
                    "Agent and manager panels with permissions",
                    "CRM/MLS integrations and Single Sign‑On (SSO)"
                ],
                whyTitle: "Why it works",
                whyReasons: [
                    "Greater customer trust through consistent branding",
                    "Faster implementations and feature roadmap tailored to your needs",
                    "SLA, training and Enterprise support",
                    "Security and compliance (GDPR), scalable infrastructure"
                ],
                contactLabel: "Enterprise Cooperation",
                contactEmail: "peter@estalara.com"
            },

            // Statistics removed - should only come from CMS data
            statistics: []
        };
    }
}

// Create global singleton
window.contentStore = new ContentStore();

console.log('✅ ContentStore loaded');
