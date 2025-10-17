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
        
        // Initialize asynchronously to load from Firebase
        this.initAsync();
    }

    async initAsync() {
        try {
            console.log('🔄 [CMS] Starting async initialization...');
            
            // Load content from Firebase first
            this.content = await this.loadContent();
            
            // FIX: Ensure content is properly loaded before proceeding
            if (!this.content || typeof this.content !== 'object') {
                console.error('❌ [CMS] Failed to load content, using defaults');
                this.content = this.getDefaultContent();
            }
            
            // Additional validation: ensure critical properties exist
            if (!this.content.pages || typeof this.content.pages !== 'object') {
                console.warn('⚠️ [CMS] Content missing pages object, merging with defaults');
                const defaults = this.getDefaultContent();
                this.content.pages = defaults.pages;
            }
            
            // Ensure liveProperties array exists
            if (!Array.isArray(this.content.liveProperties)) {
                console.warn('⚠️ [CMS] liveProperties missing or not an array, using defaults');
                const defaults = this.getDefaultContent();
                this.content.liveProperties = defaults.liveProperties;
            }
            
            console.log('✅ [CMS] Content loaded successfully');
            console.log('   - liveProperties count:', this.content.liveProperties?.length || 0);
            console.log('   - pages:', Object.keys(this.content.pages || {}).join(', '));
            
            this.init();
        } catch (error) {
            console.error('❌ [CMS] Critical error in initAsync:', error);
            console.error('   Stack:', error.stack);
            // Use defaults and continue
            this.content = this.getDefaultContent();
            console.log('✅ [CMS] Using default content as fallback');
            this.init();
        }
    }

    init() {
        this.loadDynamicContent();
        this.loadFrontendElements();
        this.setupEventListeners();
    }

    // Load all frontend elements from CMS
    loadFrontendElements() {
        this.loadNavigation();
        this.loadFooter();
        this.loadFeatureCards();
        this.loadButtons();
        this.loadSectionHeadings();
        this.loadHowItWorks();
        this.loadAgentsFeatures();
        this.loadAboutContent();
    }

    // Get default content structure
    getDefaultContent() {
        return {
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
                    link: "https://app.estalara.com"
                },
                {
                    id: 2,
                    title: "Luxury Penthouse in Madrid",
                    location: "Madrid, Spain",
                    price: 1200000,
                    image: "https://kimi-web-img.moonshot.cn/img/www.valcucine.com/23a9f04943354e7f0279fbe99bcc358000b108f4.jpg",
                    description: "Exclusive penthouse in Madrid's premium district with panoramic city views.",
                    link: "https://app.estalara.com"
                },
                {
                    id: 3,
                    title: "Beachfront Villa in Barcelona",
                    location: "Barcelona, Spain",
                    price: 2800000,
                    image: "https://kimi-web-img.moonshot.cn/img/antonovich-design.com/c4dc761e62d99ae8976671614b35f23c72bda4df.jpg",
                    description: "Spectacular beachfront villa with private pool and direct beach access.",
                    link: "https://app.estalara.com"
                },
                {
                    id: 4,
                    title: "Historic Building in Valencia",
                    location: "Valencia, Spain",
                    price: 750000,
                    image: "https://kimi-web-img.moonshot.cn/img/www.elegantinterior.info/c0b1fd32f4cdc3abdaccf6a5f411e8f3fb8e6e92.png",
                    description: "Beautifully restored historic building in Valencia's old town with modern interiors.",
                    link: "https://app.estalara.com"
                },
                {
                    id: 5,
                    title: "Traditional House in Seville",
                    location: "Seville, Spain",
                    price: 320000,
                    image: "https://kimi-web-img.moonshot.cn/img/idea.3dbrute.com/eaa4c4cbb5ccbf57f4732305104dd9187d2276a4.jpg",
                    description: "Authentic Andalusian house with patio, perfect for cultural immersion.",
                    link: "https://app.estalara.com"
                },
                {
                    id: 6,
                    title: "Modern Villa in Malaga",
                    location: "Malaga, Spain",
                    price: 1850000,
                    image: "https://kimi-web-img.moonshot.cn/img/archello.s3.eu-central-1.amazonaws.com/e68f5c11f478a0669779d5422a04c826a028dca0.jpg",
                    description: "Contemporary villa with stunning sea views and infinity pool in Costa del Sol.",
                    link: "https://app.estalara.com"
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
                    link: "https://app.estalara.com",
                    status: "live"
                },
                {
                    id: 2,
                    title: "Luxury Penthouse in Madrid",
                    location: "Madrid, Spain",
                    price: 1200000,
                    image: "https://kimi-web-img.moonshot.cn/img/www.valcucine.com/23a9f04943354e7f0279fbe99bcc358000b108f4.jpg",
                    description: "Exclusive penthouse in Madrid's premium district with panoramic city views.",
                    link: "https://app.estalara.com",
                    status: "live"
                },
                {
                    id: 3,
                    title: "Beachfront Villa in Barcelona",
                    location: "Barcelona, Spain",
                    price: 2800000,
                    image: "https://kimi-web-img.moonshot.cn/img/antonovich-design.com/c4dc761e62d99ae8976671614b35f23c72bda4df.jpg",
                    description: "Spectacular beachfront villa with private pool and direct beach access.",
                    link: "https://app.estalara.com",
                    status: "live"
                },
                {
                    id: 4,
                    title: "Historic Building in Valencia",
                    location: "Valencia, Spain",
                    price: 750000,
                    image: "https://kimi-web-img.moonshot.cn/img/www.elegantinterior.info/c0b1fd32f4cdc3abdaccf6a5f411e8f3fb8e6e92.png",
                    description: "Beautifully restored historic building in Valencia's old town with modern interiors.",
                    link: "https://app.estalara.com",
                    status: "live"
                },
                {
                    id: 5,
                    title: "Traditional House in Seville",
                    location: "Seville, Spain",
                    price: 320000,
                    image: "https://kimi-web-img.moonshot.cn/img/idea.3dbrute.com/eaa4c4cbb5ccbf57f4732305104dd9187d2276a4.jpg",
                    description: "Authentic Andalusian house with patio, perfect for cultural immersion.",
                    link: "https://app.estalara.com",
                    status: "live"
                },
                {
                    id: 6,
                    title: "Modern Villa in Malaga",
                    location: "Malaga, Spain",
                    price: 1850000,
                    image: "https://kimi-web-img.moonshot.cn/img/archello.s3.eu-central-1.amazonaws.com/e68f5c11f478a0669779d5422a04c826a028dca0.jpg",
                    description: "Contemporary villa with stunning sea views and infinity pool in Costa del Sol.",
                    link: "https://app.estalara.com",
                    status: "live"
                }
            ],
            // Define page specific overrides for titles and subtitles. Without this key
            // `loadPageContent` would attempt to read undefined values and throw errors.
            pages: {
                home: {
                    heroTitle: "Go LIVE. Go GLOBAL.",
                    heroSubtitle: "Estalara brings the world's real estate to your fingertips — powered by AI, livestreams, and verified global partners.<br><br>Discover hidden opportunities, explore properties in real time, and make confident investment decisions without leaving home.",
                    // Hero CTA Buttons
                    heroCta1Text: "Explore Estalara App →",
                    heroCta1Link: "https://app.estalara.com",
                    heroCta2Text: "How It Works",
                    heroCta2Link: "#how-it-works",
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
                    heroSubtitle: "Attract and convert high‑value global investors effortlessly. Livestream your listings and engage verified buyers in real time with AI‑powered lead generation and automatic landing pages.",
                    // Hero CTA Buttons
                    heroCta1Text: "Start Livestreaming →",
                    heroCta1Link: "https://app.estalara.com",
                    heroCta2Text: "Explore Features",
                    heroCta2Link: "#features"
                },
                investors: {
                    heroTitle: "Invest <span class=\"text-white\">WORLDWIDE</span>",
                    heroSubtitle: "Discover and fund exceptional real estate opportunities across borders. Access exclusive properties streamed live and make informed decisions with real‑time data.",
                    // Hero CTA Buttons
                    heroCta1Text: "Explore Properties →",
                    heroCta1Link: "https://app.estalara.com",
                    heroCta2Text: "Learn Benefits",
                    heroCta2Link: "#benefits",
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
                    heroSubtitle: "We're revolutionizing global real estate by connecting agents and investors through AI and live experiences. Our mission is to make international property transactions simple, transparent, and accessible to everyone.",
                    // Hero CTA Buttons
                    heroCta1Text: "Join Our Platform →",
                    heroCta1Link: "https://app.estalara.com",
                    heroCta2Text: "Our Story",
                    heroCta2Link: "#story"
                },
                agencies: {
                    heroTitle: "Agencies Go <span class=\"text-white\">ENTERPRISE</span>",
                    heroSubtitle: "Grow your agency through live selling and social media. Manage multiple agents, broadcast tours and expand internationally with our enterprise solutions.",
                    // Hero CTA Buttons
                    heroCta1Text: "Scale Your Agency →",
                    heroCta1Link: "https://app.estalara.com",
                    heroCta2Text: "Explore Solutions",
                    heroCta2Link: "#enterprise-features",
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
            // Navigation menu items
            navigation: [
                { id: 1, label: "Home", url: "index.html", order: 1 },
                { id: 2, label: "For Agents", url: "agents.html", order: 2 },
                { id: 3, label: "For Agencies", url: "agencies.html", order: 3 },
                { id: 4, label: "For Investors", url: "investors.html", order: 4 },
                { id: 5, label: "About", url: "about.html", order: 5 },
                { id: 6, label: "FAQ", url: "faq.html", order: 6 }
            ],
            // Footer content
            footer: {
                companyName: "Estalara",
                tagline: "Go LIVE. Go GLOBAL.",
                description: "Connecting real estate agents and global investors through AI and live experiences.",
                links: [
                    { label: "Home", url: "index.html" },
                    { label: "About", url: "about.html" },
                    { label: "Privacy Policy", url: "privacy.html" },
                    { label: "Terms of Service", url: "terms.html" }
                ],
                socialLinks: [
                    { platform: "LinkedIn", url: "https://www.linkedin.com/company/estalara" },
                    { platform: "Instagram", url: "https://www.instagram.com/estalara" },
                    { platform: "TikTok", url: "https://www.tiktok.com/@estalara" },
                    { platform: "Facebook", url: "https://www.facebook.com/estalara" },
                    { platform: "X", url: "https://twitter.com/estalara" },
                    { platform: "YouTube", url: "https://www.youtube.com/@estalara" }
                ]
            },
            // Feature cards per page
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
                ],
                agents: [
                    { icon: "📈", title: "Grow Your Business", description: "Reach international buyers and close deals faster." },
                    { icon: "⚡", title: "Instant Leads", description: "Get verified leads delivered directly to your dashboard." },
                    { icon: "🎯", title: "Smart Targeting", description: "AI matches your properties with the right buyers." }
                ],
                agencies: [
                    { icon: "🏢", title: "Enterprise Solutions", description: "Scale your agency with our comprehensive platform." },
                    { icon: "👥", title: "Team Management", description: "Manage multiple agents and track performance." },
                    { icon: "📊", title: "Analytics", description: "Data-driven insights to optimize your strategy." }
                ],
                investors: [
                    { icon: "💰", title: "Smart Investments", description: "Discover vetted properties with high ROI potential." },
                    { icon: "🔒", title: "Secure Transactions", description: "Safe and transparent property transactions." },
                    { icon: "🌐", title: "Global Portfolio", description: "Diversify with international real estate." }
                ],
                about: []
            },
            // Buttons and CTAs
            buttons: {
                global: {
                    primary: { text: "Get Started", url: "https://app.estalara.com" },
                    secondary: { text: "Learn More", url: "#features" },
                    headerCta: { text: "Launch App", url: "https://app.estalara.com" }
                },
                home: {
                    primary: { text: "Get Started", url: "https://app.estalara.com" },
                    secondary: { text: "See How It Works", url: "#how-it-works" },
                    headerCta: { text: "Launch App", url: "https://app.estalara.com" }
                },
                agents: {
                    primary: { text: "Join as Agent", url: "https://app.estalara.com/signup/agent" },
                    secondary: { text: "Watch Demo", url: "#demo" },
                    headerCta: { text: "Launch App", url: "https://app.estalara.com" }
                },
                agencies: {
                    primary: { text: "Enterprise Contact", url: "mailto:peter@estalara.com" },
                    secondary: { text: "View Features", url: "#enterprise-features" },
                    headerCta: { text: "Launch App", url: "https://app.estalara.com" }
                },
                investors: {
                    primary: { text: "Browse Properties", url: "https://app.estalara.com/properties" },
                    secondary: { text: "Learn More", url: "#investing-without-borders" },
                    headerCta: { text: "Launch App", url: "https://app.estalara.com" }
                }
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
    }

    // Load content from Firebase or localStorage
    async loadContent() {
        const defaultContent = this.getDefaultContent();

        // Load from Firebase first, then fall back to localStorage, then defaults.
        // Include versioning to ensure that breaking changes or major updates to
        // the default content automatically override old stored data.
        
        console.log('📦 [Debug] Loading content - checking Firebase first...');
        
        // First try loading from Firebase using the async helper
        if (window.loadAdminDataAsync) {
            try {
                console.log('🔄 Attempting to load data from Firebase...');
                const firebaseData = await window.loadAdminDataAsync();
                
                // FIX: Validate Firebase data before using it
                if (!firebaseData) {
                    console.warn('⚠️ [CMS] Firebase returned null/undefined data');
                    throw new Error('Firebase data is null or undefined');
                }

                // Accept any non-empty Firebase payload and merge with defaults.
                // Previously this required both navigation and properties, which
                // caused valid liveProperties to be ignored when navigation was
                // empty – resulting in missing LIVE tiles on the frontend.
                if (firebaseData && Object.keys(firebaseData).length > 0) {
                    console.log('✅ Successfully loaded data from Firebase');
                    console.log('🔍 [Debug] Firebase navigation count:', firebaseData.navigation?.length || 0);
                    console.log('🔍 [Debug] Firebase liveProperties count:', firebaseData.liveProperties?.length || 0);
                    // Shallow-merge Firebase payload onto defaults, then normalise
                    const merged = { ...defaultContent, ...firebaseData };

                    // Ensure pages object exists and merge missing pages from defaults
                    merged.pages = merged.pages || {};
                    if (defaultContent.pages) {
                        for (const key of Object.keys(defaultContent.pages)) {
                            if (!merged.pages[key]) {
                                merged.pages[key] = defaultContent.pages[key];
                            }
                        }
                    }

                    // Ensure pageStructures exist and include defaults for any missing pages
                    if (!merged.pageStructures || typeof merged.pageStructures !== 'object') {
                        merged.pageStructures = defaultContent.pageStructures || {};
                    } else if (defaultContent.pageStructures) {
                        for (const pageKey of Object.keys(defaultContent.pageStructures)) {
                            if (!merged.pageStructures[pageKey]) {
                                merged.pageStructures[pageKey] = defaultContent.pageStructures[pageKey];
                            }
                        }
                    }

                    // Ensure LIVE Properties are populated. If Firebase payload has an empty
                    // liveProperties array, fall back to (a) migrated properties or (b) defaults.
                    if (!Array.isArray(merged.liveProperties) || merged.liveProperties.length === 0) {
                        if (Array.isArray(merged.properties) && merged.properties.length > 0) {
                            merged.liveProperties = merged.properties.map(prop => ({
                                id: prop.id,
                                title: prop.title,
                                location: prop.location,
                                price: prop.price,
                                description: prop.description,
                                image: prop.image,
                                link: prop.link || 'https://app.estalara.com'
                            }));
                            console.log('✅ [CMS] Filled liveProperties from properties (migration)');
                        } else {
                            merged.liveProperties = Array.isArray(defaultContent.liveProperties)
                                ? [...defaultContent.liveProperties]
                                : [];
                            console.log('✅ [CMS] Filled liveProperties from defaults');
                        }
                    }

                    return merged;
                }
                
                console.warn('⚠️ [Debug] Firebase returned empty data');
            } catch (error) {
                console.error('❌ Failed to load from Firebase:', error);
            }
        } else {
            console.warn('⚠️ [Debug] Firebase adapter not available yet (scripts may not be loaded)');
        }
        
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
        
        // FIX: Final validation - ensure loaded content is valid before returning
        if (!loaded || !loaded.pages || typeof loaded.pages !== 'object') {
            console.error('❌ [CMS] Loaded content is invalid, falling back to defaults');
            return { ...defaultContent };
        }
        
        console.log('✅ [CMS] Content loaded successfully');
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
        // FIX: Defensive check - ensure content exists
        if (!this.content) {
            console.error('❌ [CMS] loadDynamicContent called but this.content is undefined');
            console.error('   - Reinitializing with default content...');
            this.content = this.getDefaultContent();
        }
        
        // Additional safety check
        if (!this.content || typeof this.content !== 'object') {
            console.error('❌ [CMS] this.content is still invalid after reinitialization!');
            this.content = this.getDefaultContent();
        }
        
        console.log('📋 [CMS] loadDynamicContent executing with:');
        console.log('   - liveProperties:', this.content.liveProperties?.length || 0);
        console.log('   - pages:', this.content.pages ? Object.keys(this.content.pages).length : 0);
        
        // Update site title
        if (this.content.siteTitle) {
            document.title = this.content.siteTitle;
        }
        
        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && this.content.siteDescription) {
            metaDesc.setAttribute('content', this.content.siteDescription);
        }

        // Update contact email
        const contactEmail = document.getElementById('contact-email');
        if (contactEmail && this.content.contactEmail) {
            contactEmail.textContent = this.content.contactEmail;
        }

        // Update logo if logoUrl is set
        if (this.content.logoUrl) {
            this.updateLogo(this.content.logoUrl);
        }

        // Load properties when LIVE Properties container exists on the page
        // (more robust than pathname checks which can vary across deployments)
        const propertiesContainer = document.querySelector('#live-properties .grid');
        const shouldLoadProperties = !!propertiesContainer;
        console.log('🔍 [CMS Debug] Properties container present?', shouldLoadProperties, 'Pathname:', window.location.pathname);
        if (shouldLoadProperties) {
            console.log('📋 [CMS] Loading properties into LIVE Properties section');
            this.loadProperties();
            
            // BACKUP: Schedule a delayed reload in case the first attempt fails
            // This helps with timing issues on mobile devices
            setTimeout(() => {
                const container = document.querySelector('#live-properties .grid');
                if (container && container.children.length === 0) {
                    console.warn('⚠️ [CMS] Properties container is empty after initial load, retrying...');
                    this.loadProperties();
                }
            }, 1000);
        } else {
            console.warn('⚠️ [CMS] LIVE Properties container not found, skipping loadProperties()');
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
            let liveProperties = [];
            
            // Safety check: ensure this.content exists
            if (!this.content) {
                console.error('❌ [Mobile Fix] this.content is undefined in loadProperties!');
                console.error('   - Reinitializing with default content...');
                this.content = this.getDefaultContent();
            }
            
            // Try to get liveProperties from content
            if (Array.isArray(this.content.liveProperties) && this.content.liveProperties.length > 0) {
                liveProperties = this.content.liveProperties;
                console.log('✅ [Mobile Debug] Using liveProperties from content');
            } else if (Array.isArray(this.content.properties) && this.content.properties.length > 0) {
                // Fallback to old properties array
                liveProperties = this.content.properties.filter(p => !p.status || p.status === 'live');
                console.log('⚠️ [Mobile Debug] Falling back to properties array (migrating...)');
            } else {
                // Last resort: use defaults
                console.warn('⚠️ [Mobile Debug] No properties found, using defaults');
                const defaults = this.getDefaultContent();
                liveProperties = defaults.liveProperties || [];
                // Update content to include defaults
                if (!Array.isArray(this.content.liveProperties)) {
                    this.content.liveProperties = liveProperties;
                }
            }
            
            console.log('🔍 [Mobile Debug] liveProperties count:', liveProperties.length);
            console.log('🔍 [Mobile Debug] this.content exists:', !!this.content);
            console.log('🔍 [Mobile Debug] Sample property:', liveProperties[0] ? liveProperties[0].title : 'none');

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
                console.log('✅ [CMS] Using IntersectionObserver for reveal animations');
                try {
                    window.observeReveals(newCards);
                    console.log('✅ [CMS] Successfully registered', newCards.length, 'cards with IntersectionObserver');
                } catch (e) {
                    console.error('❌ [CMS] observeReveals failed:', e);
                    // Fallback to immediate activation
                    newCards.forEach(card => {
                        card.classList.add('active');
                        card.style.opacity = '1';
                        card.style.transform = 'none';
                    });
                }
            } else {
                console.warn('⚠️ [CMS] IntersectionObserver not available, using immediate activation');
                console.warn('   - IntersectionObserver exists:', hasIntersectionObserver);
                console.warn('   - observeReveals function exists:', hasObserveFunction);
                console.warn('   - revealObserver exists:', !!window.revealObserver);
                console.warn('   - This should not happen if main.js is properly initialized!');
                
                // Immediately activate cards as fallback
                newCards.forEach(card => {
                    card.classList.add('active');
                    card.style.opacity = '1';
                    card.style.transform = 'none';
                });
            }
            
            // Safety fallback: Check visibility after animations should have completed
            // This ensures cards are visible even if IntersectionObserver hasn't triggered yet
            // (e.g., cards below viewport or slow devices)
            setTimeout(() => {
                let hiddenCount = 0;
                newCards.forEach((card, index) => {
                    const isHidden = !card.classList.contains('active') || 
                                   card.style.opacity === '0' || 
                                   parseFloat(window.getComputedStyle(card).opacity) < 0.5;
                    
                    if (isHidden) {
                        console.log(`📍 [CMS] Card ${index + 1} not yet visible (likely below viewport), will animate on scroll`);
                        // Don't force activation - let IntersectionObserver handle it when card scrolls into view
                        // Only force if card should be visible but isn't
                        const rect = card.getBoundingClientRect();
                        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
                        
                        if (isInViewport) {
                            console.warn(`⚠️ [CMS] Card ${index + 1} is in viewport but hidden, forcing visibility`);
                            card.classList.add('active');
                            card.style.opacity = '1';
                            card.style.transform = 'none';
                            card.style.transition = 'all 0.6s ease';
                            hiddenCount++;
                        }
                    }
                });
                
                if (hiddenCount > 0) {
                    console.warn(`⚠️ [CMS] Force-activated ${hiddenCount} cards that were in viewport but hidden`);
                } else {
                    console.log('✅ [CMS] All visible cards are properly displayed');
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
        
        // Build property details HTML (beds, baths, area)
        let detailsHTML = '';
        const details = [];
        
        if (property.beds && property.beds > 0) {
            details.push(`
                <div class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                    <span>${property.beds}</span>
                </div>
            `);
        }
        
        if (property.baths && property.baths > 0) {
            details.push(`
                <div class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path>
                    </svg>
                    <span>${property.baths}</span>
                </div>
            `);
        }
        
        if (property.area && property.area > 0) {
            details.push(`
                <div class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                    </svg>
                    <span>${property.area} m²</span>
                </div>
            `);
        }
        
        if (details.length > 0) {
            detailsHTML = `
                <div class="flex gap-4 mb-4 text-sm text-gray-600">
                    ${details.join('')}
                </div>
            `;
        }
        
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
            ${detailsHTML}
            <div class="flex justify-between items-center">
                <span class="font-bold text-lg">${typeof property.price === 'number' ? '$' + property.price.toLocaleString() : property.price || '$0'}</span>
                <a href="${property.link || 'https://app.estalara.com'}"
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
        // FIX: Defensive check - ensure content and pages exist
        if (!this.content) {
            console.error('❌ [CMS] loadPageContent called but this.content is undefined');
            return;
        }
        
        if (!this.content.pages) {
            console.error('❌ [CMS] loadPageContent called but this.content.pages is undefined');
            return;
        }
        
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
        if (!page) {
            console.warn(`⚠️ [CMS] No page configuration found for pageKey: ${pageKey}`);
            return;
        }

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

        // Update hero CTA buttons if they exist in the page configuration
        const heroSection = document.querySelector('section[class*="min-h-screen"]');
        if (heroSection) {
            const ctaButtons = heroSection.querySelectorAll('.btn-primary a, .btn-secondary a');
            if (ctaButtons.length >= 1 && page.heroCta1Text) {
                ctaButtons[0].textContent = page.heroCta1Text;
            }
            if (ctaButtons.length >= 1 && page.heroCta1Link) {
                ctaButtons[0].href = page.heroCta1Link;
            }
            if (ctaButtons.length >= 2 && page.heroCta2Text) {
                ctaButtons[1].textContent = page.heroCta2Text;
            }
            if (ctaButtons.length >= 2 && page.heroCta2Link) {
                ctaButtons[1].href = page.heroCta2Link;
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
                // Use innerHTML to support line breaks and basic formatting
                subtitleEls[0].innerHTML = heroSubtitle;
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
        const isHomePage = window.location.pathname.includes('index.html') || 
                          window.location.pathname === '/' ||
                          window.location.pathname.endsWith('/');
        if (isHomePage) {
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
        const isHomePage = window.location.pathname.includes('index.html') || 
                          window.location.pathname === '/' ||
                          window.location.pathname.endsWith('/');
        if (isHomePage) {
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
        
        // Listen for Firebase data changes (real-time sync)
        if (window.firebaseDb) {
            const ref = window.firebaseDb.ref('adminData');
            ref.on('value', (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    console.log('🔄 Firebase data updated, reloading content');
                    window.cmsFirebaseAdapter.cache = data;
                    this.content = this.loadContent();
                    this.loadDynamicContent();
                }
            });
        }

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
        // FIX: Defensive check - ensure content exists
        if (!this.content) {
            console.error('❌ [CMS] applyPageStructure called but this.content is undefined');
            return;
        }
        
        const structure = this.getPageStructure(pageId);
        if (!structure || !Array.isArray(structure)) {
            console.warn(`⚠️ [CMS] No structure found for pageId: ${pageId}`);
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
    }

    // Load navigation from CMS
    loadNavigation() {
        if (!this.content.navigation || !Array.isArray(this.content.navigation)) {
            return;
        }

        // Find desktop navigation ul
        const desktopNav = document.querySelector('header nav:not(#mobile-menu) ul');
        // Find mobile navigation ul
        const mobileNav = document.querySelector('#mobile-menu ul.mobile-nav');

        if (desktopNav) {
            // Clear existing links
            desktopNav.innerHTML = '';

            // Add navigation items (only visible ones)
            this.content.navigation
                .filter(item => item.visible !== false)
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .forEach(item => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = item.url || '#';
                    a.textContent = item.label || '';
                    a.className = 'text-white hover:text-gray-300 transition-colors';
                    li.appendChild(a);
                    desktopNav.appendChild(li);
                });
        }

        if (mobileNav) {
            // Clear existing links
            mobileNav.innerHTML = '';

            // Add navigation items to mobile menu (only visible ones)
            this.content.navigation
                .filter(item => item.visible !== false)
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .forEach(item => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = item.url || '#';
                    a.textContent = item.label || '';
                    a.className = 'block text-white hover:text-white py-2 hover:bg-white/5 px-2 rounded transition-colors';
                    li.appendChild(a);
                    mobileNav.appendChild(li);
                });
        }

        console.log('✅ [CMS] Navigation loaded with', this.content.navigation.length, 'items');
    }

    // Load footer from CMS
    loadFooter() {
        if (!this.content.footer) {
            return;
        }

        const footer = this.content.footer;

        // Update company name
        const companyNameEl = document.querySelector('footer .footer-company-name, footer h3');
        if (companyNameEl && footer.companyName) {
            companyNameEl.textContent = footer.companyName;
        }

        // Update tagline
        const taglineEl = document.querySelector('footer .footer-tagline');
        if (taglineEl && footer.tagline) {
            taglineEl.textContent = footer.tagline;
        }

        // Update description
        const descriptionEl = document.querySelector('footer .footer-description, footer p:first-of-type');
        if (descriptionEl && footer.description) {
            descriptionEl.textContent = footer.description;
        }

        // Update footer links
        if (footer.links && Array.isArray(footer.links)) {
            const footerLinksContainer = document.querySelector('footer .footer-links, footer nav ul');
            if (footerLinksContainer) {
                footerLinksContainer.innerHTML = '';
                footer.links.forEach(link => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = link.url || '#';
                    a.textContent = link.label || '';
                    a.className = 'hover:text-gray-300 transition-colors';
                    li.appendChild(a);
                    footerLinksContainer.appendChild(li);
                });
            }
        }

        // Update social media links
        if (footer.socialLinks && Array.isArray(footer.socialLinks)) {
            const socialContainer = document.querySelector('footer .social-links, footer .flex.space-x-4');
            if (socialContainer) {
                socialContainer.innerHTML = '';
                footer.socialLinks.forEach(social => {
                    const a = document.createElement('a');
                    a.href = social.url || '#';
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                    a.className = 'text-white hover:text-gray-300 transition-colors text-2xl';
                    a.setAttribute('aria-label', social.platform || 'Social Link');
                    
                    // Add SVG icon based on platform with better styling
                    const iconMap = {
                        'LinkedIn': '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>',
                        'Instagram': '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
                        'TikTok': '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg>',
                        'Facebook': '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
                        'Twitter': '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>',
                        'YouTube': '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
                        'X': '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>'
                    };
                    
                    if (iconMap[social.platform]) {
                        a.innerHTML = iconMap[social.platform];
                    } else {
                        // Fallback for unknown platforms
                        a.innerHTML = '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 22c-5.514 0-10-4.486-10-10s4.486-10 10-10 10 4.486 10 10-4.486 10-10 10zm1-11h-2v-6h2v6zm0 4h-2v-2h2v2z"/></svg>';
                    }
                    
                    socialContainer.appendChild(a);
                });
            }
        }

        console.log('✅ [CMS] Footer loaded');
    }

    // Load feature cards from CMS
    loadFeatureCards() {
        // Determine current page
        const path = window.location.pathname;
        let pageKey = 'home';
        if (path.includes('agents.html')) pageKey = 'agents';
        else if (path.includes('investors.html')) pageKey = 'investors';
        else if (path.includes('agencies.html')) pageKey = 'agencies';
        else if (path.includes('about.html')) pageKey = 'about';

        if (!this.content.features || !this.content.features[pageKey]) {
            return;
        }

        const features = this.content.features[pageKey];
        if (!Array.isArray(features) || features.length === 0) {
            return;
        }

        // Find features container
        const featuresContainer = document.querySelector('#features .grid, .features-grid');
        if (!featuresContainer) {
            return;
        }

        // Clear existing feature cards
        featuresContainer.innerHTML = '';

        // Add feature cards
        features.forEach((feature, index) => {
            const card = document.createElement('div');
            card.className = 'card-hover bg-white text-black p-8 rounded-lg reveal';
            card.style.animationDelay = `${index * 0.1}s`;
            
            card.innerHTML = `
                ${feature.icon ? `<div class="text-4xl mb-4">${feature.icon}</div>` : ''}
                <h3 class="text-2xl font-bold mb-4">${feature.title || ''}</h3>
                <p class="text-gray-600">${feature.description || ''}</p>
            `;
            
            featuresContainer.appendChild(card);
        });

        console.log('✅ [CMS] Feature cards loaded for', pageKey, ':', features.length, 'cards');
    }

    // Load buttons from CMS
    loadButtons() {
        // Determine current page
        const path = window.location.pathname;
        let pageKey = 'home';
        if (path.includes('agents.html')) pageKey = 'agents';
        else if (path.includes('investors.html')) pageKey = 'investors';
        else if (path.includes('agencies.html')) pageKey = 'agencies';
        else if (path.includes('about.html')) pageKey = 'about';

        if (!this.content.buttons) {
            return;
        }

        // Get page-specific buttons or fall back to global
        const pageButtons = this.content.buttons[pageKey] || this.content.buttons.global || {};

        // Update primary buttons
        if (pageButtons.primary) {
            const primaryButtons = document.querySelectorAll('.btn-primary, .cta-button a');
            primaryButtons.forEach(btn => {
                if (pageButtons.primary.text) {
                    btn.textContent = pageButtons.primary.text;
                }
                if (pageButtons.primary.url) {
                    btn.href = pageButtons.primary.url;
                }
            });
        }

        // Update secondary buttons
        if (pageButtons.secondary) {
            const secondaryButtons = document.querySelectorAll('.btn-secondary');
            secondaryButtons.forEach(btn => {
                if (pageButtons.secondary.text) {
                    btn.textContent = pageButtons.secondary.text;
                }
                if (pageButtons.secondary.url) {
                    btn.href = pageButtons.secondary.url;
                }
            });
        }

        // Update header CTA button (the "Launch App" / "Estalara Marketplace" button in header)
        if (pageButtons.headerCta) {
            const headerCtaButtons = document.querySelectorAll('.cta-button');
            headerCtaButtons.forEach(btn => {
                if (pageButtons.headerCta.text) {
                    btn.textContent = pageButtons.headerCta.text;
                }
                if (pageButtons.headerCta.url) {
                    btn.href = pageButtons.headerCta.url;
                }
            });
            console.log('🔄 [CMS] Updated header CTA button:', pageButtons.headerCta.text);
        }

        console.log('✅ [CMS] Buttons loaded for', pageKey);
    }

    // Load section headings and subtitles
    loadSectionHeadings() {
        if (!this.content.sectionHeadings) return;
        
        // Get current page name from URL
        const page = this.getCurrentPage();
        const headings = this.content.sectionHeadings[page];
        
        if (!headings) return;
        
        // Apply each section's heading and subtitle
        for (const [sectionId, data] of Object.entries(headings)) {
            const section = document.getElementById(sectionId);
            if (!section) continue;
            
            // Find and update heading (h2)
            if (data.heading) {
                const heading = section.querySelector('h2');
                if (heading) {
                    heading.textContent = data.heading;
                }
            }
            
            // Find and update subtitle (p after h2)
            if (data.subtitle) {
                const heading = section.querySelector('h2');
                if (heading) {
                    const subtitle = heading.nextElementSibling;
                    if (subtitle && subtitle.tagName === 'P') {
                        subtitle.textContent = data.subtitle;
                    }
                }
            }
        }
    }

    // Load How It Works section
    loadHowItWorks() {
        if (!this.content.howItWorks) return;
        
        const section = document.getElementById('how-it-works');
        if (!section) return;
        
        const data = this.content.howItWorks;
        
        // Update section heading
        if (data.heading) {
            const heading = section.querySelector('h2');
            if (heading) {
                heading.textContent = data.heading;
            }
        }
        
        // Update section subtitle
        if (data.subtitle) {
            const heading = section.querySelector('h2');
            if (heading) {
                const subtitle = heading.parentElement.querySelector('p');
                if (subtitle) {
                    subtitle.textContent = data.subtitle;
                }
            }
        }
        
        // Update steps
        if (data.steps && data.steps.length > 0) {
            const stepsContainer = section.querySelector('.grid');
            if (!stepsContainer) return;
            
            stepsContainer.innerHTML = data.steps.map(step => `
                <div class="text-center reveal card-hover p-8">
                    <div class="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">${step.number}</div>
                    <h3 class="text-2xl font-bold mb-4">${step.title}</h3>
                    <p class="text-gray-300">${step.description}</p>
                </div>
            `).join('');
        }
    }

    // Helper to get current page name from URL
    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('agents.html')) return 'agents';
        if (path.includes('agencies.html')) return 'agencies';
        if (path.includes('investors.html')) return 'investors';
        if (path.includes('about.html')) return 'about';
        if (path.includes('faq.html')) return 'faq';
        return 'home';
    }

    // Load Agents Page Features
    loadAgentsFeatures() {
        if (!this.content.agentsFeatures) return;
        if (this.getCurrentPage() !== 'agents') return;
        
        const featuresSection = document.getElementById('features');
        if (!featuresSection) return;
        
        const grid = featuresSection.querySelector('.grid');
        if (!grid) return;
        
        // Replace hardcoded features with CMS content
        grid.innerHTML = this.content.agentsFeatures.map(feature => `
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

    // Load About Page Content
    loadAboutContent() {
        if (!this.content.aboutContent) return;
        if (this.getCurrentPage() !== 'about') return;
        
        const content = this.content.aboutContent;
        
        // Load Mission content
        const missionSection = document.getElementById('mission');
        if (missionSection) {
            const paragraphs = missionSection.querySelectorAll('p');
            if (paragraphs.length >= 2) {
                paragraphs[0].textContent = content.mission.p1;
                paragraphs[1].textContent = content.mission.p2;
            }
        }
        
        // Load Vision content
        const visionDiv = document.getElementById('vision');
        if (visionDiv) {
            const paragraphs = visionDiv.querySelectorAll('p');
            if (paragraphs.length >= 2) {
                paragraphs[0].textContent = content.vision.p1;
                paragraphs[1].textContent = content.vision.p2;
            }
        }
        
        // Load "What is Estalara" content
        const whatIsSection = document.getElementById('what-is-estalara');
        if (whatIsSection && content.whatIs) {
            const paragraph = whatIsSection.querySelector('p.body-text');
            if (paragraph) {
                paragraph.textContent = content.whatIs;
            }
        }
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

// Initialize Admin when DOM is loaded AND main.js is ready
// Since scripts are loaded at the end of <body>, DOM may already be ready
(function initAdmin() {
    // Helper function to check if main.js has initialized
    function isMainJsReady() {
        return typeof window.observeReveals === 'function' && 
               typeof window.revealObserver !== 'undefined';
    }
    
    // Initialize EstalaraAdmin with retry mechanism to ensure main.js is ready
    async function initializeWhenReady(retryCount = 0) {
        const maxRetries = 100; // Increased to 5 seconds (100 * 50ms) for slower devices
        
        if (isMainJsReady()) {
            console.log('✅ [CMS] main.js is ready, initializing Firebase adapter...');
            
            // Initialize Firebase adapter first to load data from Firebase
            if (window.cmsFirebaseAdapter && typeof window.cmsFirebaseAdapter.init === 'function') {
                console.log('🔄 [CMS] Initializing Firebase adapter...');
                try {
                    await window.cmsFirebaseAdapter.init();
                    console.log('✅ [CMS] Firebase adapter initialized');
                } catch (error) {
                    console.error('❌ [CMS] Firebase adapter initialization failed:', error);
                    console.warn('⚠️ [CMS] Continuing with localStorage fallback');
                }
            } else {
                console.warn('⚠️ [CMS] Firebase adapter not available, using localStorage fallback');
            }
            
            console.log('✅ [CMS] Creating EstalaraAdmin instance');
            window.estalaraAdmin = new EstalaraAdmin();
        } else if (retryCount < maxRetries) {
            // Log every 20 attempts to avoid console spam
            if (retryCount % 20 === 0 || retryCount < 3) {
                console.log(`⏳ [CMS] Waiting for main.js to initialize (attempt ${retryCount + 1}/${maxRetries})...`);
                console.log('   - observeReveals exists:', typeof window.observeReveals);
                console.log('   - revealObserver exists:', typeof window.revealObserver);
            }
            setTimeout(() => initializeWhenReady(retryCount + 1), 50);
        } else {
            console.error('❌ [CMS] main.js not ready after max retries!');
            console.error('   - This indicates a critical timing issue or script loading problem');
            console.error('   - observeReveals:', typeof window.observeReveals);
            console.error('   - revealObserver:', typeof window.revealObserver);
            console.warn('⚠️ [CMS] Initializing anyway with fallback behavior...');
            
            // Create fallback functions if main.js helpers aren't available
            if (typeof window.observeReveals !== 'function') {
                console.log('🔧 [CMS] Creating fallback observeReveals function');
                window.observeReveals = function(nodes) {
                    // Fallback: immediately activate reveal elements
                    console.log('⚠️ Using fallback observeReveals for', nodes.length, 'nodes');
                    nodes.forEach(el => {
                        el.classList.add('active');
                        el.style.opacity = '1';
                        el.style.transform = 'none';
                    });
                };
            }
            
            if (!window.revealObserver) {
                console.log('🔧 [CMS] Creating fallback revealObserver');
                // Create a minimal IntersectionObserver fallback
                window.revealObserver = {
                    observe: function(el) {
                        el.classList.add('active');
                        el.style.opacity = '1';
                        el.style.transform = 'none';
                    }
                };
            }
            
            // Still try to initialize Firebase adapter even if main.js isn't ready
            if (window.cmsFirebaseAdapter && typeof window.cmsFirebaseAdapter.init === 'function') {
                try {
                    await window.cmsFirebaseAdapter.init();
                } catch (error) {
                    console.error('❌ [CMS] Firebase adapter initialization failed:', error);
                }
            }
            
            window.estalaraAdmin = new EstalaraAdmin();
        }
    }
    
    if (document.readyState === 'loading') {
        // DOM is still loading, wait for DOMContentLoaded
        console.log('📋 [CMS] DOM is loading, waiting for DOMContentLoaded...');
        document.addEventListener('DOMContentLoaded', function() {
            console.log('📋 [CMS] DOMContentLoaded fired, checking main.js readiness...');
            initializeWhenReady();
        });
    } else {
        // DOM is already loaded (interactive or complete), check main.js readiness
        console.log('📋 [CMS] DOM already loaded (state: ' + document.readyState + '), checking main.js readiness...');
        initializeWhenReady();
    }
})();

// =============================================================================
// UTILITY FUNCTIONS FOR MANUAL SYNC AND CACHE MANAGEMENT
// =============================================================================

/**
 * Force refresh content from Firebase and reload the page
 * Use this when you want to ensure the latest CMS changes are loaded
 */
window.forceRefreshFromCMS = async function() {
    console.log('🔄 Force refreshing from Firebase...');
    
    try {
        // Wait for Firebase to be ready
        await window.firebaseReadyPromise;
        
        // Load fresh data from Firebase
        const snapshot = await firebase.database().ref('adminData').once('value');
        const data = snapshot.val();
        
        if (data) {
            // Update localStorage with fresh data
            localStorage.setItem('estalaraAdminData', JSON.stringify(data));
            console.log('✅ Fresh data loaded from Firebase and saved to cache');
            
            // Reload the page to apply changes
            console.log('🔄 Reloading page to apply changes...');
            window.location.reload();
        } else {
            console.warn('⚠️ No data found in Firebase');
            return { success: false, error: 'No data in Firebase' };
        }
    } catch (error) {
        console.error('❌ Failed to refresh from Firebase:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Clear local cache and reload from Firebase
 * Use this when local cache might be corrupted
 */
window.clearCMSCache = function() {
    console.log('🗑️ Clearing CMS cache...');
    
    try {
        localStorage.removeItem('estalaraAdminData');
        console.log('✅ Cache cleared');
        console.log('🔄 Reloading page to fetch fresh data...');
        window.location.reload();
    } catch (error) {
        console.error('❌ Failed to clear cache:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Check sync status between Firebase and local cache
 * Returns information about current data state
 */
window.checkCMSSync = async function() {
    console.log('🔍 Checking CMS sync status...');
    
    const status = {
        firebase: { connected: false, hasData: false, lastUpdated: null },
        localStorage: { hasData: false, lastUpdated: null },
        synced: false
    };
    
    try {
        // Check Firebase
        await window.firebaseReadyPromise;
        status.firebase.connected = true;
        
        const snapshot = await firebase.database().ref('adminData').once('value');
        const firebaseData = snapshot.val();
        
        if (firebaseData) {
            status.firebase.hasData = true;
            status.firebase.lastUpdated = firebaseData.lastUpdated || null;
            status.firebase.buttonText = firebaseData.buttons?.global?.headerCta?.text || firebaseData.buttons?.home?.headerCta?.text || 'Not set';
        }
        
        // Check localStorage
        const localData = localStorage.getItem('estalaraAdminData');
        if (localData) {
            const parsed = JSON.parse(localData);
            status.localStorage.hasData = true;
            status.localStorage.lastUpdated = parsed.lastUpdated || null;
            status.localStorage.buttonText = parsed.buttons?.global?.headerCta?.text || parsed.buttons?.home?.headerCta?.text || 'Not set';
        }
        
        // Compare timestamps
        if (status.firebase.lastUpdated && status.localStorage.lastUpdated) {
            status.synced = status.firebase.lastUpdated === status.localStorage.lastUpdated;
        }
        
        console.log('📊 Sync Status:', status);
        return status;
        
    } catch (error) {
        console.error('❌ Failed to check sync:', error);
        status.error = error.message;
        return status;
    }
};

/**
 * Diagnostic function to check CMS state
 * Call this from browser console to debug property loading issues
 */
window.diagnoseCMS = function() {
    console.log('🔍 ========== CMS DIAGNOSTIC REPORT ==========');
    console.log('');
    
    // Check if EstalaraAdmin instance exists
    console.log('1. EstalaraAdmin Instance:');
    console.log('   - exists:', !!window.estalaraAdmin);
    if (window.estalaraAdmin) {
        console.log('   - content exists:', !!window.estalaraAdmin.content);
        console.log('   - content type:', typeof window.estalaraAdmin.content);
        if (window.estalaraAdmin.content) {
            console.log('   - liveProperties count:', window.estalaraAdmin.content.liveProperties?.length || 0);
            console.log('   - properties count:', window.estalaraAdmin.content.properties?.length || 0);
            console.log('   - pages:', window.estalaraAdmin.content.pages ? Object.keys(window.estalaraAdmin.content.pages).join(', ') : 'none');
        }
    }
    console.log('');
    
    // Check main.js helpers
    console.log('2. Main.js Helpers:');
    console.log('   - observeReveals:', typeof window.observeReveals);
    console.log('   - revealObserver:', typeof window.revealObserver);
    console.log('   - IntersectionObserver:', typeof IntersectionObserver);
    console.log('');
    
    // Check DOM elements
    console.log('3. DOM Elements:');
    const container = document.querySelector('#live-properties .grid');
    console.log('   - #live-properties .grid exists:', !!container);
    if (container) {
        console.log('   - children count:', container.children.length);
        console.log('   - innerHTML length:', container.innerHTML.length);
        console.log('   - Sample child:', container.children[0] ? container.children[0].className : 'none');
    }
    console.log('');
    
    // Check Firebase
    console.log('4. Firebase:');
    console.log('   - firebase object:', typeof firebase);
    console.log('   - cmsFirebaseAdapter:', typeof window.cmsFirebaseAdapter);
    console.log('   - loadAdminDataAsync:', typeof window.loadAdminDataAsync);
    if (window.cmsFirebaseAdapter) {
        console.log('   - initialized:', window.cmsFirebaseAdapter.initialized);
        console.log('   - cache exists:', !!window.cmsFirebaseAdapter.cache);
    }
    console.log('');
    
    // Check localStorage
    console.log('5. LocalStorage:');
    try {
        const stored = localStorage.getItem('estalaraAdminData');
        console.log('   - available:', typeof localStorage !== 'undefined');
        console.log('   - estalaraAdminData exists:', !!stored);
        if (stored) {
            const data = JSON.parse(stored);
            console.log('   - liveProperties count:', data.liveProperties?.length || 0);
            console.log('   - lastUpdated:', data.lastUpdated || 'not set');
        }
    } catch (e) {
        console.log('   - ERROR:', e.message);
    }
    console.log('');
    
    // Check script loading order
    console.log('6. Script Loading:');
    console.log('   - Document ready state:', document.readyState);
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const cmsScript = scripts.find(s => s.src.includes('cms-integration.js'));
    const mainScript = scripts.find(s => s.src.includes('main.js'));
    console.log('   - main.js loaded:', !!mainScript);
    console.log('   - cms-integration.js loaded:', !!cmsScript);
    console.log('');
    
    // Suggest fixes
    console.log('7. Suggested Actions:');
    if (!window.estalaraAdmin) {
        console.log('   ⚠️ EstalaraAdmin not initialized - check console for initialization errors');
    } else if (!window.estalaraAdmin.content) {
        console.log('   ⚠️ Content not loaded - try: window.forceRefreshFromCMS()');
    } else if (!window.estalaraAdmin.content.liveProperties || window.estalaraAdmin.content.liveProperties.length === 0) {
        console.log('   ⚠️ No liveProperties - try: window.forceRefreshFromCMS()');
    } else if (container && container.children.length === 0) {
        console.log('   ⚠️ Properties not rendered - try: window.estalaraAdmin.loadProperties()');
    } else {
        console.log('   ✅ Everything looks good! Properties should be visible.');
    }
    console.log('');
    console.log('🔍 ========== END DIAGNOSTIC REPORT ==========');
    
    return {
        estalaraAdmin: !!window.estalaraAdmin,
        content: !!window.estalaraAdmin?.content,
        livePropertiesCount: window.estalaraAdmin?.content?.liveProperties?.length || 0,
        containerExists: !!container,
        containerChildren: container?.children.length || 0,
        mainJsReady: typeof window.observeReveals === 'function',
        firebaseReady: !!window.cmsFirebaseAdapter?.initialized
    };
};

// Log available utility functions
console.log('🛠️ CMS Sync Utilities Available:');
console.log('  - window.diagnoseCMS() - Run comprehensive diagnostic');
console.log('  - window.forceRefreshFromCMS() - Force reload from Firebase');
console.log('  - window.clearCMSCache() - Clear local cache and reload');
console.log('  - window.checkCMSSync() - Check sync status');

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EstalaraAdmin;
}
