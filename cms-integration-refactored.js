/**
 * Estalara CMS Integration - Refactored
 * 
 * Clean, maintainable code with proper separation of concerns:
 * - ContentStore handles all data loading/saving
 * - EstalaraAdmin handles UI updates
 * - No race conditions, no defensive programming everywhere
 */

class EstalaraAdmin {
    constructor() {
        // Initialize after ContentStore is ready
        this.initialize();
    }

    async initialize() {
        try {
            // Wait for ContentStore to load content
            this.content = await window.contentStore.getContent();
            
            console.log('✅ EstalaraAdmin: Initialized');
            
            // Load all UI elements
            this.loadUI();
            this.setupEventListeners();
            
        } catch (error) {
            console.error('❌ EstalaraAdmin: Initialization failed:', error);
        }
    }

    /**
     * Load all UI elements from content
     */
    loadUI() {
        this.loadNavigation();
        this.loadFooter();
        this.loadHero();
        this.loadLiveProperties();
        this.loadButtons();
    }

    /**
     * Load navigation menu
     */
    loadNavigation() {
        const nav = document.querySelector('nav ul, .nav-links');
        if (!nav || !this.content.navigation) return;

        nav.innerHTML = this.content.navigation.map(item => `
            <li><a href="${item.url}">${item.label}</a></li>
        `).join('');
    }

    /**
     * Load footer content
     */
    loadFooter() {
        const footer = document.querySelector('footer');
        if (!footer) return;

        // Load social links
        const socialContainer = footer.querySelector('.social-links');
        if (socialContainer && this.content.footer?.socialLinks) {
            socialContainer.innerHTML = this.content.footer.socialLinks.map(link => `
                <a href="${link.url}" target="_blank" rel="noopener" aria-label="${link.platform}">
                    <i class="fab fa-${link.icon}"></i>
                </a>
            `).join('');
        }

        // Load contact email
        if (this.content.contactEmail) {
            const emailLinks = footer.querySelectorAll('a[href^="mailto:"]');
            emailLinks.forEach(link => {
                link.href = `mailto:${this.content.contactEmail}`;
                link.textContent = this.content.contactEmail;
            });
        }
    }

    /**
     * Load hero section
     */
    loadHero() {
        const hero = this.content.pages?.home?.hero;
        if (!hero) return;

        // Title
        const title = document.querySelector('.hero h1, .hero-title');
        if (title) title.textContent = hero.title;

        // Subtitle
        const subtitle = document.querySelector('.hero p, .hero-subtitle');
        if (subtitle) subtitle.textContent = hero.subtitle;

        // CTA Button
        const cta = document.querySelector('.hero .cta-button, .hero-cta');
        if (cta) {
            cta.textContent = hero.ctaText;
            cta.href = hero.ctaUrl;
        }
    }

    /**
     * Load live properties section
     */
    loadLiveProperties() {
        const container = document.querySelector('#live-properties .grid, .properties-grid');
        if (!container) return;

        const properties = this.content.liveProperties || [];
        
        container.innerHTML = properties.map(prop => `
            <div class="property-card reveal">
                <img src="${prop.image}" alt="${prop.title}" loading="lazy">
                <div class="property-info">
                    <h3>${prop.title}</h3>
                    <p class="location"><i class="fas fa-map-marker-alt"></i> ${prop.location}</p>
                    <p class="price">${prop.price}</p>
                    <div class="property-details">
                        <span><i class="fas fa-bed"></i> ${prop.beds}</span>
                        <span><i class="fas fa-bath"></i> ${prop.baths}</span>
                        <span><i class="fas fa-ruler-combined"></i> ${prop.area}</span>
                    </div>
                    <a href="${prop.link}" class="view-property-btn">View Property</a>
                </div>
            </div>
        `).join('');

        // Trigger reveal animations if available
        if (window.observeReveals) {
            window.observeReveals(container.querySelectorAll('.reveal'));
        }
    }

