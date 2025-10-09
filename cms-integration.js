// Estalara Admin Integration
// This file handles dynamic content loading from Admin panel

class EstalaraAdmin {
    constructor() {
        this.content = this.loadContent();
        this.init();
    }

    init() {
        this.loadDynamicContent();
        this.setupEventListeners();
    }

    // Load content from localStorage (simulating Admin database)
    loadContent() {
        const defaultContent = {
            siteTitle: "Estalara - Go LIVE. Go GLOBAL.",
            siteDescription: "Estalara connects real estate agents and international investors through AI and live experiences. Simplify global property transactions with confidence.",
            contactEmail: "estalara@estalara.com",
            // Default hero content used on the homepage when no page specific overrides exist
            heroTitle: "Go LIVE. Go GLOBAL.",
            heroSubtitle: "Estalara connects real estate agents and global investors through AI and live experiences. Go LIVE. Go GLOBAL. Close deals faster than ever before.",
            // Seed example properties. In a production system this would be fetched from a backend.
            properties: [
                {
                    id: 1,
                    title: "Modern Apartment in Cádiz",
                    location: "Cádiz, Spain",
                    price: 450000,
                    image: "https://kimi-web-img.moonshot.cn/img/talatiandpartners.com/952038c4e2cdd1b53bd4fa58a12aa8472e239da8.webp",
                    description: "Stunning property in the heart of Cádiz with ocean views and modern amenities.",
                    link: "https://app.estalara.com/listing/-cadiz-cadiz-na-d19331b5-846d-4139-a78e-2d9695ff73d0",
                    status: "live"
                },
                {
                    id: 2,
                    title: "Luxury Penthouse in Madrid",
                    location: "Madrid, Spain",
                    price: 1200000,
                    image: "https://kimi-web-img.moonshot.cn/img/www.valcucine.com/23a9f04943354e7f0279fbe99bcc358000b108f4.jpg",
                    description: "Exclusive penthouse in Madrid's premium district with panoramic city views.",
                    link: "https://app.estalara.com/listing/-madrid-madrid-na-8a9b2c1d-4e5f-6a7b-8c9d-0e1f2a3b4c5d",
                    status: "live"
                },
                {
                    id: 3,
                    title: "Beachfront Villa in Barcelona",
                    location: "Barcelona, Spain",
                    price: 2800000,
                    image: "https://kimi-web-img.moonshot.cn/img/antonovich-design.com/c4dc761e62d99ae8976671614b35f23c72bda4df.jpg",
                    description: "Spectacular beachfront villa with private pool and direct beach access.",
                    link: "https://app.estalara.com/listing/-barcelona-barcelona-na-5f6e7d8c-9a0b-1c2d-3e4f-5a6b7c8d9e0f",
                    status: "live"
                },
                {
                    id: 4,
                    title: "Historic Building in Valencia",
                    location: "Valencia, Spain",
                    price: 750000,
                    image: "https://kimi-web-img.moonshot.cn/img/www.elegantinterior.info/c0b1fd32f4cdc3abdaccf6a5f411e8f3fb8e6e92.png",
                    description: "Beautifully restored historic building in Valencia's old town with modern interiors.",
                    link: "https://app.estalara.com/listing/-valencia-valencia-na-2a3b4c5d-6e7f-8a9b-0c1d-2e3f4a5b6c7d",
                    status: "live"
                },
                {
                    id: 5,
                    title: "Traditional House in Seville",
                    location: "Seville, Spain",
                    price: 320000,
                    image: "https://kimi-web-img.moonshot.cn/img/idea.3dbrute.com/eaa4c4cbb5ccbf57f4732305104dd9187d2276a4.jpg",
                    description: "Authentic Andalusian house with patio, perfect for cultural immersion.",
                    link: "https://app.estalara.com/listing/-seville-seville-na-9c8d7e6f-5a4b-3c2d-1e0f-9a8b7c6d5e4f",
                    status: "live"
                },
                {
                    id: 6,
                    title: "Modern Villa in Malaga",
                    location: "Malaga, Spain",
                    price: 1850000,
                    image: "https://kimi-web-img.moonshot.cn/img/archello.s3.eu-central-1.amazonaws.com/e68f5c11f478a0669779d5422a04c826a028dca0.jpg",
                    description: "Contemporary villa with stunning sea views and infinity pool in Costa del Sol.",
                    link: "https://app.estalara.com/listing/-malaga-malaga-na-7d6e5f4a-3b2c-1d0e-9f8a-7b6c5d4e3f2a",
                    status: "live"
                }
            ],
            // Define page specific overrides for titles and subtitles. Without this key
            // `loadPageContent` would attempt to read undefined values and throw errors.
            pages: {
                home: {
                    heroTitle: "Go LIVE. Go GLOBAL.",
                    heroSubtitle: "Estalara connects real estate agents and global investors through AI and live experiences. Go LIVE. Go GLOBAL. Close deals faster than ever before."
                },
                agents: {
                    heroTitle: "Agents Go <span class=\"text-white\">GLOBAL</span>",
                    heroSubtitle: "Attract and convert high‑value global investors effortlessly. Livestream your listings and engage verified buyers in real time with AI‑powered lead generation and automatic landing pages."
                },
                investors: {
                    heroTitle: "Invest <span class=\"text-white\">WORLDWIDE</span>",
                    heroSubtitle: "Discover and fund exceptional real estate opportunities across borders. Access exclusive properties streamed live and make informed decisions with real‑time data."
                }
            },
            settings: {
                currency: "EUR",
                language: "en"
            }
        };

        // Load from localStorage or use defaults
        const stored = localStorage.getItem('estalaraAdminData');
        // If saved data exists, parse it; otherwise start from defaults
        const loaded = stored ? JSON.parse(stored) : defaultContent;
        // Ensure the pages key exists to prevent undefined access. Merge with defaults so
        // any missing keys are populated on upgrade.
        loaded.pages = loaded.pages || {};
        // Ensure properties exist; if not, seed with defaults. Without this
        // the site will render no LIVE Properties when first loaded or after
        // localStorage corruption.
        if (!Array.isArray(loaded.properties) || loaded.properties.length === 0) {
            loaded.properties = Array.isArray(defaultContent.properties) ? [...defaultContent.properties] : [];
        }
        // Only fill in missing page definitions, don't overwrite customised ones
        if (defaultContent.pages) {
            for (const key of Object.keys(defaultContent.pages)) {
                if (!loaded.pages[key]) {
                    loaded.pages[key] = defaultContent.pages[key];
                }
            }
        }
        return loaded;
    }

