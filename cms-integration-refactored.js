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
        this.loadHowItWorks();
        this.loadHomeFeatures();
        this.loadAgentsFeatures();
        this.loadAboutContent();
        this.loadSectionHeadings();
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

        // Load social links with unified styling
        const socialContainer = footer.querySelector('.social-links');
        if (socialContainer && this.content.footer?.socialLinks) {
            socialContainer.innerHTML = this.content.footer.socialLinks.map(link => `
                <a href="${link.url}" target="_blank" rel="noopener" aria-label="${link.platform}" 
                   class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        ${this.getSocialIcon(link.icon)}
                    </svg>
                </a>
            `).join('');
        }

        // Update footer text with unified styling
        const footerText = footer.querySelector('#footer-text');
        if (footerText) {
            footerText.className = 'text-gray-400 text-sm';
        }

        // Load contact email with consistent styling
        const contactEmail = footer.querySelector('#contact-email');
        if (contactEmail && this.content.contactEmail) {
            contactEmail.textContent = this.content.contactEmail;
            contactEmail.className = 'text-gray-400 hover:text-white transition-colors';
        }
        
        // Ensure all footer links have consistent styling
        const footerLinks = footer.querySelectorAll('.footer-links a');
        footerLinks.forEach(link => {
            link.className = 'text-gray-400 hover:text-white transition-colors';
        });
    }
    
    /**
     * Get SVG icon for social platforms
     */
    getSocialIcon(platform) {
        const icons = {
            'linkedin': '<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>',
            'twitter': '<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>',
            'instagram': '<path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>',
            'facebook': '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>'
        };
        return icons[platform] || icons['linkedin'];
    }

    /**
     * Load hero section
     */
    loadHero() {
        const currentPage = this.getCurrentPage();
        
        // Get hero data for current page - support both old and new structure
        const pageData = this.content.pages?.[currentPage] || {};
        const hero = pageData.hero || {};
        
        const heroTitle = hero.title || pageData.heroTitle || this.content.heroTitle;
        const heroSubtitle = hero.subtitle || pageData.heroSubtitle || this.content.heroSubtitle;
        
        // CTA buttons - support both old single-button and new two-button structure
        const cta1Text = pageData.heroCta1Text || hero.ctaText;
        const cta1Url = pageData.heroCta1Link || hero.ctaUrl;
        const cta2Text = pageData.heroCta2Text;
        const cta2Url = pageData.heroCta2Link;

        // Title - Update Typed.js strings if it exists (HOME page only)
        const typedElement = document.querySelector('#typed-text');
        if (typedElement && typeof Typed !== 'undefined') {
            // Destroy existing typed instance if it exists
            if (window.typed && typeof window.typed.destroy === 'function') {
                window.typed.destroy();
            }
            
            // Create new typed instance with CMS content or default animation
            const animationStrings = heroTitle ? [heroTitle] : ['Go LIVE.', 'Go GLOBAL.', 'Go LIVE. Go GLOBAL.'];
            window.typed = new Typed('#typed-text', {
                strings: animationStrings,
                typeSpeed: 100,
                backSpeed: 50,
                backDelay: 2000,
                loop: true,
                showCursor: true,
                cursorChar: '|'
            });
        }

        // For non-home pages, update static hero title
        if (!typedElement && heroTitle) {
            const heroHeading = document.querySelector('section .hero-text');
            if (heroHeading) {
                heroHeading.innerHTML = heroTitle;
            }
        }

        // Subtitle - find in any hero section (paragraph after hero title)
        const heroSection = document.querySelector('section .hero-text');
        if (heroSection) {
            const subtitle = heroSection.parentElement.querySelector('.body-text');
            if (subtitle && heroSubtitle) {
                subtitle.textContent = heroSubtitle;
                // No need to set opacity - already fixed in HTML
            }
        }

        // CTA Buttons - find both primary and secondary buttons in hero section
        const heroContainerSection = document.querySelector('section[class*="min-h-screen"]');
        if (heroContainerSection) {
            const ctaButtons = heroContainerSection.querySelectorAll('.btn-primary a, .btn-secondary a');
            
            // Primary CTA Button (first button)
            if (ctaButtons.length >= 1 && cta1Text && cta1Url) {
                ctaButtons[0].textContent = cta1Text;
                ctaButtons[0].href = cta1Url;
            }
            
            // Secondary CTA Button (second button)
            if (ctaButtons.length >= 2 && cta2Text && cta2Url) {
                ctaButtons[1].textContent = cta2Text;
                ctaButtons[1].href = cta2Url;
            }
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
            <div class="property-card reveal overflow-hidden">
                <div class="relative">
                    <img src="${prop.image}" alt="${prop.title}" loading="lazy" class="w-full h-64 object-cover">
                    <span class="live-badge absolute top-4 left-4">LIVE</span>
                </div>
                <div class="p-6">
                    <h3 class="text-2xl font-bold mb-3 text-black">${prop.title}</h3>
                    <p class="text-gray-600 mb-2 flex items-center gap-2">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                        </svg>
                        ${prop.location}
                    </p>
                    <p class="text-3xl font-bold mb-4 text-black">${typeof prop.price === 'number' ? '€' + prop.price.toLocaleString() : (prop.price.startsWith('€') ? prop.price : '€' + prop.price)}</p>
                    <div class="flex gap-4 mb-4 text-gray-600 text-sm">
                        <span class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                            </svg>
                            ${prop.beds} beds
                        </span>
                        <span class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
                            </svg>
                            ${prop.baths} baths
                        </span>
                        <span class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
                            </svg>
                            ${prop.area}
                        </span>
                    </div>
                    <a href="${prop.link}" target="_blank" class="block w-full text-center bg-black text-white px-6 py-3 font-semibold hover:bg-gray-800 transition-colors">
                        View Property
                    </a>
                </div>
            </div>
        `).join('');

        // Trigger reveal animations if available
        if (window.observeReveals) {
            window.observeReveals(container.querySelectorAll('.reveal'));
        }
        
        // Initialize property card animations if available
        if (window.initPropertyCards) {
            window.initPropertyCards(container.querySelectorAll('.property-card'));
        }
    }

    /**
     * Load CTA buttons
     */
    loadButtons() {
        const headerBtn = document.querySelector('header .cta-button');
        if (headerBtn && this.content.pages?.home?.hero) {
            headerBtn.textContent = this.content.pages.home.hero.ctaText || 'Estalara Marketplace';
            headerBtn.href = this.content.pages.home.hero.ctaUrl || 'https://app.estalara.com';
        }
    }

    /**
     * Load "How It Works" section
     */
    loadHowItWorks() {
        const section = document.querySelector('#how-it-works');
        if (!section || !this.content.howItWorks) return;

        // Update section heading
        const heading = section.querySelector('.section-text, h2');
        if (heading && this.content.howItWorks.heading) {
            heading.textContent = this.content.howItWorks.heading;
        }

        // Update section subtitle
        const subtitle = section.querySelector('.body-text, p');
        if (subtitle && this.content.howItWorks.subtitle) {
            subtitle.textContent = this.content.howItWorks.subtitle;
        }

        // Update steps
        const stepsContainer = section.querySelector('.grid');
        if (stepsContainer && this.content.howItWorks.steps) {
            stepsContainer.innerHTML = this.content.howItWorks.steps.map(step => `
                <div class="text-center reveal card-hover p-8">
                    <div class="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">${step.number}</div>
                    <h3 class="text-2xl font-bold mb-4">${step.title}</h3>
                    <p class="text-gray-300">${step.description}</p>
                </div>
            `).join('');
        }
    }

    /**
     * Load homepage features
     */
    loadHomeFeatures() {
        // Only load on homepage
        if (window.location.pathname.includes('agents.html') || 
            window.location.pathname.includes('agencies.html') ||
            window.location.pathname.includes('investors.html') ||
            window.location.pathname.includes('about.html')) {
            return;
        }

        const section = document.querySelector('#features');
        if (!section || !this.content.features) return;

        const featuresGrid = section.querySelector('.features-grid, .grid');
        if (featuresGrid && this.content.features?.home) {
            featuresGrid.innerHTML = this.content.features.home.map(feature => `
                <div class="card-hover p-8 bg-white/5 rounded-lg reveal">
                    <div class="text-4xl mb-4">${feature.icon || '⭐'}</div>
                    <h3 class="text-2xl font-bold mb-4">${feature.title}</h3>
                    <p class="text-gray-300">${feature.description}</p>
                </div>
            `).join('');
        }
    }

    /**
     * Load Agents page features
     */
    loadAgentsFeatures() {
        const section = document.querySelector('#features');
        if (!section || !this.content.agentsFeatures) return;

        // Only load on agents.html
        if (!window.location.pathname.includes('agents.html')) return;

        const featuresGrid = section.querySelector('.grid');
        if (featuresGrid && this.content.agentsFeatures) {
            featuresGrid.innerHTML = this.content.agentsFeatures.map(feature => `
                <div class="feature-card p-8">
                    <div class="w-16 h-16 bg-black text-white rounded-lg flex items-center justify-center mb-6 text-2xl">${feature.icon}</div>
                    <h3 class="text-2xl font-bold mb-4">${feature.title}</h3>
                    <p class="text-gray-600 mb-6">${feature.description}</p>
                    <ul class="text-sm text-gray-500 space-y-2">
                        ${feature.bullets.map(bullet => `<li>• ${bullet}</li>`).join('')}
                    </ul>
                </div>
            `).join('');
        }
    }

    /**
     * Load About page content
     */
    loadAboutContent() {
        if (!window.location.pathname.includes('about.html')) return;
        if (!this.content.aboutContent) return;

        // Mission section
        const missionP1 = document.querySelector('#mission-p1');
        const missionP2 = document.querySelector('#mission-p2');
        if (missionP1 && this.content.aboutContent.mission) {
            missionP1.textContent = this.content.aboutContent.mission.p1;
        }
        if (missionP2 && this.content.aboutContent.mission) {
            missionP2.textContent = this.content.aboutContent.mission.p2;
        }

        // Vision section
        const visionP1 = document.querySelector('#vision-p1');
        const visionP2 = document.querySelector('#vision-p2');
        if (visionP1 && this.content.aboutContent.vision) {
            visionP1.textContent = this.content.aboutContent.vision.p1;
        }
        if (visionP2 && this.content.aboutContent.vision) {
            visionP2.textContent = this.content.aboutContent.vision.p2;
        }

        // What is Estalara section
        const whatIsContent = document.querySelector('#what-is-estalara-content');
        if (whatIsContent && this.content.aboutContent.whatIs) {
            whatIsContent.textContent = this.content.aboutContent.whatIs;
        }
    }

    /**
     * Load section headings across all pages
     */
    loadSectionHeadings() {
        if (!this.content.sectionHeadings) return;

        // Get current page
        const page = this.getCurrentPage();
        const pageHeadings = this.content.sectionHeadings?.[page];
        
        if (!pageHeadings) return;

        // Load section headings for current page
        Object.keys(pageHeadings).forEach(sectionId => {
            const section = pageHeadings[sectionId];
            
            // Update heading
            if (section.heading) {
                const headingEl = document.querySelector(`#${sectionId} .section-text, #${sectionId} h2`);
                if (headingEl) headingEl.textContent = section.heading;
            }
            
            // Update subtitle
            if (section.subtitle) {
                const subtitleEl = document.querySelector(`#${sectionId} .body-text, #${sectionId} p`);
                if (subtitleEl) subtitleEl.textContent = section.subtitle;
            }
        });
    }

    /**
     * Get current page identifier
     */
    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('agents.html')) return 'agents';
        if (path.includes('agencies.html')) return 'agencies';
        if (path.includes('investors.html')) return 'investors';
        if (path.includes('about.html')) return 'about';
        if (path.includes('faq.html')) return 'faq';
        return 'home';
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