    /**
     * Load CTA buttons
     */
    loadButtons() {
        const headerBtn = document.querySelector('header .cta-button');
        if (headerBtn && this.content.pages?.home?.hero) {
            headerBtn.textContent = this.content.pages.home.hero.ctaText || 'Launch App';
            headerBtn.href = this.content.pages.home.hero.ctaUrl || 'https://app.estalara.com';
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for Firebase updates
        if (window.firebaseDb) {
            window.firebaseDb.ref('adminData').on('value', async (snapshot) => {
                const data = snapshot.val();
                if (data && window.contentStore.validateContent(data)) {
                    console.log('🔄 Firebase updated, reloading UI');
                    this.content = data;
                    this.loadUI();
                }
            });
        }

        // Listen for localStorage updates (multi-tab sync)
        window.addEventListener('storage', async (e) => {
            if (e.key === 'estalaraAdminData') {
                console.log('🔄 localStorage updated, reloading UI');
                this.content = await window.contentStore.getContent();
                this.loadUI();
            }
        });
    }

    /**
     * Save content (delegates to ContentStore)
     */
    async saveContent(newContent) {
        const success = await window.contentStore.saveContent(newContent);
        if (success) {
            this.content = newContent;
            this.loadUI();
        }
        return success;
    }

    /**
     * Get current content
     */
    getContent() {
        return this.content;
    }
}

/**
 * Initialize when ContentStore is ready
 */
async function initEstalaraAdmin() {
    try {
        // Ensure ContentStore exists
        if (!window.contentStore) {
            console.error('❌ ContentStore not loaded! Make sure content-store.js is included before cms-integration.js');
            return;
        }

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }

        // Wait a bit for main.js to initialize (if it exists)
        if (window.observeReveals === undefined) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Create global instance
        window.estalaraAdmin = new EstalaraAdmin();

    } catch (error) {
        console.error('❌ Failed to initialize EstalaraAdmin:', error);
    }
}

// Start initialization
initEstalaraAdmin();

/**
 * Utility functions for backward compatibility
 */

// Force refresh from CMS
window.forceRefreshFromCMS = async function() {
    console.log('🔄 Force refreshing from CMS...');
    
    // Reload from Firebase
    const firebaseData = await window.contentStore.loadFromFirebase();
    if (firebaseData && window.contentStore.validateContent(firebaseData)) {
        await window.contentStore.saveContent(firebaseData);
        window.estalaraAdmin.content = firebaseData;
        window.estalaraAdmin.loadUI();
        console.log('✅ Refreshed from Firebase');
    } else {
        console.warn('⚠️ Firebase data invalid or unavailable');
    }
};

// Clear CMS cache
window.clearCMSCache = function() {
    console.log('🗑️ Clearing CMS cache...');
    localStorage.removeItem('estalaraAdminData');
    location.reload();
};

// Diagnostic function
window.diagnoseCMS = async function() {
    console.log('🔍 CMS Diagnostics');
    console.log('─'.repeat(50));
    
    const report = {
        contentStore: {
            state: window.contentStore?.state,
            hasContent: !!window.contentStore?.content,
            navigation: window.contentStore?.content?.navigation?.length || 0,
            liveProperties: window.contentStore?.content?.liveProperties?.length || 0,
        },
        estalaraAdmin: {
            initialized: !!window.estalaraAdmin,
            hasContent: !!window.estalaraAdmin?.content,
        },
        firebase: {
            ready: !!window.firebaseDb,
            connected: false,
        },
        localStorage: {
            available: !!window.ESTALARA_STORAGE_AVAILABLE,
            hasData: !!localStorage.getItem('estalaraAdminData'),
        },
        dom: {
            navigation: !!document.querySelector('nav ul'),
            propertiesGrid: !!document.querySelector('#live-properties .grid'),
            hero: !!document.querySelector('.hero'),
        }
    };
    
    // Test Firebase connection
    if (window.firebaseDb) {
        try {
            await window.firebaseDb.ref('.info/connected').once('value');
            report.firebase.connected = true;
        } catch (e) {
            report.firebase.error = e.message;
        }
    }
    
    console.table(report.contentStore);
    console.table(report.estalaraAdmin);
    console.table(report.firebase);
    console.table(report.localStorage);
    console.table(report.dom);
    
    console.log('─'.repeat(50));
    
    // Recommendations
    const issues = [];
    if (report.contentStore.state !== 'ready') {
        issues.push('ContentStore not ready');
    }
    if (report.contentStore.navigation === 0) {
        issues.push('No navigation items loaded');
    }
    if (report.contentStore.liveProperties === 0) {
        issues.push('No live properties loaded');
    }
    if (!report.firebase.connected && window.firebaseDb) {
        issues.push('Firebase not connected');
    }
    
    if (issues.length > 0) {
        console.warn('⚠️ Issues found:');
        issues.forEach(issue => console.warn(`  - ${issue}`));
        console.log('\n💡 Try: clearCMSCache() or forceRefreshFromCMS()');
    } else {
        console.log('✅ All systems operational');
    }
    
    return report;
};

console.log('✅ CMS Integration loaded (Refactored)');
