// Estalara Admin Integration
// This file handles dynamic content loading from Admin panel

// Test localStorage availability immediately (for incognito mode detection)
(function testLocalStorage() {
    try {
        if (typeof localStorage === 'undefined') {
            console.warn('⚠️ [Mobile Fix] localStorage is undefined - running in restricted mode');
            window.ESTALARA_STORAGE_AVAILABLE = false;
            return;
        }
        
        // Test if we can actually write to localStorage (incognito mode check)
        const testKey = '__estalara_storage_test__';
        localStorage.setItem(testKey, '1');
        localStorage.removeItem(testKey);
        
        console.log('✅ [Mobile Debug] localStorage is available and writable');
        window.ESTALARA_STORAGE_AVAILABLE = true;
    } catch (e) {
        console.warn('⚠️ [Mobile Fix] localStorage is blocked (incognito mode?):', e.message);
        window.ESTALARA_STORAGE_AVAILABLE = false;
    }
})();

class EstalaraAdmin {
    constructor() {
        console.log('🚀 [Mobile Debug] EstalaraAdmin initializing...');
        console.log('   - Storage available:', window.ESTALARA_STORAGE_AVAILABLE);
        console.log('   - User Agent:', navigator.userAgent);
        console.log('   - Viewport:', window.innerWidth + 'x' + window.innerHeight);
        
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
logoUrl: "assets/EstalaraLogo.png",            // Default hero content used on the homepage when no page specific overrides exist
            heroTitle: "Go LIVE. Go GLOBAL.",
            heroSubtitle: "Estalara connects real estate agents and global investors through AI and live experiences. Go LIVE. Go GLOBAL. Close deals faster than ever before.",
            // Seed example properties. In a production system this would be fetched from a backend.
            // Version number for the CMS data structure. Increment this whenever
            // you make breaking changes to the default content shape or when you
            // want to force clients to reload default content after a major
            // upgrade. When the stored data has an older version, the
            // application will discard it and fall back to these defaults.
            version: 4,
            // NEW: liveProperties - simplified property management for LIVE Properties section
            liveProperties: [
                {
                    id: 1,
                    title: "Modern Apartment in Cádiz",
                    location: "Cádiz, Spain",
                    price: 450000,
                    image: "https://kimi-web-img.moonshot.cn/img/talatiandpartners.com/952038c4e2cdd1b53bd4fa58a12aa8472e239da8.webp",
                    description: "Stunning property in the heart of Cádiz with ocean views and modern amenities.",
                    link: "https://app.estalara.com/listing/-cadiz-cadiz-na-d19331b5-846d-4139-a78e-2d9695ff73d0"
                },
                {
                    id: 2,
                    title: "Luxury Penthouse in Madrid",
                    location: "Madrid, Spain",
                    price: 1200000,
                    image: "https://kimi-web-img.moonshot.cn/img/www.valcucine.com/23a9f04943354e7f0279fbe99bcc358000b108f4.jpg",
                    description: "Exclusive penthouse in Madrid's premium district with panoramic city views.",
                    link: "https://app.estalara.com/listing/-madrid-madrid-na-8a9b2c1d-4e5f-6a7b-8c9d-0e1f2a3b4c5d"
                },
                {
                    id: 3,
                    title: "Beachfront Villa in Barcelona",
                    location: "Barcelona, Spain",
                    price: 2800000,
                    image: "https://kimi-web-img.moonshot.cn/img/antonovich-design.com/c4dc761e62d99ae8976671614b35f23c72bda4df.jpg",
                    description: "Spectacular beachfront villa with private pool and direct beach access.",
                    link: "https://app.estalara.com/listing/-barcelona-barcelona-na-5f6e7d8c-9a0b-1c2d-3e4f-5a6b7c8d9e0f"
                },
                {
                    id: 4,
                    title: "Historic Building in Valencia",
                    location: "Valencia, Spain",
                    price: 750000,
                    image: "https://kimi-web-img.moonshot.cn/img/www.elegantinterior.info/c0b1fd32f4cdc3abdaccf6a5f411e8f3fb8e6e92.png",
                    description: "Beautifully restored historic building in Valencia's old town with modern interiors.",
                    link: "https://app.estalara.com/listing/-valencia-valencia-na-2a3b4c5d-6e7f-8a9b-0c1d-2e3f4a5b6c7d"
                },
                {
                    id: 5,
                    title: "Traditional House in Seville",
                    location: "Seville, Spain",
                    price: 320000,
                    image: "https://kimi-web-img.moonshot.cn/img/idea.3dbrute.com/eaa4c4cbb5ccbf57f4732305104dd9187d2276a4.jpg",
                    description: "Authentic Andalusian house with patio, perfect for cultural immersion.",
                    link: "https://app.estalara.com/listing/-seville-seville-na-9c8d7e6f-5a4b-3c2d-1e0f-9a8b7c6d5e4f"
                },
                {
                    id: 6,
                    title: "Modern Villa in Malaga",
                    location: "Malaga, Spain",
                    price: 1850000,
                    image: "https://kimi-web-img.moonshot.cn/img/archello.s3.eu-central-1.amazonaws.com/e68f5c11f478a0669779d5422a04c826a028dca0.jpg",
                    description: "Contemporary villa with stunning sea views and infinity pool in Costa del Sol.",
                    link: "https://app.estalara.com/listing/-malaga-malaga-na-7d6e5f4a-3b2c-1d0e-9f8a-7b6c5d4e3f2a"
                }
            ],
            // OLD: properties array (DEPRECATED - kept for backward compatibility)
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
                    heroSubtitle: "Estalara connects real estate agents and global investors through AI and live experiences. Go LIVE. Go GLOBAL. Close deals faster than ever before.",
                    // How It Works section
                    howItWorksTitle: "How It Works",
                    howItWorksSubtitle: "Three simple steps to revolutionize your real estate experience",
                    // Features section
                    featuresTitle: "Powerful Features",
                    featuresSubtitle: "Advanced technology designed for modern real estate professionals",
                    // CTA section
                    ctaTitle: "Join the Future of Global Real Estate",
                    ctaSubtitle: "Whether you're an agent looking to expand globally or an investor seeking international opportunities, Estalara provides the platform you need to succeed."
                },
                agents: {
                    heroTitle: "Agents Go <span class=\"text-white\">GLOBAL</span>",
                    heroSubtitle: "Attract and convert high‑value global investors effortlessly. Livestream your listings and engage verified buyers in real time with AI‑powered lead generation and automatic landing pages."
                },
                investors: {
                    heroTitle: "Invest <span class=\"text-white\">WORLDWIDE</span>",
                    heroSubtitle: "Discover and fund exceptional real estate opportunities across borders. Access exclusive properties streamed live and make informed decisions with real‑time data.",
                    // Section 1 – investing without borders
                    section1Title: "Investing without borders",
                    section1Content: "The world is your marketplace. Estalara lets you browse, evaluate and purchase properties around the globe from wherever you are. Live tours and remote closings make you feel like you’re there and build trust through authentic video. Our network of verified agents and local experts ensures safety and transparency in every transaction.",
                    section1Icon: "🌍",
                    section1Image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=60",
                    // Section 2 – challenges of international investing and solutions
                    section2Title: "Challenges of international investment & how we solve them",
                    section2Content: "Buying property abroad can be daunting. Each country has its own laws, taxes and financing rules; exchange rates and political risk affect your returns; language barriers and long‑distance management add complexity; and scams are a constant risk. Estalara solves these problems by connecting you with local lawyers, tax advisers and mortgage partners, offering real‑time currency conversion and escrow services, verifying properties and sellers, and providing bilingual support so you always have a trusted guide.",
                    section2Icon: "⚠️",
                    section2Image: "https://images.unsplash.com/photo-1518593921361-3e3d8f8e2b38?auto=format&fit=crop&w=800&q=60",
                    // Section 3 – support and trust
                    section3Title: "Support you can trust",
                    section3Content: "Our team is available 24/7 to help you navigate legal, financial and cultural barriers. We provide multilingual assistance, due diligence and verified listings to protect you from scams. With Estalara, you invest with confidence, knowing you have expert support every step of the way.",
                    section3Icon: "🤝",
                    section3Image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=60"
                },
                // Added page definition for agencies. Without this key the agencies page
                // would fallback to the default hero and subtitle defined on the home page.
                about: {
                    heroTitle: "About <span class=\"text-white\">ESTALARA</span>",
                    heroSubtitle: "We're revolutionizing global real estate by connecting agents and investors through AI and live experiences. Our mission is to make international property transactions simple, transparent, and accessible to everyone."
                },
                agencies: {
                    heroTitle: "Agencies Go <span class=\"text-white\">ENTERPRISE</span>",
                    heroSubtitle: "Grow your agency through live selling and social media. Manage multiple agents, broadcast tours and expand internationally with our enterprise solutions.",
                    // Section 1 – benefits of live commerce and authentic video
                    section1Title: "Live selling meets social media",
                    section1Content: "Live tours and real‑time interaction build trust. Modern buyers spend hours researching homes online, and authentic livestreams let them ask questions and feel the space before they visit. Short vertical clips on TikTok, Instagram and YouTube are becoming the new search engine for property discovery. When you broadcast real tours and behind‑the‑scenes insights, you attract clients who are ready to buy.",
                    section1Icon: "🎥",
                    section1Image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60",
                    // Section 2 – social media as a lead engine
                    section2Title: "Social media as your lead engine",
                    section2Content: "More than half of agents say social media is their most important source of high‑quality leads. Platforms like Facebook, Instagram and LinkedIn let you target specific buyers, showcase your expertise and build community. Post useful information and local tips instead of just listings, and use clear keywords so your bio and captions show up when buyers search. Pair live streams with targeted ads and automated follow‑ups to turn viewers into clients.",
                    section2Icon: "📱",
                    section2Image: "https://images.unsplash.com/photo-1485211391954-35ef7f3cfc52?auto=format&fit=crop&w=800&q=60",
                    // Section 3 – Estalara advantage
                    section3Title: "Why Estalara for agencies?",
                    section3Content: "Estalara brings live selling and social platforms together in one streamlined system. Our enterprise platform helps you manage multiple agents, schedule live property tours and capture leads from comments. Built‑in analytics and automated workflows free your team to focus on clients. With support for more than 50 countries and multiple languages, you can market properties to buyers worldwide and grow your brand without limits.",
                    section3Icon: "🚀",
                    section3Image: "https://images.unsplash.com/photo-1523958203904-cdcb402031fd?auto=format&fit=crop&w=800&q=60",
                    // White-label section
                    whiteLabelTitle: "Idol Brands — White label for real estate agencies",
                    whiteLabelSubtitle: "We offer dedicated white label implementations — your brand, our technology. Launch a complete live commerce and social video platform under your agency's branding: on your own domain, with custom visual identity and configuration tailored to your sales processes.",
                    whiteLabelBenefitsTitle: "What you get",
                    whiteLabelBenefitsList: [
                        "Your own branding: logo, colors, domain/subdomain",
                        "Branded livestreams and short‑videos — without exposure of our brand",
                        "Agent and manager panels with permissions",
                        "CRM/MLS integrations and Single Sign‑On (SSO)"
                    ],
                    whiteLabelWhyTitle: "Why it works",
                    whiteLabelWhyList: [
                        "Greater customer trust through consistent branding",
                        "Faster implementations and feature roadmap tailored to your needs",
                        "SLA, training and Enterprise support",
                        "Security and compliance (GDPR), scalable infrastructure"
                    ],
                    whiteLabelContactLabel: "Enterprise Cooperation",
                    whiteLabelContactEmail: "peter@estalara.com"
                },
                faq: {
                    pageTitle: "Frequently Asked Questions",
                    pageSubtitle: "Find answers to common questions about Estalara's global real estate platform.",
                    ctaTitle: "Still have questions?",
                    ctaText: "Our team is here to help you navigate global real estate with confidence."
                },
                privacy: {
                    pageTitle: "Privacy Policy",
                    effectiveDate: "October 10, 2025",
                    lastUpdated: "October 10, 2025",
                    companyName: "Time2Show, Inc.",
                    companyAddress: "Dover, DE, USA",
                    contactEmail: "privacy@estalara.com"
                },
                terms: {
                    pageTitle: "Terms of Service",
                    effectiveDate: "October 10, 2025",
                    lastUpdated: "October 10, 2025",
                    companyName: "Time2Show, Inc.",
                    companyAddress: "Dover, DE, USA",
                    legalEmail: "legal@estalara.com",
                    contactEmail: "estalara@estalara.com"
                }
            },
            settings: {
                currency: "EUR",
                language: "en"
            },
            // Text used in the site footer. Can be customised via the admin panel.
            footerText: "© 2025 Estalara. All rights reserved.",
            // Translation dictionary. Each language can override page and section content. Initially empty for English.
            translations: {
                en: {}
            },
            // Page structures defining blocks/sections for each page
            pageStructures: {
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
                faq: [
                    { id: 'hero', type: 'hero', title: 'Hero Section', visible: true, order: 1, editable: false },
                    { id: 'general-questions', type: 'section', title: 'General Questions', visible: true, order: 2, editable: true },
                    { id: 'for-agents', type: 'section', title: 'For Agents', visible: true, order: 3, editable: true },
                    { id: 'for-investors', type: 'section', title: 'For Investors', visible: true, order: 4, editable: true },
                    { id: 'technical-support', type: 'section', title: 'Technical & Support', visible: true, order: 5, editable: true },
                    { id: 'cta', type: 'section', title: 'CTA Section', visible: true, order: 6, editable: true }
                ],
                privacy: [
                    { id: 'hero', type: 'hero', title: 'Hero Section', visible: true, order: 1, editable: false },
                    { id: 'privacy-content', type: 'section', title: 'Privacy Content', visible: true, order: 2, editable: true }
                ],
                terms: [
                    { id: 'hero', type: 'hero', title: 'Hero Section', visible: true, order: 1, editable: false },
                    { id: 'terms-content', type: 'section', title: 'Terms Content', visible: true, order: 2, editable: true }
                ]
            }
        };

        // Load from localStorage or fall back to defaults. Include versioning to
        // ensure that breaking changes or major updates to the default content
        // automatically override old stored data. If the stored content lacks a
        // version or has an older version than the default, we discard it.
        
        // FIX 4: Safe localStorage access with fallback for mobile devices
        const storedRaw = (() => {
            try {
                if (typeof localStorage === 'undefined') {
                    console.warn('⚠️ [Mobile Fix] localStorage not available');
                    return null;
                }
                return localStorage.getItem('estalaraAdminData');
            } catch (e) {
                console.error('❌ [Mobile Fix] localStorage error:', e);
                return null;
            }
        })();
        let loaded;
        if (storedRaw) {
            try {
                const parsed = JSON.parse(storedRaw);
                // If no version or an older version is stored, reset to defaults
                if (!parsed.version || parsed.version < defaultContent.version) {
                    loaded = { ...defaultContent };
                } else {
                    loaded = parsed;
                }
            } catch (e) {
                // If parsing fails, fall back to defaults
                loaded = { ...defaultContent };
            }
        } else {
            loaded = { ...defaultContent };
        }

        // Ensure the pages key exists to prevent undefined access. Merge with
        // defaults so any missing keys are populated on upgrade without
        // overwriting customised content.
        loaded.pages = loaded.pages || {};
        if (defaultContent.pages) {
            for (const key of Object.keys(defaultContent.pages)) {
                if (!loaded.pages[key]) {
                    loaded.pages[key] = defaultContent.pages[key];
                }
            }
        }

        // Ensure properties exist; if not, seed with defaults. Without this the
        // site will render no LIVE Properties when first loaded or after
        // localStorage corruption.
        if (!Array.isArray(loaded.properties) || loaded.properties.length === 0) {
            loaded.properties = Array.isArray(defaultContent.properties)
                ? [...defaultContent.properties]
                : [];
        }

        // NEW: Migrate old properties to liveProperties if liveProperties doesn't exist
        // This ensures backward compatibility with existing data
        if (!Array.isArray(loaded.liveProperties) || loaded.liveProperties.length === 0) {
            if (Array.isArray(loaded.properties) && loaded.properties.length > 0) {
                // Copy properties to liveProperties, removing 'type' and 'status' fields
                loaded.liveProperties = loaded.properties.map(prop => ({
                    id: prop.id,
                    title: prop.title,
                    location: prop.location,
                    price: prop.price,
                    description: prop.description,
                    image: prop.image,
                    link: prop.link || 'https://app.estalara.com'
                }));
                console.log('✅ Migrated', loaded.liveProperties.length, 'properties to liveProperties');
            } else {
                // Use defaults if no properties exist
                loaded.liveProperties = Array.isArray(defaultContent.liveProperties)
                    ? [...defaultContent.liveProperties]
                    : [];
            }
        }

        // Ensure pageStructures exist; if not, seed with defaults
        if (!loaded.pageStructures || typeof loaded.pageStructures !== 'object') {
            loaded.pageStructures = defaultContent.pageStructures || {};
        } else {
            // Merge with defaults to add any new pages
            for (const pageKey of Object.keys(defaultContent.pageStructures || {})) {
                if (!loaded.pageStructures[pageKey]) {
                    loaded.pageStructures[pageKey] = defaultContent.pageStructures[pageKey];
                }
            }
        }

        // Always set the version to the current default version to allow future
        // migrations to detect outdated data. Save back to localStorage in case
        // defaults were used or the version was updated.
        loaded.version = defaultContent.version;
        
        // FIX: Safe localStorage write with fallback for incognito mode
        if (window.ESTALARA_STORAGE_AVAILABLE) {
            try {
                localStorage.setItem('estalaraAdminData', JSON.stringify(loaded));
                console.log('✅ [Mobile Debug] Content saved to localStorage');
            } catch (e) {
                console.error('❌ [Mobile Fix] localStorage.setItem failed:', e.message);
                // In incognito mode, continue with in-memory content only
            }
        } else {
            console.warn('⚠️ [Mobile Fix] Skipping localStorage save (not available)');
        }
        
        return loaded;
    }

    // Save content to localStorage
    saveContent() {
        if (window.ESTALARA_STORAGE_AVAILABLE) {
            try {
                localStorage.setItem('estalaraAdminData', JSON.stringify(this.content));
            } catch (e) {
                console.error('❌ [Mobile Fix] saveContent failed:', e.message);
                // Continue silently - in incognito mode saves are not persisted
            }
        } else {
            console.warn('⚠️ [Mobile Fix] Skipping save (storage not available)');
        }
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

        // Update logo if logoUrl is set
        if (this.content.logoUrl) {
            this.updateLogo(this.content.logoUrl);
        }

        // Load properties if on home page
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            this.loadProperties();
        }

        // Load page-specific content
        this.loadPageContent();

        // Update footer text if element exists
        const footerEl = document.getElementById('footer-text');
        if (footerEl && this.content.footerText) {
            footerEl.textContent = this.content.footerText;
        }

        // Apply page structure (hide/show sections based on visibility settings)
        const path = window.location.pathname;
        let pageKey = 'home';
        if (path.includes('agents.html')) {
            pageKey = 'agents';
        } else if (path.includes('investors.html')) {
            pageKey = 'investors';
        } else if (path.includes('agencies.html')) {
            pageKey = 'agencies';
        } else if (path.includes('about.html')) {
            pageKey = 'about';
        }
        this.applyPageStructure(pageKey);
    }

    // Update logo on all pages
    updateLogo(logoUrl) {
        try {
            if (!logoUrl) {
                console.warn('⚠️ updateLogo called with empty logoUrl');
                return;
            }
            
            // Handle URL encoding - only encode spaces in relative paths, preserve slashes
            let finalUrl = logoUrl;
            if (!logoUrl.startsWith('data:') && 
                !logoUrl.startsWith('http://') && 
                !logoUrl.startsWith('https://') && 
                logoUrl.includes(' ')) {
                // Only replace spaces, don't encode slashes
                finalUrl = logoUrl.replace(/ /g, '%20');
            }
            
            console.log('🔄 Updating logo to:', finalUrl);
            
            // Find all logo images - use specific selector for ESTALARA logos
            const logoImages = document.querySelectorAll('img[alt="ESTALARA"]');
            
            console.log('📸 Found', logoImages.length, 'logo elements with alt="ESTALARA"');
            
            if (logoImages.length > 0) {
                logoImages.forEach((img, index) => {
                    const oldSrc = img.src;
                    img.src = finalUrl;
                    console.log(`✅ Logo ${index + 1} updated:`, oldSrc, '→', img.src);
                });
            } else {
                // Fallback: search for any image in header/footer that has 'logo' in src
                console.warn('⚠️ No logos with alt="ESTALARA" found, trying fallback search...');
                const fallbackImages = document.querySelectorAll('header img, footer img, nav img');
                let updated = 0;
                fallbackImages.forEach((img) => {
                    if (img.src.includes('logo')) {
                        const oldSrc = img.src;
                        img.src = finalUrl;
                        console.log(`✅ Logo (fallback) updated:`, oldSrc, '→', img.src);
                        updated++;
                    }
                });
                if (updated === 0) {
                    console.error('❌ No logo elements found on page!');
                }
            }
        } catch (e) {
            console.error('❌ [Mobile Fix] updateLogo failed:', e);
        }
    }

    // Load properties into the LIVE Properties section
    loadProperties() {
        // FIX 3: Retry mechanism for container (mobile devices may need extra time)
        const loadWithRetry = (retries = 3, delay = 100) => {
            console.log(`🔍 [Mobile Debug] loadProperties attempt (${4 - retries}/3)`);
            
            const propertiesContainer = document.querySelector('#live-properties .grid');
            
            if (!propertiesContainer) {
                if (retries > 0) {
                    console.warn(`⚠️ [Mobile Fix] Container not found, retrying in ${delay}ms... (${retries} attempts left)`);
                    setTimeout(() => loadWithRetry(retries - 1, delay), delay);
                    return;
                } else {
                    console.error('❌ [Mobile Fix] Container not found after 3 retries!');
                    return;
                }
            }
            
            console.log('✅ [Mobile Debug] Container found:', propertiesContainer);

            // NEW: Use liveProperties array (managed in CMS) instead of old properties array
            // Fall back to old properties array if liveProperties doesn't exist yet (for backward compatibility)
            const liveProperties = (this.content && Array.isArray(this.content.liveProperties) && this.content.liveProperties.length > 0)
                ? this.content.liveProperties
                : (this.content && Array.isArray(this.content.properties))
                    ? this.content.properties.filter(p => !p.status || p.status === 'live')
                    : [];
            
            console.log('🔍 [Mobile Debug] liveProperties count:', liveProperties.length);
            console.log('🔍 [Mobile Debug] this.content:', this.content);

            // Always clear existing properties first to remove any hardcoded HTML
            propertiesContainer.innerHTML = '';

            // If there are no live properties, show a message
            if (liveProperties.length === 0) {
                console.warn('⚠️ [Mobile Debug] No liveProperties available');
                propertiesContainer.innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <p class="text-gray-500 text-lg">No properties available at the moment.</p>
                        <p class="text-gray-400 text-sm mt-2">Check back soon for new listings!</p>
                    </div>
                `;
                return;
            }

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
            
            console.log('✅ [Mobile Debug] Created', newCards.length, 'property cards');

            // FIX 2: Enhanced fallback for reveal animation (mobile-friendly)
            // Check if IntersectionObserver exists AND if our wrapper function is available
            const hasIntersectionObserver = 'IntersectionObserver' in window;
            const hasObserveFunction = typeof window.observeReveals === 'function';
            
            if (hasIntersectionObserver && hasObserveFunction && window.revealObserver) {
                console.log('✅ [Mobile Debug] Using IntersectionObserver for reveals');
                try {
                    window.observeReveals(newCards);
                } catch (e) {
                    console.error('❌ [Mobile Fix] observeReveals failed:', e);
                    // Fallback to immediate activation
                    newCards.forEach(card => {
                        card.classList.add('active');
                        card.style.opacity = '1';
                        card.style.transform = 'none';
                    });
                }
            } else {
                console.warn('⚠️ [Mobile Fix] IntersectionObserver not available, using immediate activation');
                console.warn('   - IntersectionObserver exists:', hasIntersectionObserver);
                console.warn('   - observeReveals function exists:', hasObserveFunction);
                console.warn('   - revealObserver exists:', !!window.revealObserver);
                
                // Immediately activate cards for incognito/mobile
                newCards.forEach(card => {
                    card.classList.add('active');
                    card.style.opacity = '1';
                    card.style.transform = 'none';
                });
            }
            
            // AGGRESSIVE fallback: Force visibility after delay if cards are STILL hidden
            // Increased timeout for slower mobile devices and incognito mode
            setTimeout(() => {
                let hiddenCount = 0;
                newCards.forEach((card, index) => {
                    const isHidden = !card.classList.contains('active') || 
                                   card.style.opacity === '0' || 
                                   parseFloat(window.getComputedStyle(card).opacity) < 0.5;
                    
                    if (isHidden) {
                        console.warn(`⚠️ [Mobile Fix] Card ${index + 1} still hidden, forcing visibility`);
                        card.classList.add('active');
                        card.style.opacity = '1';
                        card.style.transform = 'none';
                        card.style.transition = 'all 0.6s ease';
                        hiddenCount++;
                    }
                });
                
                if (hiddenCount > 0) {
                    console.warn(`⚠️ [Mobile Fix] Force-activated ${hiddenCount} hidden cards`);
                } else {
                    console.log('✅ [Mobile Debug] All cards are visible');
                }
            }, 500);

            // Initialise hover animations using the global helper
            if (typeof window.initPropertyCards === 'function') {
                window.initPropertyCards(newCards);
            }
        };
        
        // Start the retry mechanism
        loadWithRetry();
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
                     class="w-full h-48 object-cover mb-4 rounded">
                <div class="flex justify-between items-start">
                    <span class="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full">LIVE</span>
                    <span class="text-sm text-gray-500">${property.location}</span>
                </div>
            </div>
            <h3 class="text-xl font-bold mb-2">${property.title}</h3>
            <p class="text-gray-600 mb-4">${property.description}</p>
            <div class="flex justify-between items-center">
                <span class="font-bold text-lg">€${property.price.toLocaleString()}</span>
                <a href="${property.link}"
                   target="_blank"
                   class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors">
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
        } else if (path.includes('agencies.html')) {
            pageKey = 'agencies';
        } else if (path.includes('about.html')) {
            pageKey = 'about';
        } else if (path.includes('faq.html')) {
            pageKey = 'faq';
        } else if (path.includes('privacy.html')) {
            pageKey = 'privacy';
        } else if (path.includes('terms.html')) {
            pageKey = 'terms';
        }

        const page = this.content.pages[pageKey];
        if (!page) return;

        // Update hero title and subtitle. Each page can override these via the
        // pages configuration. Fallback to the global heroTitle and heroSubtitle
        // defined on this.content if no override exists. Also apply translations if
        // a non-English language is selected and translations exist.
        const titleEl = document.querySelector('.hero-text');
        const subtitleEls = document.querySelectorAll('.body-text');

        let heroTitle = page.heroTitle || this.content.heroTitle;
        let heroSubtitle = page.heroSubtitle || this.content.heroSubtitle;

        // Apply translations if language is not English and translations are available for this page
        const lang = this.content.settings && this.content.settings.language;
        if (lang && lang !== 'en' && this.content.translations && this.content.translations[lang] && this.content.translations[lang][pageKey]) {
            const tPage = this.content.translations[lang][pageKey];
            heroTitle = tPage.heroTitle || heroTitle;
            heroSubtitle = tPage.heroSubtitle || heroSubtitle;
            // Also override section titles and contents on the page object (so loops below pick them up)
            for (let i = 1; i <= 3; i++) {
                const titleKey = `section${i}Title`;
                const contentKey = `section${i}Content`;
                const iconKey = `section${i}Icon`;
                const imageKey = `section${i}Image`;
                if (tPage[titleKey]) page[titleKey] = tPage[titleKey];
                if (tPage[contentKey]) page[contentKey] = tPage[contentKey];
                if (tPage[iconKey]) page[iconKey] = tPage[iconKey];
                if (tPage[imageKey]) page[imageKey] = tPage[imageKey];
            }
        }

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
        } else {
            // For home page, update the additional sections
            const howItWorksTitleEl = document.querySelector('#how-it-works .section-text');
            const howItWorksSubtitleEl = document.querySelector('#how-it-works .body-text');
            const featuresTitleEl = document.querySelector('#features .section-text');
            const featuresSubtitleEl = document.querySelector('#features .body-text');
            const ctaTitleEl = document.querySelector('section:has(#live-properties) ~ section .section-text');
            const ctaSubtitleEl = document.querySelector('section:has(#live-properties) ~ section .body-text');
            
            if (howItWorksTitleEl && page.howItWorksTitle) {
                howItWorksTitleEl.textContent = page.howItWorksTitle;
            }
            if (howItWorksSubtitleEl && page.howItWorksSubtitle) {
                howItWorksSubtitleEl.textContent = page.howItWorksSubtitle;
            }
            if (featuresTitleEl && page.featuresTitle) {
                featuresTitleEl.textContent = page.featuresTitle;
            }
            if (featuresSubtitleEl && page.featuresSubtitle) {
                featuresSubtitleEl.textContent = page.featuresSubtitle;
            }
            if (ctaTitleEl && page.ctaTitle) {
                ctaTitleEl.textContent = page.ctaTitle;
            }
            if (ctaSubtitleEl && page.ctaSubtitle) {
                ctaSubtitleEl.textContent = page.ctaSubtitle;
            }
        }

        // Update white-label section for agencies page
        if (pageKey === 'agencies') {
            const whiteLabelTitleEl = document.getElementById('agency-white-label-title');
            const whiteLabelSubtitleEl = document.getElementById('agency-white-label-subtitle');
            const whiteLabelBenefitsTitleEl = document.getElementById('agency-white-label-benefits-title');
            const whiteLabelBenefitsListEl = document.getElementById('agency-white-label-benefits-list');
            const whiteLabelWhyTitleEl = document.getElementById('agency-white-label-why-title');
            const whiteLabelWhyListEl = document.getElementById('agency-white-label-why-list');
            const whiteLabelContactLabelEl = document.getElementById('agency-white-label-contact-label');
            const whiteLabelContactEmailEl = document.getElementById('agency-white-label-contact-email');

            if (whiteLabelTitleEl && page.whiteLabelTitle) {
                whiteLabelTitleEl.textContent = page.whiteLabelTitle;
            }
            if (whiteLabelSubtitleEl && page.whiteLabelSubtitle) {
                whiteLabelSubtitleEl.textContent = page.whiteLabelSubtitle;
            }
            if (whiteLabelBenefitsTitleEl && page.whiteLabelBenefitsTitle) {
                whiteLabelBenefitsTitleEl.textContent = page.whiteLabelBenefitsTitle;
            }
            if (whiteLabelBenefitsListEl && page.whiteLabelBenefitsList && Array.isArray(page.whiteLabelBenefitsList)) {
                whiteLabelBenefitsListEl.innerHTML = page.whiteLabelBenefitsList
                    .map(item => `<li>${item}</li>`)
                    .join('');
            }
            if (whiteLabelWhyTitleEl && page.whiteLabelWhyTitle) {
                whiteLabelWhyTitleEl.textContent = page.whiteLabelWhyTitle;
            }
            if (whiteLabelWhyListEl && page.whiteLabelWhyList && Array.isArray(page.whiteLabelWhyList)) {
                whiteLabelWhyListEl.innerHTML = page.whiteLabelWhyList
                    .map(item => `<li>${item}</li>`)
                    .join('');
            }
            if (whiteLabelContactLabelEl && page.whiteLabelContactLabel) {
                whiteLabelContactLabelEl.textContent = page.whiteLabelContactLabel;
            }
            if (whiteLabelContactEmailEl && page.whiteLabelContactEmail) {
                whiteLabelContactEmailEl.innerHTML = `<a href="mailto:${page.whiteLabelContactEmail}" class="hover:underline">${page.whiteLabelContactEmail}</a>`;
            }
        }

        // Update custom sections for agencies and investors
        // For agencies the prefix is 'agency' and for investors it's 'investor'.
        // This allows the same hide/show logic to apply across both types of pages.
        if (pageKey === 'agencies' || pageKey === 'investors') {
            const prefix = pageKey === 'agencies' ? 'agency' : 'investor';
            for (let i = 1; i <= 3; i++) {
                const titleId = `${prefix}-section${i}-title`;
                const contentId = `${prefix}-section${i}-content`;
                const iconId = `${prefix}-section${i}-icon`;
                const imageId = `${prefix}-section${i}-image`;
                const titleElSec = document.getElementById(titleId);
                const contentElSec = document.getElementById(contentId);
                const iconElSec = document.getElementById(iconId);
                const imageElSec = document.getElementById(imageId);
                const titleKey = `section${i}Title`;
                const contentKey = `section${i}Content`;
                const iconKey = `section${i}Icon`;
                const imageKey = `section${i}Image`;
                // Update title (hide if empty or whitespace)
                if (titleElSec) {
                    const tVal = page[titleKey];
                    if (tVal && String(tVal).trim()) {
                        titleElSec.textContent = tVal;
                        titleElSec.style.display = '';
                    } else {
                        // If no title, hide the element and clear content
                        titleElSec.style.display = 'none';
                        titleElSec.textContent = '';
                    }
                }
                // Update content (hide if empty or whitespace)
                if (contentElSec) {
                    const cVal = page[contentKey];
                    if (cVal && String(cVal).trim()) {
                        contentElSec.textContent = cVal;
                        contentElSec.style.display = '';
                    } else {
                        contentElSec.style.display = 'none';
                        contentElSec.textContent = '';
                    }
                }
                // Update icon and hide if not provided (empty or whitespace)
                if (iconElSec) {
                    const iVal = page[iconKey];
                    if (iVal && String(iVal).trim()) {
                        iconElSec.textContent = iVal;
                        iconElSec.style.display = '';
                        iconElSec.style.margin = '';
                        iconElSec.style.padding = '';
                    } else {
                        iconElSec.style.display = 'none';
                        iconElSec.textContent = '';
                        iconElSec.style.margin = '0';
                        iconElSec.style.padding = '0';
                    }
                }
                // Update image and hide if not provided (empty or whitespace)
                if (imageElSec) {
                    const imgVal = page[imageKey];
                    if (imgVal && String(imgVal).trim()) {
                        imageElSec.setAttribute('src', imgVal);
                        // Provide alt text based on title if available
                        if (page[titleKey] && String(page[titleKey]).trim()) {
                            imageElSec.setAttribute('alt', page[titleKey]);
                        }
                        imageElSec.style.display = '';
                        imageElSec.style.margin = '';
                    } else {
                        imageElSec.style.display = 'none';
                        imageElSec.setAttribute('src', '');
                        imageElSec.style.margin = '0';
                    }
                }

                // Hide entire section if no meaningful title, content, icon or image provided
                // Check both the CMS data AND the actual rendered content to ensure sections
                // are hidden even if they were populated with empty values
                const hasTitleContent = titleElSec && titleElSec.textContent && titleElSec.textContent.trim();
                const hasContentText = contentElSec && contentElSec.textContent && contentElSec.textContent.trim();
                const hasIconContent = iconElSec && iconElSec.textContent && iconElSec.textContent.trim();
                const hasImageSrc = imageElSec && imageElSec.getAttribute('src') && imageElSec.getAttribute('src').trim();
                
                const hasSectionContent = hasTitleContent || hasContentText || hasIconContent || hasImageSrc;
                
                // Determine the section ID based on the prefix and section number
                const sectionIds = {
                    'investor': {
                        1: 'investing-without-borders',
                        2: 'investor-challenges', 
                        3: 'investor-support'
                    },
                    'agency': {
                        1: 'agency-live-selling',
                        2: 'agency-leads',
                        3: 'agency-advantage'
                    }
                };
                
                const sectionId = sectionIds[prefix] && sectionIds[prefix][i];
                const sectionEl = sectionId ? document.getElementById(sectionId) : null;
                
                if (sectionEl) {
                    if (!hasSectionContent) {
                        sectionEl.style.display = 'none';
                    } else {
                        sectionEl.style.display = '';
                    }
                }
            }
        }
        
        // Update FAQ page content
        if (pageKey === 'faq') {
            const pageTitleEl = document.querySelector('main h1');
            const pageSubtitleEl = document.querySelector('main h1 + p');
            const ctaTitleEl = document.querySelector('section .text-2xl.font-bold');
            const ctaTextEl = document.querySelector('section .mb-6');
            
            if (pageTitleEl && page.pageTitle) {
                pageTitleEl.textContent = page.pageTitle;
            }
            if (pageSubtitleEl && page.pageSubtitle) {
                pageSubtitleEl.textContent = page.pageSubtitle;
            }
            if (ctaTitleEl && page.ctaTitle) {
                ctaTitleEl.textContent = page.ctaTitle;
            }
            if (ctaTextEl && page.ctaText) {
                ctaTextEl.textContent = page.ctaText;
            }
        }
        
        // Update Privacy page content
        if (pageKey === 'privacy') {
            const pageTitleEl = document.querySelector('main h1');
            const effectiveDateEl = document.querySelector('main h1 + p.text-xl');
            const lastUpdatedEl = effectiveDateEl ? effectiveDateEl.nextElementSibling : null;
            const companyNameEls = document.querySelectorAll('footer p');
            const contactEmailEls = document.querySelectorAll('p strong');
            
            if (pageTitleEl && page.pageTitle) {
                pageTitleEl.textContent = page.pageTitle;
            }
            if (effectiveDateEl && page.effectiveDate) {
                effectiveDateEl.textContent = `Effective Date: ${page.effectiveDate}`;
            }
            if (lastUpdatedEl && page.lastUpdated) {
                lastUpdatedEl.textContent = `Last Updated: ${page.lastUpdated}`;
            }
            
            // Update company information in footer
            if (companyNameEls.length > 0 && page.companyName && page.companyAddress) {
                companyNameEls[0].innerHTML = `${page.companyName}, ${page.companyAddress}<br>estalara@estalara.com`;
            }
            
            // Update contact information in Contact Us section
            const contactSection = document.querySelector('.content-section:has(h2)');
            if (contactSection) {
                const contactParagraphs = contactSection.querySelectorAll('p');
                if (contactParagraphs.length > 1 && page.contactEmail && page.companyName && page.companyAddress) {
                    contactParagraphs[contactParagraphs.length - 1].innerHTML = `
                        <strong>Email:</strong> ${page.contactEmail}<br>
                        <strong>General Inquiries:</strong> estalara@estalara.com<br>
                        <strong>Address:</strong> ${page.companyName}, ${page.companyAddress}
                    `;
                }
            }
        }
        
        // Update Terms page content
        if (pageKey === 'terms') {
            const pageTitleEl = document.querySelector('main h1');
            const effectiveDateEl = document.querySelector('main h1 + p.text-xl');
            const lastUpdatedEl = effectiveDateEl ? effectiveDateEl.nextElementSibling : null;
            const companyNameEls = document.querySelectorAll('footer p');
            
            if (pageTitleEl && page.pageTitle) {
                pageTitleEl.textContent = page.pageTitle;
            }
            if (effectiveDateEl && page.effectiveDate) {
                effectiveDateEl.textContent = `Effective Date: ${page.effectiveDate}`;
            }
            if (lastUpdatedEl && page.lastUpdated) {
                lastUpdatedEl.textContent = `Last Updated: ${page.lastUpdated}`;
            }
            
            // Update company information in footer
            if (companyNameEls.length > 0 && page.companyName && page.companyAddress) {
                companyNameEls[0].innerHTML = `${page.companyName}, ${page.companyAddress}<br>estalara@estalara.com`;
            }
            
            // Update contact information in Contact Information section
            const contactSections = document.querySelectorAll('.content-section');
            const contactSection = Array.from(contactSections).find(section => 
                section.querySelector('h2')?.textContent.includes('Contact Information')
            );
            if (contactSection && page.legalEmail && page.contactEmail && page.companyName && page.companyAddress) {
                const contactParagraphs = contactSection.querySelectorAll('p');
                if (contactParagraphs.length > 1) {
                    contactParagraphs[contactParagraphs.length - 1].innerHTML = `
                        <strong>Email:</strong> ${page.legalEmail}<br>
                        <strong>General Inquiries:</strong> ${page.contactEmail}<br>
                        <strong>Address:</strong> ${page.companyName}, ${page.companyAddress}
                    `;
                }
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

    // Get page structure
    getPageStructure(pageId) {
        return this.content.pageStructures && this.content.pageStructures[pageId] 
            ? [...this.content.pageStructures[pageId]]
            : [];
    }

    // Update page structure
    updatePageStructure(pageId, structure) {
        if (!this.content.pageStructures) {
            this.content.pageStructures = {};
        }
        this.content.pageStructures[pageId] = structure;
        this.saveContent();
        
        // Reload current page if we're on it
        const path = window.location.pathname;
        if ((pageId === 'home' && (path.includes('index.html') || path === '/')) ||
            path.includes(`${pageId}.html`)) {
            this.applyPageStructure(pageId);
        }
    }

    // Toggle section visibility
    toggleSectionVisibility(pageId, sectionId) {
        const structure = this.getPageStructure(pageId);
        const section = structure.find(s => s.id === sectionId);
        if (section) {
            section.visible = !section.visible;
            this.updatePageStructure(pageId, structure);
        }
    }

    // Add new section to page
    addSection(pageId, sectionData) {
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
        this.updatePageStructure(pageId, structure);
        return newSection;
    }

    // Remove section from page
    removeSection(pageId, sectionId) {
        let structure = this.getPageStructure(pageId);
        structure = structure.filter(s => s.id !== sectionId);
        // Reorder remaining sections
        structure.forEach((s, index) => {
            s.order = index + 1;
        });
        this.updatePageStructure(pageId, structure);
    }

    // Reorder sections
    reorderSections(pageId, newOrder) {
        const structure = this.getPageStructure(pageId);
        const reordered = newOrder.map((id, index) => {
            const section = structure.find(s => s.id === id);
            if (section) {
                section.order = index + 1;
            }
            return section;
        }).filter(Boolean);
        this.updatePageStructure(pageId, reordered);
    }

    // Apply page structure (hide/show sections based on visibility)
    applyPageStructure(pageId) {
        const structure = this.getPageStructure(pageId);
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
    }
}

// Helper function to hide empty icon and image elements immediately on page load
// This prevents empty placeholders from showing before CMS content loads
function hideEmptyPlaceholders() {
    // Hide all empty icon elements
    document.querySelectorAll('[id$="-icon"]').forEach(el => {
        if (!el.textContent || !el.textContent.trim()) {
            el.style.display = 'none';
            el.style.margin = '0';
            el.style.padding = '0';
        }
    });
    
    // Hide all images with empty src
    document.querySelectorAll('[id$="-image"]').forEach(el => {
        if (!el.getAttribute('src') || !el.getAttribute('src').trim()) {
            el.style.display = 'none';
            el.style.margin = '0';
        }
    });
}

// Run immediately to hide placeholders before CMS loads
hideEmptyPlaceholders();

// Initialize Admin when DOM is loaded
// Since scripts are loaded at the end of <body>, DOM may already be ready
(function initAdmin() {
    if (document.readyState === 'loading') {
        // DOM is still loading, wait for DOMContentLoaded
        console.log('📋 [CMS] DOM is loading, waiting for DOMContentLoaded...');
        document.addEventListener('DOMContentLoaded', function() {
            console.log('📋 [CMS] DOMContentLoaded fired, initializing EstalaraAdmin');
            window.estalaraAdmin = new EstalaraAdmin();
        });
    } else {
        // DOM is already loaded (interactive or complete), initialize immediately
        console.log('📋 [CMS] DOM already loaded (state: ' + document.readyState + '), initializing EstalaraAdmin immediately');
        window.estalaraAdmin = new EstalaraAdmin();
    }
})();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EstalaraAdmin;
}