    // Save content to localStorage
    saveContent() {
        localStorage.setItem('estalaraAdminData', JSON.stringify(this.content));
    }

    // Load dynamic content into the website
    loadDynamicContent() {
        // Update site title
        document.title = this.content.siteTitle;
        
        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', this.content.siteDescription);
        }

        // Update contact email
        const contactEmail = document.getElementById('contact-email');
        if (contactEmail) {
            contactEmail.textContent = this.content.contactEmail;
        }

        // Load properties if on home page
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            this.loadProperties();
        }

        // Load page-specific content
        this.loadPageContent();
    }

    // Load properties into the LIVE Properties section
    loadProperties() {
        const propertiesContainer = document.querySelector('#live-properties .grid');
        if (!propertiesContainer) return;

        // Guard against empty or undefined property lists. If no live properties are available
        // we leave any existing markup in place so the page never renders blank.
        const liveProperties = (this.content && Array.isArray(this.content.properties))
            ? this.content.properties.filter(p => !p.status || p.status === 'live')
            : [];

        // If there are no live properties simply exit and retain fallback markup
        if (liveProperties.length === 0) {
            return;
        }

        // Clear existing properties and add each live property. When injecting cards after the
        // page has already been initialised by main.js the IntersectionObserver and hover
        // listeners defined there will not automatically apply to our new elements. To ensure
        // the cards are visible immediately we add the 'active' class and attach hover
        // animations here as well. See main.js for the original implementations.
        propertiesContainer.innerHTML = '';
        // Collect references to the newly created cards so we can initialise
        // reveal and animation behaviours using functions exposed by main.js
        const newCards = [];
        liveProperties.forEach((property, index) => {
            const propertyCard = this.createPropertyCard(property);
            // Stagger delay similar to main.js for consistent animations
            propertyCard.style.animationDelay = `${index * 0.1}s`;
            propertiesContainer.appendChild(propertyCard);
            newCards.push(propertyCard);
        });

        // Register new reveal elements with the global IntersectionObserver (if available)
        if (typeof window.observeReveals === 'function') {
            window.observeReveals(newCards);
        } else {
            // If reveal observer isn't available, immediately activate cards
            newCards.forEach(card => card.classList.add('active'));
        }

        // Initialise hover animations using the global helper
        if (typeof window.initPropertyCards === 'function') {
            window.initPropertyCards(newCards);
        }
    }

    // Create a property card element
    createPropertyCard(property) {
        const card = document.createElement('div');
        card.className = 'property-card p-6 reveal';
        card.innerHTML = `
            <div class="mb-4">
                <img src="${property.image}"
                     alt="${property.title}"
                     loading="lazy"
                     class="w-full h-48 object-cover mb-4">
                <div class="flex justify-between items-start">
                    <span class="live-badge">LIVE</span>
                    <span class="text-sm text-gray-500">${property.location}</span>
                </div>
            </div>
            <h3 class="text-xl font-bold mb-2">${property.title}</h3>
            <p class="text-gray-600 mb-4">${property.description}</p>
            <div class="flex justify-between items-center">
                <span class="font-bold text-lg">€${property.price.toLocaleString()}</span>
                <a href="${property.link}"
                   target="_blank"
                   class="bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors">
                    View Property →
                </a>
            </div>
        `;
        return card;
    }

    // Load page-specific content
    loadPageContent() {
        const path = window.location.pathname;
        let pageKey = 'home';

        if (path.includes('agents.html')) {
            pageKey = 'agents';
        } else if (path.includes('investors.html')) {
            pageKey = 'investors';
        }

        const page = this.content.pages[pageKey];
        if (!page) return;

        // Update hero title and subtitle. Each page can override these via the
        // pages configuration. Fallback to the global heroTitle and heroSubtitle
        // defined on this.content if no override exists.
        const titleEl = document.querySelector('.hero-text');
        const subtitleEls = document.querySelectorAll('.body-text');
        // Use page specific heroTitle if available; otherwise default
        const heroTitle = page.heroTitle || this.content.heroTitle;
        const heroSubtitle = page.heroSubtitle || this.content.heroSubtitle;

        // For the home page we rely on the typed.js animation and the default subtitle
        // defined in the HTML. Only override the hero content for other pages.
        if (pageKey !== 'home') {
            if (titleEl && heroTitle) {
                // Use innerHTML because heroTitle may contain markup (e.g. span for colouring)
                titleEl.innerHTML = heroTitle;
            }
            if (subtitleEls.length > 0 && heroSubtitle) {
                // Update only the first body-text, which corresponds to the hero subtitle
                subtitleEls[0].textContent = heroSubtitle;
            }
        }
    }

    // Add a new property
    addProperty(propertyData) {
        const newProperty = {
            id: Date.now(),
            ...propertyData,
            status: 'live'
        };

        this.content.properties.push(newProperty);
        this.saveContent();
        
        // Reload properties if on home page
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            this.loadProperties();
        }

        return newProperty;
    }

    // Update an existing property
    updateProperty(id, propertyData) {
        const index = this.content.properties.findIndex(p => p.id === id);
        if (index !== -1) {
            this.content.properties[index] = { ...this.content.properties[index], ...propertyData };
            this.saveContent();
            
            // Reload properties if on home page
            if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
                this.loadProperties();
            }
        }
    }

    // Delete a property
    deleteProperty(id) {
        this.content.properties = this.content.properties.filter(p => p.id !== id);
        this.saveContent();
        
        // Reload properties if on home page
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            this.loadProperties();
        }
    }

    // Update site settings
    updateSettings(settings) {
        this.content.settings = { ...this.content.settings, ...settings };
        this.saveContent();
    }

    // Update page content
    updatePage(pageId, content) {
        if (this.content.pages[pageId]) {
            this.content.pages[pageId].content = { ...this.content.pages[pageId].content, ...content };
            this.saveContent();
        }
    }

    // Setup event listeners for CMS functionality
    setupEventListeners() {
        // Listen for storage events (for multi-tab synchronization)
        window.addEventListener('storage', (e) => {
            if (e.key === 'estalaraAdminData') {
                this.content = this.loadContent();
                this.loadDynamicContent();
            }
        });

        // Listen for admin updates from admin panel
        window.addEventListener('message', (e) => {
            if (e.data.type === 'adminUpdate') {
                this.handleAdminUpdate(e.data);
            }
        });
    }

    // Handle admin updates from admin panel
    handleAdminUpdate(data) {
        switch (data.action) {
            case 'addProperty':
                this.addProperty(data.property);
                break;
            case 'updateProperty':
                this.updateProperty(data.id, data.property);
                break;
            case 'deleteProperty':
                this.deleteProperty(data.id);
                break;
            case 'updateSettings':
                this.updateSettings(data.settings);
                break;
            case 'updatePage':
                this.updatePage(data.pageId, data.content);
                break;
        }
    }

    // Get all properties
    getProperties() {
        return this.content.properties;
    }

    // Get property by ID
    getProperty(id) {
        return this.content.properties.find(p => p.id === id);
    }

    // Get all pages
    getPages() {
        return this.content.pages;
    }

    // Get page by ID
    getPage(pageId) {
        return this.content.pages[pageId];
    }

    // Get settings
    getSettings() {
        return this.content.settings;
    }
}

// Initialize Admin when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.estalaraAdmin = new EstalaraAdmin();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EstalaraAdmin;
}