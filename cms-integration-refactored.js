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
        this.loadSuccessJourney();
        this.loadTestimonials();
        this.loadWhiteLabel();
        this.loadAgenciesLiveSelling();
        this.loadAgenciesEnterpriseFeatures();
        this.loadAboutContent();
        this.loadSectionHeadings();
        this.loadStatistics();
        this.loadLegalPages();
        this.loadLegalFooterLinks(); // Also load footer links on all pages
        this.loadFaq();
        this.loadPricing();
    }

    /**
     * Load navigation menu - optimized for fast display
     */
    loadNavigation() {
        if (!this.content.navigation) return;

        // Filter only visible navigation items (explicitly visible: true)
        const visibleNavItems = this.content.navigation.filter(item => item.visible === true);
        
        console.log('🔍 Navigation items:', this.content.navigation.length, 'total');
        console.log('👁️ Visible items:', visibleNavItems.length);
        this.content.navigation.forEach(item => {
            console.log(`   - ${item.label}: visible=${item.visible} (${item.visible === true ? 'SHOWN' : 'HIDDEN'})`);
        });

        // Load desktop navigation
        const desktopNav = document.querySelector('header nav:not(#mobile-menu) ul');
        if (desktopNav) {
            desktopNav.innerHTML = visibleNavItems.map(item => `
                <li><a href="${item.url}" class="text-white hover:text-gray-300 transition-colors">${item.label}</a></li>
            `).join('');
        }

        // Load mobile navigation
        const mobileNav = document.querySelector('#mobile-menu ul.mobile-nav');
        if (mobileNav) {
            mobileNav.innerHTML = visibleNavItems.map(item => `
                <li><a href="${item.url}" class="text-white hover:text-gray-300 transition-colors block py-2">${item.label}</a></li>
            `).join('');
        }
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
     * Load hero section - optimized for smooth sequential display
     */
    loadHero() {
        const currentPage = this.getCurrentPage();
        
        // Get hero data for current page - support both old and new structure
        const pageData = this.content.pages?.[currentPage] || {};
        const hero = pageData.hero || {};
        
        // Support both structures:
        // New: pages.home.hero.title
        // Old: pages.home.heroTitle
        const heroTitle = hero.title || pageData.heroTitle || this.content.heroTitle;
        const heroSubtitle = hero.subtitle || pageData.heroSubtitle || this.content.heroSubtitle;
        
        console.log(`🎯 Hero Load [${currentPage}]:`, {
            hasNewHero: !!hero.title,
            hasOldHero: !!pageData.heroTitle,
            usingTitle: heroTitle?.substring(0, 30) + '...',
            usingSubtitle: heroSubtitle?.substring(0, 50) + '...'
        });
        
        // CTA buttons - support both old single-button and new two-button structure
        const cta1Text = pageData.heroCta1Text || hero.ctaText;
        const cta1Url = pageData.heroCta1Link || hero.ctaUrl;
        const cta2Text = pageData.heroCta2Text;
        const cta2Url = pageData.heroCta2Link;

        // Subtitle - load immediately (shows first in the optimized sequence)
        const heroContainerSection = document.querySelector('section[class*="min-h-screen"]');
        if (heroContainerSection) {
            const subtitle = heroContainerSection.querySelector('.body-text');
            if (subtitle && heroSubtitle) {
                subtitle.textContent = heroSubtitle;
            }
        }

        // CTA Buttons - load immediately (show with subtitle)
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

        // Title - Update Typed.js ONLY if CMS explicitly provides typedStrings
        // This avoids re-initializing the animation on first load, eliminating stutter
        const typedElement = document.querySelector('#typed-text');
        const typedStringsFromCMS = (Array.isArray(hero.typedStrings) && hero.typedStrings.length > 0)
            ? hero.typedStrings
            : (Array.isArray(pageData.typedStrings) && pageData.typedStrings.length > 0)
                ? pageData.typedStrings
                : (Array.isArray(this.content.typedStrings) && this.content.typedStrings.length > 0)
                    ? this.content.typedStrings
                    : null;
        
        if (typedElement && typedStringsFromCMS) {
            const animationStrings = typedStringsFromCMS;
            const arraysEqual = (a, b) => Array.isArray(a) && Array.isArray(b) &&
                a.length === b.length && a.every((v, i) => v === b[i]);
            
            // Wait for main.js to create the typed instance, then update only if needed
            const updateTypedStrings = () => {
                if (typeof Typed === 'undefined') {
                    // Library not ready yet
                    return setTimeout(updateTypedStrings, 100);
                }
                
                // If instance exists and strings already match desired CMS strings, skip update
                if (window.typed && arraysEqual(window.typed.options?.strings || [], animationStrings)) {
                    return;
                }
                
                // Destroy previous instance if present, then create with CMS-provided strings
                if (window.typed && typeof window.typed.destroy === 'function') {
                    window.typed.destroy();
                }
                console.log('📝 CMS: Initializing Typed.js with CMS-provided strings');
                window.typed = new Typed('#typed-text', {
                    strings: animationStrings,
                    typeSpeed: 80,
                    backSpeed: 40,
                    backDelay: 2000,
                    loop: true,
                    showCursor: true,
                    cursorChar: '|',
                    startDelay: 0
                });
            };
            
            // Ensure main.js has initialized first to prevent race conditions
            setTimeout(updateTypedStrings, 1000);
        }

        // For non-home pages, update static hero title
        if (!typedElement && heroTitle) {
            const heroHeading = document.querySelector('section .hero-text');
            if (heroHeading) {
                heroHeading.innerHTML = heroTitle;
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
                    <p class="text-3xl font-bold mb-4 text-black">${typeof prop.price === 'number' ? '$' + prop.price.toLocaleString() : prop.price || '$0'}</p>
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
        if (!section) {
            console.warn('⚠️ How It Works: Section not found in DOM');
            return;
        }
        
        if (!this.content.howItWorks) {
            console.error('❌ How It Works: No data in content!');
            console.log('Content keys:', Object.keys(this.content));
            return;
        }

        console.log('✅ How It Works: Loading data...', {
            heading: this.content.howItWorks.heading,
            stepsCount: this.content.howItWorks.steps?.length || 0
        });

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

            // Re-register reveal animations for newly injected elements
            try {
                const newReveals = stepsContainer.querySelectorAll('.reveal');
                if (typeof window.observeReveals === 'function') {
                    window.observeReveals(newReveals);
                } else {
                    // Fallback: ensure visibility if observer isn't ready
                    newReveals.forEach(el => el.classList.add('active'));
                }

                // Re-init hover animations if helper exists
                if (typeof window.initPropertyCards === 'function') {
                    window.initPropertyCards(Array.from(stepsContainer.querySelectorAll('.card-hover')));
                }
            } catch (e) {
                console.warn('⚠️ How It Works: Failed to register animations for steps:', e);
            }

            console.log(`✅ How It Works: Loaded ${this.content.howItWorks.steps.length} steps`);
        } else {
            console.error('❌ How It Works: Steps container not found or no steps data');
        }
    }

    /**
     * Load homepage features
     */
    loadHomeFeatures() {
        console.log('🎯 [Features] loadHomeFeatures() called');
        console.log('📍 [Features] Current pathname:', window.location.pathname);
        
        // Only load on homepage
        if (window.location.pathname.includes('agents.html') || 
            window.location.pathname.includes('agencies.html') ||
            window.location.pathname.includes('investors.html') ||
            window.location.pathname.includes('about.html') ||
            window.location.pathname.includes('pricing.html')) {
            console.log('⏭️ [Features] Skipping - not on homepage');
            return;
        }

        const section = document.querySelector('#features');
        console.log('🔍 [Features] Section found:', !!section);
        console.log('🔍 [Features] this.content.features:', this.content.features);
        console.log('🔍 [Features] this.content.features?.home:', this.content.features?.home);
        
        if (!section) {
            console.error('❌ [Features] #features section not found in DOM');
            return;
        }
        
        if (!this.content.features) {
            console.error('❌ [Features] this.content.features is missing');
            return;
        }

        const featuresGrid = section.querySelector('.features-grid, .grid');
        console.log('🔍 [Features] Grid found:', !!featuresGrid);
        console.log('🔍 [Features] Is features.home an array?', Array.isArray(this.content.features?.home));
        console.log('🔍 [Features] features.home length:', this.content.features?.home?.length);
        
        if (featuresGrid && Array.isArray(this.content.features?.home)) {
            console.log('✅ [Features] Loading', this.content.features.home.length, 'feature cards');
            featuresGrid.innerHTML = this.content.features.home.map(feature => `
                <div class="card-hover p-8 bg-white/5 rounded-lg reveal feature-card">
                    <div class="text-4xl mb-4">${feature.icon || '⭐'}</div>
                    <h3 class="text-2xl font-bold mb-4">${feature.title}</h3>
                    <p class="text-gray-300">${feature.description}</p>
                </div>
            `).join('');

            // Re-register reveal animations and hover interactions for injected cards
            try {
                const newCards = featuresGrid.querySelectorAll('.feature-card.reveal, .card-hover.reveal');
                if (typeof window.observeReveals === 'function') {
                    window.observeReveals(Array.from(newCards));
                } else {
                    // Fallback: make them visible
                    Array.from(newCards).forEach(el => el.classList.add('active'));
                }
                console.log('✅ [Features] Animations initialized for', newCards.length, 'cards');
            } catch (e) {
                console.warn('⚠️ Features: Failed to initialize animations', e);
            }
        } else {
            console.error('❌ [Features] Failed to load - Grid:', !!featuresGrid, 'IsArray:', Array.isArray(this.content.features?.home));
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
     * Load Success Journey section on agents page
     */
    loadSuccessJourney() {
        // Only load on agents.html
        if (!window.location.pathname.includes('agents.html')) {
            return;
        }

        const section = document.querySelector('#success-journey');
        if (!section) {
            console.warn('⚠️ Success Journey: Section not found in DOM');
            return;
        }
        
        if (!this.content.pages?.agents?.successJourney) {
            console.error('❌ Success Journey: No data in content!');
            return;
        }

        const journey = this.content.pages.agents.successJourney;

        console.log('✅ Success Journey: Loading data...', {
            heading: journey.heading,
            stepsCount: journey.steps?.length || 0
        });

        // Update section heading
        const heading = section.querySelector('.section-text, h2');
        if (heading && journey.heading) {
            heading.textContent = journey.heading;
        }

        // Update section subtitle
        const subtitle = section.querySelector('.body-text, p');
        if (subtitle && journey.subtitle) {
            subtitle.textContent = journey.subtitle;
        }

        // Update steps
        const stepsContainer = section.querySelector('.grid');
        if (stepsContainer && journey.steps) {
            stepsContainer.innerHTML = journey.steps.map(step => `
                <div class="text-center">
                    <div class="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">${step.number}</div>
                    <h3 class="text-xl font-bold mb-4 text-black">${step.title}</h3>
                    <p class="text-gray-600">${step.description}</p>
                </div>
            `).join('');

            console.log(`✅ Success Journey: Loaded ${journey.steps.length} steps`);
        } else {
            console.error('❌ Success Journey: Steps container not found or no steps data');
        }
    }

    /**
     * Load testimonials section on agents page
     */
    loadTestimonials() {
        // Only load on agents.html
        if (!window.location.pathname.includes('agents.html')) {
            return;
        }

        const testimonialsSection = document.querySelector('section.py-32:has(.grid.md\\:grid-cols-3)');
        if (!testimonialsSection) {
            console.warn('⚠️ Testimonials: Section not found in DOM');
            return;
        }

        // Check if testimonials should be visible
        if (this.content.testimonials?.visible === false) {
            console.log('💬 Testimonials: Section is hidden via CMS');
            testimonialsSection.style.display = 'none';
            return;
        } else {
            testimonialsSection.style.display = 'block';
        }

        // Update section heading
        const heading = testimonialsSection.querySelector('.section-text, h2');
        if (heading && this.content.testimonials?.heading) {
            heading.textContent = this.content.testimonials.heading;
        }

        // Update section subtitle
        const subtitle = testimonialsSection.querySelector('.body-text, p');
        if (subtitle && this.content.testimonials?.subtitle) {
            subtitle.textContent = this.content.testimonials.subtitle;
        }

        // Load testimonial items
        const testimonialsGrid = testimonialsSection.querySelector('.grid.md\\:grid-cols-3');
        if (testimonialsGrid && this.content.testimonials?.items) {
            testimonialsGrid.innerHTML = this.content.testimonials.items.map(item => `
                <div class="bg-white text-black p-8">
                    <p class="text-lg mb-6 italic">"${item.quote}"</p>
                    <div class="flex items-center">
                        ${item.avatar ? 
                            `<img src="${item.avatar}" alt="${item.name}" class="w-12 h-12 rounded-full mr-4 object-cover">` :
                            `<div class="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>`
                        }
                        <div>
                            <p class="font-bold">${item.name}</p>
                            <p class="text-gray-600 text-sm">${item.location}</p>
                        </div>
                    </div>
                </div>
            `).join('');

            console.log(`✅ Testimonials: Loaded ${this.content.testimonials.items.length} testimonials`);
        }
    }

    /**
     * Load statistics section
     */
    loadStatistics() {
        // Load on agents.html, agencies.html, and about.html
        const isAgentsPage = window.location.pathname.includes('agents.html');
        const isAgenciesPage = window.location.pathname.includes('agencies.html');
        const isAboutPage = window.location.pathname.includes('about.html');
        
        if (!isAgentsPage && !isAgenciesPage && !isAboutPage) return;

        // Find statistics section - works on all three pages
        // agents.html: .py-20.bg-white.text-black
        // agencies.html: .py-20.bg-white.text-black
        // about.html: .py-32.bg-white.text-black
        const statsSection = document.querySelector('section.bg-white.text-black .grid.md\\:grid-cols-4');
        
        if (!statsSection) {
            console.warn('⚠️ Statistics: Section not found in DOM');
            return;
        }

        // Debug: Log content structure
        console.log('📊 Statistics: Content check:', {
            hasStatistics: !!this.content.statistics,
            isArray: Array.isArray(this.content.statistics),
            length: this.content.statistics?.length,
            data: this.content.statistics
        });

        // Only load if statistics exist in CMS
        if (!this.content.statistics || !Array.isArray(this.content.statistics) || this.content.statistics.length === 0) {
            console.log('📊 Statistics: No data in CMS - clearing section');
            console.log('💡 To add statistics, go to CMS (cms.html) and use the Statistics tab');
            statsSection.innerHTML = '';
            return;
        }

        // Load statistics from CMS
        const pageName = isAgentsPage ? 'agents.html' : isAgenciesPage ? 'agencies.html' : 'about.html';
        console.log('✅ Statistics: Loading', this.content.statistics.length, 'statistics on', pageName);
        
        statsSection.innerHTML = this.content.statistics.map(stat => `
            <div class="reveal">
                <div class="stat-number font-display text-black">${stat.number}</div>
                <p class="text-gray-600 font-semibold">${stat.label}</p>
            </div>
        `).join('');
        
        // Re-register reveal animations for newly injected elements
        try {
            const newReveals = statsSection.querySelectorAll('.reveal');
            if (typeof window.observeReveals === 'function') {
                window.observeReveals(newReveals);
            } else {
                // Fallback: ensure visibility if observer isn't ready
                newReveals.forEach(el => el.classList.add('active'));
            }
        } catch (e) {
            console.warn('⚠️ Statistics: Failed to register animations:', e);
        }
    }

    /**
     * Load legal pages content (all legal pages from CMS)
     */
    loadLegalPages() {
        // Load admin data
        const admin = JSON.parse(localStorage.getItem('estalaraAdminData') || '{}');
        if (!admin.legalPages) return;

        // Determine which legal page we're on
        let pageType = null;
        const pathname = window.location.pathname;
        
        // Map filenames to CMS page types
        const pageMap = {
            'privacy.html': 'privacy',
            'terms.html': 'termsofservice',
            'terms-conditions.html': 'terms',
            'gdpr.html': 'gdpr',
            'cookies-policy.html': 'cookies',
            'disclaimer.html': 'disclaimer',
            'streaming.html': 'streaming',
            'dpa.html': 'dpa'
        };
        
        // Find matching page type
        for (const [filename, type] of Object.entries(pageMap)) {
            if (pathname.includes(filename)) {
                pageType = type;
                break;
            }
        }

        if (!pageType || !admin.legalPages[pageType]) return;

        const pageData = admin.legalPages[pageType];

        // Apply title
        const titleEl = document.getElementById('legal-page-title');
        if (titleEl && pageData.title) {
            titleEl.textContent = pageData.title;
        }

        // Apply content from WYSIWYG editor
        const contentEl = document.getElementById('legal-page-content');
        if (contentEl && pageData.content) {
            contentEl.innerHTML = pageData.content;
        }
        
        // Load footer legal links
        this.loadLegalFooterLinks();
    }
    
    /**
     * Load legal links in footer dynamically from CMS
     */
    loadLegalFooterLinks() {
        const admin = JSON.parse(localStorage.getItem('estalaraAdminData') || '{}');
        if (!admin.legalPages) return;
        
        // Map of page types to their URLs and labels
        const legalPages = [
            { type: 'privacy', url: 'privacy.html', label: 'Privacy Policy' },
            { type: 'termsofservice', url: 'terms.html', label: 'Terms of Service' },
            { type: 'terms', url: 'terms-conditions.html', label: 'Terms & Conditions' },
            { type: 'gdpr', url: 'gdpr.html', label: 'GDPR' },
            { type: 'cookies', url: 'cookies-policy.html', label: 'Cookies Policy' },
            { type: 'disclaimer', url: 'disclaimer.html', label: 'International Disclaimer' },
            { type: 'streaming', url: 'streaming.html', label: 'Live Streaming Consent' },
            { type: 'dpa', url: 'dpa.html', label: 'Data Processing Agreement' }
        ];
        
        // Filter visible pages
        const visiblePages = legalPages.filter(page => {
            const pageData = admin.legalPages[page.type];
            return pageData && pageData.visible !== false;
        });
        
        // Update all footer legal links containers
        const footerLinksContainers = document.querySelectorAll('.footer-links');
        footerLinksContainers.forEach(container => {
            const currentPath = window.location.pathname;
            container.innerHTML = visiblePages.map(page => {
                const isActive = currentPath.includes(page.url);
                const className = isActive 
                    ? 'text-white font-semibold' 
                    : 'text-gray-400 hover:text-white transition-colors';
                return `<li><a href="${page.url}" class="${className}">${page.label}</a></li>`;
            }).join('');
        });
    }

    /**
     * Load White Label section (Agencies page)
     */
    loadWhiteLabel() {
        // Only load on agencies.html
        if (!window.location.pathname.includes('agencies.html')) return;
        if (!this.content.whiteLabel) return;

        console.log('✅ White Label: Loading content...');

        // Update title
        const titleEl = document.querySelector('#agency-white-label-title');
        if (titleEl && this.content.whiteLabel.title) {
            titleEl.textContent = this.content.whiteLabel.title;
        }

        // Update subtitle
        const subtitleEl = document.querySelector('#agency-white-label-subtitle');
        if (subtitleEl && this.content.whiteLabel.subtitle) {
            subtitleEl.textContent = this.content.whiteLabel.subtitle;
        }

        // Update benefits section
        const benefitsTitleEl = document.querySelector('#agency-white-label-benefits-title');
        if (benefitsTitleEl && this.content.whiteLabel.benefitsTitle) {
            benefitsTitleEl.textContent = this.content.whiteLabel.benefitsTitle;
        }

        const benefitsListEl = document.querySelector('#agency-white-label-benefits-list');
        if (benefitsListEl && this.content.whiteLabel.benefits) {
            benefitsListEl.innerHTML = this.content.whiteLabel.benefits
                .map(benefit => `<li>${benefit}</li>`)
                .join('');
        }

        // Update why section
        const whyTitleEl = document.querySelector('#agency-white-label-why-title');
        if (whyTitleEl && this.content.whiteLabel.whyTitle) {
            whyTitleEl.textContent = this.content.whiteLabel.whyTitle;
        }

        const whyListEl = document.querySelector('#agency-white-label-why-list');
        if (whyListEl && this.content.whiteLabel.whyReasons) {
            whyListEl.innerHTML = this.content.whiteLabel.whyReasons
                .map(reason => `<li>${reason}</li>`)
                .join('');
        }

        // Update contact section
        const contactLabelEl = document.querySelector('#agency-white-label-contact-label');
        if (contactLabelEl && this.content.whiteLabel.contactLabel) {
            contactLabelEl.textContent = this.content.whiteLabel.contactLabel;
        }

        const contactEmailEl = document.querySelector('#agency-white-label-contact-email');
        if (contactEmailEl && this.content.whiteLabel.contactEmail) {
            contactEmailEl.innerHTML = `<a href="mailto:${this.content.whiteLabel.contactEmail}" class="hover:underline">${this.content.whiteLabel.contactEmail}</a>`;
        }

        console.log('✅ White Label: Content loaded successfully');
    }

    /**
     * Load Live Selling section (Agencies page)
     */
    loadAgenciesLiveSelling() {
        // Only load on agencies.html
        if (!window.location.pathname.includes('agencies.html')) return;
        
        const pageData = this.content.pages?.agencies;
        if (!pageData) return;

        console.log('✅ Agencies Sections: Loading content...');

        // Load Section 1 (Live Selling)
        const section1Title = pageData.section1Title || pageData.liveSellingSection?.title;
        const section1Content = pageData.section1Content || pageData.liveSellingSection?.content;
        const section1Icon = pageData.section1Icon || pageData.liveSellingSection?.icon;
        const section1Image = pageData.section1Image || pageData.liveSellingSection?.image;

        if (section1Title) {
            const titleEl = document.querySelector('#agency-section1-title');
            if (titleEl) titleEl.textContent = section1Title;
        }

        if (section1Content) {
            const contentEl = document.querySelector('#agency-section1-content');
            if (contentEl) contentEl.textContent = section1Content;
        }

        if (section1Icon) {
            const iconEl = document.querySelector('#agency-section1-icon');
            if (iconEl) {
                iconEl.textContent = section1Icon;
                iconEl.style.display = 'block';
            }
        }

        if (section1Image) {
            const imageEl = document.querySelector('#agency-section1-image');
            if (imageEl) {
                imageEl.src = section1Image;
                imageEl.style.display = 'block';
            }
        }

        // Load Section 2 (Social Media)
        if (pageData.section2Title) {
            const titleEl = document.querySelector('#agency-section2-title');
            if (titleEl) titleEl.textContent = pageData.section2Title;
        }

        if (pageData.section2Content) {
            const contentEl = document.querySelector('#agency-section2-content');
            if (contentEl) contentEl.textContent = pageData.section2Content;
        }

        if (pageData.section2Icon) {
            const iconEl = document.querySelector('#agency-section2-icon');
            if (iconEl) {
                iconEl.textContent = pageData.section2Icon;
                iconEl.style.display = 'block';
            }
        }

        if (pageData.section2Image) {
            const imageEl = document.querySelector('#agency-section2-image');
            if (imageEl) {
                imageEl.src = pageData.section2Image;
                imageEl.style.display = 'block';
            }
        }

        // Load Section 3 (Estalara Advantage)
        if (pageData.section3Title) {
            const titleEl = document.querySelector('#agency-section3-title');
            if (titleEl) titleEl.textContent = pageData.section3Title;
        }

        if (pageData.section3Content) {
            const contentEl = document.querySelector('#agency-section3-content');
            if (contentEl) contentEl.textContent = pageData.section3Content;
        }

        if (pageData.section3Icon) {
            const iconEl = document.querySelector('#agency-section3-icon');
            if (iconEl) {
                iconEl.textContent = pageData.section3Icon;
                iconEl.style.display = 'block';
            }
        }

        if (pageData.section3Image) {
            const imageEl = document.querySelector('#agency-section3-image');
            if (imageEl) {
                imageEl.src = pageData.section3Image;
                imageEl.style.display = 'block';
            }
        }

        console.log('✅ Agencies Sections: All content loaded successfully');
    }

    /**
     * Load Enterprise Features section (Agencies page)
     */
    loadAgenciesEnterpriseFeatures() {
        // Only load on agencies.html
        if (!window.location.pathname.includes('agencies.html')) return;
        
        const pageData = this.content.pages?.agencies;
        
        console.log('🔍 [Enterprise Features] Debug:', {
            hasPages: !!this.content.pages,
            hasAgencies: !!this.content.pages?.agencies,
            hasEnterpriseSection: !!pageData?.enterpriseFeaturesSection,
            featuresCount: pageData?.enterpriseFeaturesSection?.features?.length || 0
        });
        
        if (!pageData?.enterpriseFeaturesSection) {
            console.error('❌ Enterprise Features: No data found in this.content.pages.agencies.enterpriseFeaturesSection');
            return;
        }

        console.log('✅ Agencies Enterprise Features: Loading content...');

        const section = pageData.enterpriseFeaturesSection;
        const sectionEl = document.querySelector('#enterprise-features');
        
        if (!sectionEl) {
            console.warn('⚠️ Enterprise Features: Section not found in DOM');
            return;
        }

        // Update heading
        const headingEl = sectionEl.querySelector('.section-text');
        if (headingEl && section.heading) {
            headingEl.textContent = section.heading;
        }

        // Update subtitle
        const subtitleEl = sectionEl.querySelector('.body-text');
        if (subtitleEl && section.subtitle) {
            subtitleEl.textContent = section.subtitle;
        }

        // Update feature cards
        if (section.features && Array.isArray(section.features)) {
            const featuresContainer = sectionEl.querySelector('.grid');
            
            console.log('🔍 [Enterprise Features] Container check:', {
                sectionFound: !!sectionEl,
                gridFound: !!featuresContainer,
                featuresArray: Array.isArray(section.features),
                featuresLength: section.features.length
            });
            
            if (featuresContainer) {
                featuresContainer.innerHTML = section.features.map(feature => `
                    <div class="feature-card p-8 reveal">
                        <div class="w-16 h-16 bg-black text-white rounded-lg flex items-center justify-center mb-6 text-2xl">${feature.icon}</div>
                        <h3 class="text-2xl font-bold mb-4">${feature.title}</h3>
                        <p class="text-gray-600 mb-6">${feature.description}</p>
                        <ul class="text-sm text-gray-500 space-y-2">
                            ${feature.benefits.map(benefit => `<li>• ${benefit}</li>`).join('')}
                        </ul>
                    </div>
                `).join('');
                
                // Re-register reveal animations for newly injected feature cards
                try {
                    const newCards = featuresContainer.querySelectorAll('.feature-card.reveal');
                    if (typeof window.observeReveals === 'function') {
                        window.observeReveals(newCards);
                    } else {
                        // Fallback: ensure visibility if observer isn't ready
                        newCards.forEach(el => el.classList.add('active'));
                    }
                    console.log(`✅ Agencies Enterprise Features: Loaded ${section.features.length} feature cards with animations`);
                } catch (e) {
                    console.warn('⚠️ Agencies Enterprise Features: Failed to register animations:', e);
                }
            }
        }

        console.log('✅ Agencies Enterprise Features: Content loaded successfully');
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
     * Load FAQ section
     */
    loadFaq() {
        // Only load on FAQ page
        if (!window.location.pathname.includes('faq.html')) return;
        
        const admin = JSON.parse(localStorage.getItem('estalaraAdminData') || '{}');
        if (!admin.faq) return;

        console.log('✅ FAQ: Loading content...');

        // Load each category
        const categories = {
            'general': 'general-questions',
            'agents': 'for-agents',
            'investors': 'for-investors',
            'technical': 'technical-support'
        };

        Object.keys(categories).forEach(categoryKey => {
            const sectionId = categories[categoryKey];
            const section = document.querySelector(`#${sectionId}`);
            
            if (!section || !admin.faq[categoryKey]) return;

            const items = admin.faq[categoryKey];
            
            // Find the container for FAQ items (after the h2)
            const heading = section.querySelector('h2');
            if (!heading) return;

            // Remove old FAQ items (everything after h2)
            let nextElement = heading.nextElementSibling;
            while (nextElement) {
                const toRemove = nextElement;
                nextElement = nextElement.nextElementSibling;
                toRemove.remove();
            }

            // Add new FAQ items
            items.forEach(item => {
                if (item.question && item.answer) {
                    const faqItem = document.createElement('div');
                    faqItem.className = 'faq-item';
                    faqItem.innerHTML = `
                        <h3 class="faq-question">${item.question}</h3>
                        <p class="faq-answer">${item.answer}</p>
                    `;
                    section.appendChild(faqItem);
                }
            });

            console.log(`✅ FAQ: Loaded ${items.length} items for ${categoryKey}`);
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

    /**
     * PAGE STRUCTURE MANAGEMENT METHODS
     * These methods allow CMS to save and manage page structures
     */

    /**
     * Get page structure for editing in CMS
     */
    getPageStructure(pageId) {
        // If structure exists in content, return it
        if (this.content.pageStructures && this.content.pageStructures[pageId]) {
            return [...this.content.pageStructures[pageId]];
        }
        
        // Otherwise return default structure for this page
        const defaultStructures = {
            home: [
                { id: 'hero', type: 'hero', title: 'Hero Section', visible: true, order: 1, editable: false },
                { id: 'how-it-works', type: 'section', title: 'How It Works', visible: true, order: 2, editable: true },
                { id: 'live-properties', type: 'section', title: 'LIVE Properties', visible: true, order: 3, editable: false },
                { id: 'features', type: 'section', title: 'Features', visible: true, order: 4, editable: true },
                { id: 'cta', type: 'section', title: 'CTA Section', visible: true, order: 5, editable: true }
            ],
            agents: [
                { id: 'hero', type: 'hero', title: 'Hero Section', visible: true, order: 1, editable: false },
                { id: 'stats', type: 'section', title: 'Stats Section', visible: true, order: 2, editable: true },
                { id: 'features', type: 'section', title: 'Features Section', visible: true, order: 3, editable: true },
                { id: 'how-it-works', type: 'section', title: 'How It Works', visible: true, order: 4, editable: true },
                { id: 'testimonials', type: 'section', title: 'Testimonials', visible: true, order: 5, editable: true },
                { id: 'cta', type: 'section', title: 'CTA Section', visible: true, order: 6, editable: true }
            ],
            investors: [
                { id: 'hero', type: 'hero', title: 'Hero Section', visible: true, order: 1, editable: false },
                { id: 'investing-without-borders', type: 'section', title: 'Investing Without Borders', visible: true, order: 2, editable: true },
                { id: 'stats', type: 'section', title: 'Investment Stats', visible: true, order: 3, editable: true }
            ],
            agencies: [
                { id: 'hero', type: 'hero', title: 'Hero Section', visible: true, order: 1, editable: false },
                { id: 'agency-live-selling', type: 'section', title: 'Live Selling & Social Media', visible: true, order: 2, editable: true },
                { id: 'agency-white-label-offer', type: 'section', title: 'White Label Offer', visible: true, order: 3, editable: true },
                { id: 'stats', type: 'section', title: 'Enterprise Stats', visible: true, order: 4, editable: true },
                { id: 'enterprise-features', type: 'section', title: 'Enterprise Features', visible: true, order: 5, editable: true }
            ],
            about: [
                { id: 'hero', type: 'hero', title: 'Hero Section', visible: true, order: 1, editable: false },
                { id: 'about-content', type: 'section', title: 'About Content', visible: true, order: 2, editable: true }
            ],
            pricing: [
                { id: 'hero', type: 'hero', title: 'Hero Section', visible: true, order: 1, editable: false },
                { id: 'pricing', type: 'section', title: 'Pricing Cards', visible: true, order: 2, editable: true },
                { id: 'how-it-works', type: 'section', title: 'How It Works', visible: true, order: 3, editable: true },
                { id: 'value-proposition', type: 'section', title: 'Value Proposition', visible: true, order: 4, editable: true },
                { id: 'faq', type: 'section', title: 'FAQ Section', visible: true, order: 5, editable: true },
                { id: 'cta', type: 'section', title: 'CTA Section', visible: true, order: 6, editable: true }
            ],
            faq: [
                { id: 'hero', type: 'hero', title: 'Hero Section', visible: true, order: 1, editable: false },
                { id: 'faq-content', type: 'section', title: 'FAQ Content', visible: true, order: 2, editable: true }
            ]
        };
        
        return defaultStructures[pageId] || [];
    }

    /**
     * Update page structure and save to Firebase + localStorage
     */
    async updatePageStructure(pageId, structure) {
        // Initialize pageStructures if it doesn't exist
        if (!this.content.pageStructures) {
            this.content.pageStructures = {};
        }
        
        // Update the structure
        this.content.pageStructures[pageId] = structure;
        
        // Save to ContentStore (which saves to both Firebase and localStorage)
        await window.contentStore.saveContent(this.content);
        
        console.log(`✅ Page structure updated for: ${pageId}`);
        
        // Reload current page if we're on it
        const path = window.location.pathname;
        if ((pageId === 'home' && (path.includes('index.html') || path === '/')) ||
            path.includes(`${pageId}.html`)) {
            this.applyPageStructure(pageId);
        }
    }

    /**
     * Toggle section visibility
     */
    async toggleSectionVisibility(pageId, sectionId) {
        const structure = this.getPageStructure(pageId);
        const section = structure.find(s => s.id === sectionId);
        
        if (section) {
            section.visible = !section.visible;
            await this.updatePageStructure(pageId, structure);
            console.log(`✅ Toggled visibility for section: ${sectionId} on page: ${pageId}`);
        }
    }

    /**
     * Add new section to page
     */
    async addSection(pageId, sectionData) {
        const structure = this.getPageStructure(pageId);
        const newSection = {
            id: sectionData.id || `section-${Date.now()}`,
            type: sectionData.type || 'section',
            title: sectionData.title || 'New Section',
            visible: true,
            order: structure.length + 1,
            editable: true,
            ...sectionData
        };
        
        structure.push(newSection);
        await this.updatePageStructure(pageId, structure);
        
        console.log(`✅ Added section: ${newSection.id} to page: ${pageId}`);
        return newSection;
    }

    /**
     * Remove section from page
     */
    async removeSection(pageId, sectionId) {
        let structure = this.getPageStructure(pageId);
        structure = structure.filter(s => s.id !== sectionId);
        
        // Reorder remaining sections
        structure.forEach((s, index) => {
            s.order = index + 1;
        });
        
        await this.updatePageStructure(pageId, structure);
        console.log(`✅ Removed section: ${sectionId} from page: ${pageId}`);
    }

    /**
     * Apply page structure (hide/show sections based on visibility)
     */
    applyPageStructure(pageId) {
        const structure = this.getPageStructure(pageId);
        
        if (!structure || !Array.isArray(structure)) {
            console.warn(`⚠️ No structure found for pageId: ${pageId}`);
            return;
        }
        
        structure.forEach(section => {
            const element = document.getElementById(section.id);
            if (element) {
                if (section.visible) {
                    element.style.display = '';
                } else {
                    element.style.display = 'none';
                }
            }
        });
        
        console.log(`✅ Applied page structure for: ${pageId}`);
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

        // Initialize immediately without waiting for main.js
        // This ensures navigation and content load as fast as possible
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

/**
 * Load Pricing Page Content
 */
EstalaraAdmin.prototype.loadPricing = function() {
    // Only load on pricing page
    if (!window.location.pathname.includes('pricing.html')) return;
    
    console.log('💰 Loading pricing page content...');
    
    // Get pricing data or fallback to defaults
    const pricing = this.content.pages?.pricing || {};
    const defaults = window.contentStore?.defaults?.pages?.pricing || {};
    
    // Merge with defaults to ensure we always have data
    const pricingData = {
        pricingSection: pricing.pricingSection || defaults.pricingSection || {},
        pricingCards: pricing.pricingCards && pricing.pricingCards.length > 0 ? pricing.pricingCards : (defaults.pricingCards || []),
        howItWorks: pricing.howItWorks || defaults.howItWorks || {},
        valueProposition: pricing.valueProposition || defaults.valueProposition || {},
        faq: pricing.faq || defaults.faq || {},
        cta: pricing.cta || defaults.cta || {}
    };
    
    console.log('💰 Pricing data:', {
        hasPricingSection: !!pricingData.pricingSection.heading,
        cardsCount: pricingData.pricingCards.length,
        hasHowItWorks: !!pricingData.howItWorks.heading,
        hasValueProp: !!pricingData.valueProposition.heading,
        hasFaq: !!pricingData.faq.heading,
        hasCta: !!pricingData.cta.heading
    });
    
    // Load Pricing Section Heading
    const heading = document.querySelector('#pricing .section-text');
    const subtitle = document.querySelector('#pricing .body-text');
    if (heading) heading.innerHTML = pricingData.pricingSection.heading || 'Choose What Works for You';
    if (subtitle) subtitle.textContent = pricingData.pricingSection.subtitle || 'Performance-based pricing designed for real estate professionals';
    
    // Load Pricing Cards
    const cardsContainer = document.querySelector('#pricing .grid.md\\:grid-cols-3');
    if (cardsContainer && pricingData.pricingCards.length > 0) {
        cardsContainer.innerHTML = pricingData.pricingCards.map(card => `
            <div class="pricing-card ${card.featured ? 'featured' : ''} p-8 reveal">
                <div class="mb-6">
                    <h3 class="text-2xl font-bold mb-2">${card.title}</h3>
                    <p class="text-gray-600 text-sm">${card.subtitle}</p>
                </div>
                <div class="mb-8">
                    <div class="price-large text-black">${card.price}</div>
                    <p class="text-gray-600 mt-2">${card.priceDetail}</p>
                </div>
                <div class="space-y-4 mb-8">
                    ${card.features.map(feature => `
                        <div class="flex items-start gap-3">
                            <span class="feature-check">✓</span>
                            <span class="text-gray-700">${feature}</span>
                        </div>
                    `).join('')}
                </div>
                <button class="w-full bg-black text-white py-3 font-semibold hover:bg-gray-800 transition-colors">
                    <a href="${card.buttonUrl}" target="_blank">${card.buttonText}</a>
                </button>
            </div>
        `).join('');
        
        // Re-register reveal animations for newly injected pricing cards
        try {
            const newCards = cardsContainer.querySelectorAll('.pricing-card.reveal');
            if (typeof window.observeReveals === 'function') {
                window.observeReveals(newCards);
            } else {
                // Fallback: ensure visibility if observer isn't ready
                newCards.forEach(el => el.classList.add('active'));
            }
        } catch (e) {
            console.warn('⚠️ Pricing Cards: Failed to register animations:', e);
        }
        
        console.log(`✅ Loaded ${pricingData.pricingCards.length} pricing cards`);
    } else {
        console.warn('⚠️ No pricing cards to display');
    }
    
    // Load How It Works Section (Pricing specific)
    const hiwSection = document.querySelectorAll('section')[2]; // Third section is How It Works
    if (hiwSection && pricingData.howItWorks.heading) {
        const heading = hiwSection.querySelector('.section-text');
        const subtitle = hiwSection.querySelector('.body-text');
        if (heading) heading.textContent = pricingData.howItWorks.heading || 'How Pricing Works';
        if (subtitle) subtitle.textContent = pricingData.howItWorks.subtitle || 'Transparent and performance-based';
        
        const stepsContainer = hiwSection.querySelector('.grid');
        if (stepsContainer && pricingData.howItWorks.steps && pricingData.howItWorks.steps.length > 0) {
            stepsContainer.innerHTML = pricingData.howItWorks.steps.map(step => `
                <div class="text-center reveal">
                    <div class="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                        ${step.icon}
                    </div>
                    <h3 class="text-2xl font-bold mb-4">${step.title}</h3>
                    <p class="text-gray-300">${step.description}</p>
                </div>
            `).join('');
            
            // Re-register reveal animations for newly injected steps
            try {
                const newReveals = stepsContainer.querySelectorAll('.reveal');
                if (typeof window.observeReveals === 'function') {
                    window.observeReveals(newReveals);
                } else {
                    // Fallback: ensure visibility if observer isn't ready
                    newReveals.forEach(el => el.classList.add('active'));
                }
            } catch (e) {
                console.warn('⚠️ Pricing How It Works: Failed to register animations:', e);
            }
            
            console.log(`✅ Loaded How It Works with ${pricingData.howItWorks.steps.length} steps`);
        }
    }
    
    // Load Value Proposition
    const vpSection = document.querySelectorAll('section')[3]; // Fourth section
    if (vpSection && pricingData.valueProposition.heading) {
        const heading = vpSection.querySelector('.section-text');
        const subtitle = vpSection.querySelector('.body-text');
        if (heading) heading.textContent = pricingData.valueProposition.heading || 'Why Our Pricing Makes Sense';
        if (subtitle) subtitle.textContent = pricingData.valueProposition.subtitle || 'We succeed when you succeed';
        
        const pointsContainer = vpSection.querySelector('.grid');
        if (pointsContainer && pricingData.valueProposition.points && pricingData.valueProposition.points.length > 0) {
            pointsContainer.innerHTML = pricingData.valueProposition.points.map(point => `
                <div class="reveal">
                    <h3 class="text-3xl font-bold mb-6">${point.title}</h3>
                    ${point.content.map(para => `
                        <p class="text-gray-600 text-lg mb-6">${para}</p>
                    `).join('')}
                </div>
            `).join('');
            
            // Re-register reveal animations for newly injected value proposition points
            try {
                const newReveals = pointsContainer.querySelectorAll('.reveal');
                if (typeof window.observeReveals === 'function') {
                    window.observeReveals(newReveals);
                } else {
                    // Fallback: ensure visibility if observer isn't ready
                    newReveals.forEach(el => el.classList.add('active'));
                }
            } catch (e) {
                console.warn('⚠️ Value Proposition: Failed to register animations:', e);
            }
            
            console.log(`✅ Loaded Value Proposition with ${pricingData.valueProposition.points.length} points`);
        }
    }
    
    // Load FAQ
    const faqSection = document.querySelectorAll('section')[4]; // Fifth section
    if (faqSection && pricingData.faq.heading) {
        const heading = faqSection.querySelector('.section-text');
        const subtitle = faqSection.querySelector('.body-text');
        if (heading) heading.textContent = pricingData.faq.heading || 'Common Questions';
        if (subtitle) subtitle.textContent = pricingData.faq.subtitle || 'Everything you need to know';
        
        const faqContainer = faqSection.querySelector('.space-y-8');
        if (faqContainer && pricingData.faq.questions && pricingData.faq.questions.length > 0) {
            faqContainer.innerHTML = pricingData.faq.questions.map(q => `
                <div class="bg-white text-black p-8 reveal">
                    <h3 class="text-xl font-bold mb-4">${q.question}</h3>
                    <p class="text-gray-600">${q.answer}</p>
                </div>
            `).join('');
            
            // Re-register reveal animations for newly injected FAQ items
            try {
                const newReveals = faqContainer.querySelectorAll('.reveal');
                if (typeof window.observeReveals === 'function') {
                    window.observeReveals(newReveals);
                } else {
                    // Fallback: ensure visibility if observer isn't ready
                    newReveals.forEach(el => el.classList.add('active'));
                }
            } catch (e) {
                console.warn('⚠️ FAQ: Failed to register animations:', e);
            }
            
            console.log(`✅ Loaded FAQ with ${pricingData.faq.questions.length} questions`);
        }
    }
    
    // Load CTA Section
    const ctaSection = document.querySelectorAll('section')[5]; // Sixth section
    if (ctaSection && pricingData.cta.heading) {
        const heading = ctaSection.querySelector('.section-text');
        const subtitle = ctaSection.querySelector('.body-text');
        const button = ctaSection.querySelector('button a');
        
        if (heading) heading.textContent = pricingData.cta.heading || 'Ready to Get Started?';
        if (subtitle) subtitle.textContent = pricingData.cta.subtitle || 'Join thousands of agents...';
        if (button) {
            button.textContent = pricingData.cta.buttonText || 'Create Free Account →';
            button.href = pricingData.cta.buttonUrl || 'https://app.estalara.com';
        }
        console.log('✅ Loaded CTA section');
    }
    
    console.log('✅ Pricing page content fully loaded from', pricing.pricingCards ? 'CMS data' : 'defaults');
};

console.log('✅ CMS Integration loaded (Refactored)');
