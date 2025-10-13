# Estalara Frontend Code - Complete Extraction & Mapping

## 📋 Overview

This document provides a comprehensive mapping of the Estalara frontend architecture, extracted from the current codebase. It includes all HTML pages, JavaScript modules, styling systems, and integration points.

---

## 🗂️ Frontend File Structure

### HTML Pages (Main Website)
```
/
├── index.html              # Homepage with hero, features, LIVE properties
├── agents.html             # For Real Estate Agents landing page
├── agencies.html           # For Agencies landing page  
├── investors.html          # For Investors landing page
├── about.html              # About Estalara page
├── faq.html                # Frequently Asked Questions
├── privacy.html            # Privacy Policy
└── terms.html              # Terms of Service
```

### HTML Pages (CMS & Admin)
```
/
├── cms.html                # Full CMS dashboard for content management
├── cms-login.html          # CMS authentication page
├── admin.html              # Admin panel (alternative entry point)
├── admin-login.html        # Admin authentication
└── admin/
    └── index.html          # Admin directory index
```

### JavaScript Files
```
/
├── main.js                 # Core frontend functionality (animations, menu, effects)
├── cms-integration.js      # CMS backend integration and data management
├── cms.js                  # CMS dashboard UI logic
└── scripts/
    └── seo/
        ├── crawl-site.js           # SEO crawler
        ├── validate-sitemaps.js    # Sitemap validation
        ├── check-performance.sh    # Performance checks
        ├── lighthouse-audit.sh     # Lighthouse audits
        └── run-all-audits.sh       # Run all SEO audits
```

### Assets & Media
```
/assets/
├── EstalaraLogo.png        # Primary logo
├── EstalaraLogo-alt.png    # Alternative logo
├── icon-192x192.png        # PWA icon (192x192)
├── icon-512x512.png        # PWA icon (512x512)
├── apple-touch-icon.png    # iOS app icon (180x180)
├── favicon-32x32.png       # Favicon 32x32
├── favicon-16x16.png       # Favicon 16x16
├── og-image-home.jpg       # Open Graph image (homepage)
├── og-image-agents.jpg     # Open Graph image (agents page)
├── og-image-agencies.jpg   # Open Graph image (agencies page)
├── og-image-investors.jpg  # Open Graph image (investors page)
└── og-image-about.jpg      # Open Graph image (about page)
```

### Configuration Files
```
/
├── manifest.json           # PWA manifest
├── robots.txt              # Search engine robots file
├── sitemap.xml             # Main sitemap
├── sitemap-video.xml       # Video sitemap
└── netlify.toml            # Netlify deployment config
```

---

## 🎨 Design System

### Color Palette
```css
:root {
    --black: #000000;    /* Primary - backgrounds, text */
    --white: #FFFFFF;    /* Secondary - text, cards, highlights */
    --gray: #F5F5F5;     /* Accent - subtle backgrounds, dividers */
}
```

**Design Philosophy**: Strictly monochromatic black and white for maximum clarity and high contrast.

### Typography
```css
/* Display Font - Headlines and hero text */
font-family: 'Playfair Display', serif;

/* Body Font - Body text and UI elements */
font-family: 'Inter', sans-serif;

/* Monospace - Technical elements */
font-family: 'JetBrains Mono', monospace;
```

### Typography Scale
```css
/* Hero Text */
.hero-text {
    font-size: clamp(4rem, 8vw, 8rem);
    line-height: 0.9;
    font-weight: 900;
}

/* Section Headers */
.section-text {
    font-size: clamp(2rem, 4vw, 4rem);
    line-height: 1.1;
    font-weight: 700;
}

/* Body Text */
.body-text {
    font-size: clamp(1rem, 2vw, 1.25rem);
    line-height: 1.6;
}
```

### Visual Effects & Animation Libraries
```javascript
// Animation stack
- Anime.js          // Smooth animations and transitions
- Typed.js          // Typewriter effects for headlines
- Splitting.js      // Text animation effects
- p5.js             // Background particle systems
- Pixi.js           // Interactive visual elements
- ECharts.js        // Clean data visualizations
- Splide            // Image carousels and sliders
```

---

## 🧩 Core JavaScript Functionality

### main.js - Core Features

#### 1. Particle Background System (p5.js)
```javascript
// Generates animated particle background with connections
- 50 particles with random movement
- Particle connections within 100px distance
- Wrapping at screen edges
- Responsive to window resize
```

#### 2. Typewriter Effect (Typed.js)
```javascript
// Animated hero text
const typed = new Typed('#typed-text', {
    strings: ['Go LIVE.', 'Go GLOBAL.'],
    typeSpeed: 100,
    backSpeed: 50,
    backDelay: 2000,
    loop: true
});
```

#### 3. Scroll Reveal Animation
```javascript
// Elements fade in as they enter viewport
- Uses IntersectionObserver API
- threshold: 0.1
- rootMargin: '0px 0px -50px 0px'
- Adds 'active' class when visible
- Staggered delays (index * 0.1s)
```

#### 4. Mobile Hamburger Menu
```javascript
// Comprehensive mobile menu with:
- Focus trap for accessibility
- Scroll lock when open
- Escape key to close
- Touch event handling
- Hamburger icon animation
- ARIA attributes
- Overlay click to close
- Responsive to viewport resize
```

#### 5. Card Hover Effects (Anime.js)
```javascript
// Feature cards and property cards
- Scale to 1.05 on hover
- Smooth easing (easeOutQuart)
- 300ms duration
```

#### 6. Smooth Scrolling
```javascript
// For anchor links
- Smooth scroll behavior
- Prevents default jump
```

#### 7. Parallax Effect
```javascript
// Hero section parallax on scroll
hero.style.transform = `translateY(${scrolled * 0.5}px)`;
```

#### 8. Lazy Loading Images
```javascript
// Images with data-src attribute
- Uses IntersectionObserver
- Loads when entering viewport
```

---

## 🔌 CMS Integration (cms-integration.js)

### EstalaraAdmin Class

#### Core Methods

**Content Management:**
```javascript
loadContent()              // Load from localStorage or defaults
saveContent()              // Save to localStorage
resetContent()             // Reset to defaults
```

**Property Management:**
```javascript
getLiveProperties()        // Get LIVE properties list
saveLiveProperties(props)  // Save LIVE properties
addLiveProperty(property)  // Add new property
updateLiveProperty(id, property)  // Update existing
deleteLiveProperty(id)     // Delete property
```

**Page Management:**
```javascript
getPageContent(pageId)     // Get page-specific content
updatePageContent(pageId, content)  // Update page content
getPages()                 // Get all pages list
```

**Page Structure:**
```javascript
getPageStructure(pageId)   // Get page section structure
updatePageStructure(pageId, structure)  // Update structure
toggleSectionVisibility(pageId, sectionId)  // Show/hide sections
addSection(pageId, sectionData)  // Add new section
removeSection(pageId, sectionId)  // Remove section
reorderSections(pageId, newOrder)  // Change section order
applyPageStructure(pageId)  // Apply visibility settings
```

**Settings Management:**
```javascript
getSettings()              // Get CMS settings
updateSettings(settings)   // Update settings
getLogoUrl()               // Get current logo URL
updateLogoUrl(url)         // Update logo URL
```

**Media Management:**
```javascript
getMediaLibrary()          // Get all media files
addMedia(mediaItem)        // Add media file
deleteMedia(id)            // Delete media file
```

#### Dynamic Content Loading

**loadDynamicContent()** injects CMS content into pages:
- Site logo
- Hero sections
- LIVE Properties grid
- Page-specific content
- Contact information

### Default Content Structure
```javascript
{
    version: 4,
    siteTitle: "Estalara - Go LIVE. Go GLOBAL.",
    siteDescription: "Estalara connects real estate agents...",
    contactEmail: "estalara@estalara.com",
    logoUrl: "assets/EstalaraLogo.png",
    heroTitle: "Go LIVE. Go GLOBAL.",
    heroSubtitle: "Estalara connects real estate agents...",
    
    // LIVE Properties (main property list)
    liveProperties: [
        {
            id: 1,
            title: "Modern Apartment in Cádiz",
            location: "Cádiz, Spain",
            price: 450000,
            image: "https://...",
            description: "Stunning property...",
            link: "https://app.estalara.com/..."
        },
        // ... more properties
    ],
    
    // Page structures
    pageStructures: {
        home: [...],
        agents: [...],
        agencies: [...],
        investors: [...],
        about: [...]
    },
    
    // Page-specific content
    pages: {
        home: { ... },
        agents: { ... },
        agencies: { ... },
        investors: { ... },
        about: { ... }
    }
}
```

---

## 📄 HTML Page Structure

### Typical Page Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Meta tags (SEO optimized) -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Primary Meta Tags -->
    <title>Page Title | Estalara</title>
    <meta name="description" content="...">
    <meta name="keywords" content="...">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://estalara.com/">
    <meta property="og:title" content="...">
    <meta property="og:image" content="...">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    
    <!-- Hreflang (International) -->
    <link rel="alternate" hreflang="en" href="...">
    <link rel="alternate" hreflang="es" href="...">
    <link rel="alternate" hreflang="fr" href="...">
    
    <!-- Favicons & PWA -->
    <link rel="icon" href="/assets/EstalaraLogo.png">
    <link rel="manifest" href="/manifest.json">
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display...">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Animation Libraries -->
    <script src=".../anime.min.js"></script>
    <script src=".../typed.min.js"></script>
    <script src=".../p5.min.js"></script>
    <script src=".../splide.min.js"></script>
    
    <!-- Custom Styles -->
    <style>
        /* Inline critical CSS */
    </style>
</head>
<body>
    <!-- Particle Background -->
    <div id="particle-bg" class="particle-bg"></div>
    
    <!-- Header / Navigation -->
    <header class="fixed top-0 left-0 w-full z-50 bg-black">
        <nav class="max-w-7xl mx-auto px-6 py-4">
            <!-- Logo -->
            <a href="/">
                <img id="site-logo" src="assets/EstalaraLogo.png" alt="Estalara">
            </a>
            
            <!-- Desktop Navigation -->
            <ul class="hidden md:flex">
                <li><a href="/">Home</a></li>
                <li><a href="/agents.html">For Agents</a></li>
                <li><a href="/agencies.html">For Agencies</a></li>
                <li><a href="/investors.html">For Investors</a></li>
                <li><a href="/about.html">About</a></li>
            </ul>
            
            <!-- Mobile Hamburger -->
            <button id="menu-toggle" class="md:hidden">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </nav>
        
        <!-- Mobile Menu -->
        <div id="mobile-menu" class="hidden md:hidden">
            <!-- Mobile navigation links -->
        </div>
    </header>
    
    <!-- Main Content -->
    <main>
        <!-- Hero Section -->
        <section id="home" class="min-h-screen">
            <h1 class="hero-text font-display">
                <span id="typed-text"></span>
            </h1>
        </section>
        
        <!-- Feature Sections -->
        <section id="features" class="py-32 reveal">
            <!-- Content -->
        </section>
        
        <!-- LIVE Properties Section -->
        <section id="live-properties" class="py-32 reveal">
            <div id="properties-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Dynamically loaded by CMS -->
            </div>
        </section>
        
        <!-- CTA Section -->
        <section id="cta" class="py-32 reveal">
            <!-- Call to action -->
        </section>
    </main>
    
    <!-- Footer -->
    <footer class="bg-black text-white py-16">
        <div class="max-w-7xl mx-auto px-6">
            <!-- Footer content -->
        </div>
    </footer>
    
    <!-- Scripts -->
    <script src="cms-integration.js"></script>
    <script src="main.js"></script>
</body>
</html>
```

---

## 🎯 Key UI Components

### 1. Navigation Header
```html
<header class="fixed top-0 left-0 w-full z-50 bg-black">
    <!-- Solid black background, always on top -->
</header>
```

**Features:**
- Fixed positioning
- Responsive (desktop + mobile)
- Hamburger menu for mobile
- Logo linked to homepage
- CTA button to app.estalara.com

### 2. Hero Section
```html
<section id="home" class="min-h-screen flex items-center justify-center">
    <h1 class="hero-text font-display">
        <span id="typed-text"></span>
    </h1>
</section>
```

**Features:**
- Full viewport height
- Typewriter animation
- Particle background
- Parallax effect on scroll

### 3. LIVE Properties Grid
```html
<div id="properties-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    <!-- Property cards injected by CMS -->
</div>
```

**Property Card Structure:**
```html
<div class="property-card p-6">
    <img src="..." alt="..." loading="lazy">
    <div class="live-badge">LIVE</div>
    <h3 class="text-2xl font-bold">{title}</h3>
    <p class="text-gray-600">{location}</p>
    <p class="text-3xl font-bold">€{price}</p>
    <p>{description}</p>
    <a href="{link}" class="btn-primary">View Property</a>
</div>
```

### 4. Feature Cards
```html
<div class="card-hover bg-white text-black p-8">
    <h3 class="text-2xl font-bold mb-4">{title}</h3>
    <p>{description}</p>
</div>
```

**Features:**
- Hover scale animation (1.05)
- Box shadow on hover
- Clean borders

### 5. Call-to-Action Buttons
```html
<!-- Primary Button (White on Black) -->
<a href="..." class="btn-primary px-8 py-4 text-lg font-semibold">
    Get Started
</a>

<!-- Secondary Button (Black on White) -->
<a href="..." class="btn-secondary px-8 py-4 text-lg font-semibold">
    Learn More
</a>
```

---

## 🔧 CMS Dashboard Structure

### CMS Sections (cms.html)

1. **Dashboard** - Overview with stats and activity
2. **Properties** - Manage LIVE properties (add/edit/delete)
3. **Pages** - Edit content for all pages
4. **Page Structure** - Manage page sections (show/hide/reorder)
5. **Media Library** - Upload and manage images
6. **Users** - User management
7. **Settings** - Site-wide settings (logo, contact info, etc.)

### CMS Authentication (cms-login.html)
```javascript
// Demo credentials
username: "admin"
password: "demo123"

// Session stored in localStorage
```

---

## 📱 Responsive Design

### Breakpoints (Tailwind)
```
sm:  640px   // Small devices
md:  768px   // Tablets
lg:  1024px  // Laptops
xl:  1280px  // Desktops
2xl: 1536px  // Large screens
```

### Mobile Menu Behavior
- Hidden by default on mobile
- Hamburger icon visible < 768px
- Full-screen overlay when open
- Scroll lock when open
- Focus trap for accessibility
- Animated hamburger icon (3 lines → X)

---

## 🚀 Performance Optimizations

### 1. Image Loading
- Lazy loading with `loading="lazy"` attribute
- IntersectionObserver for `data-src` images
- WebP format recommended

### 2. Font Loading
- Preconnect to font CDNs
- `display=swap` for font-face

### 3. Asset Loading
- Preconnect to CDNs
- Async script loading where possible

### 4. Animation Performance
- CSS transforms (GPU-accelerated)
- RequestAnimationFrame for smooth animations
- Debounced scroll and resize events

---

## 🌐 SEO Implementation

### Meta Tags (Every Page)
- Primary meta tags (title, description, keywords)
- Open Graph tags (Facebook)
- Twitter Card tags
- Canonical URLs
- Hreflang tags (en, es, fr, de)

### Schema Markup
- Organization schema
- Website schema
- Service schema
- Breadcrumb schema
- Property schema (for listings)
- FAQ schema (on FAQ page)

### Sitemaps
- `sitemap.xml` - Main sitemap
- `sitemap-video.xml` - Video sitemap
- `robots.txt` - Search engine directives

### PWA Features
- `manifest.json` for installability
- Icons (192x192, 512x512)
- Apple touch icons
- Theme color

---

## 🔐 LocalStorage Data Structure

### Storage Keys
```javascript
localStorage.setItem('estalaraAdminData', JSON.stringify({
    version: 4,
    siteTitle: "...",
    logoUrl: "...",
    liveProperties: [...],
    pageStructures: {...},
    pages: {...},
    settings: {...},
    mediaLibrary: [...]
}));

localStorage.setItem('estalaraAuth', JSON.stringify({
    isLoggedIn: true,
    username: "admin",
    role: "admin",
    loginTime: Date.now()
}));
```

---

## 🎬 Animation Sequences

### Page Load Sequence
1. Particle background initializes
2. Hero text typewriter starts
3. Scroll reveal elements fade in (staggered)
4. Property cards animate in
5. All interactive elements ready

### Scroll Animations
- Elements with `.reveal` class fade in when visible
- Parallax effect on hero section
- Navbar stays solid black (no transparency changes)

---

## 🧪 Testing & Debug

### Debug Features
- Console logging in CMS integration
- Performance monitoring
- Mobile incognito detection
- Storage availability checks

### Test Pages
- `test-mobile-menu.html` - Mobile menu testing
- `test-logo-system.html` - Logo system testing
- `debug.html` - General debugging
- `diagnose-cms-data.html` - CMS data inspection

---

## 📦 Dependencies (CDN)

### CSS Frameworks
```html
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Splide CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css">

<!-- Splitting CSS -->
<link rel="stylesheet" href="https://unpkg.com/splitting@1.0.6/dist/splitting.css">
```

### JavaScript Libraries
```html
<!-- Animation -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/typed.js/2.0.12/typed.min.js"></script>
<script src="https://unpkg.com/splitting@1.0.6/dist/splitting.js"></script>

<!-- Graphics -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js"></script>

<!-- UI -->
<script src="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js"></script>
```

### Fonts
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## 🔄 Data Flow

### Content Update Flow
```
CMS Dashboard (cms.html)
    ↓
CMS Integration (cms-integration.js)
    ↓
localStorage (estalaraAdminData)
    ↓
Page Load (index.html, agents.html, etc.)
    ↓
Dynamic Injection (DOM manipulation)
    ↓
User sees updated content
```

### Property Management Flow
```
1. Admin adds property in CMS
2. Property saved to liveProperties array
3. localStorage updated
4. Homepage automatically shows new property
5. Grid regenerated with animations
```

---

## 🎯 Key Features Summary

### Frontend Features
✅ Fully responsive (mobile-first)  
✅ Black & white minimalist design  
✅ Particle background animations  
✅ Typewriter hero effect  
✅ Scroll reveal animations  
✅ Property card hover effects  
✅ Mobile hamburger menu with accessibility  
✅ Smooth scrolling  
✅ Lazy image loading  
✅ PWA ready  
✅ SEO optimized  

### CMS Features
✅ Property management (CRUD)  
✅ Page content editing  
✅ Page structure management  
✅ Logo upload  
✅ Media library  
✅ Settings panel  
✅ User management  
✅ Real-time preview  
✅ localStorage persistence  
✅ Mobile responsive admin  

---

## 📝 Code Examples

### Adding a New Page Section
```javascript
// In CMS
const newSection = {
    id: 'custom-features',
    type: 'section',
    title: 'Custom Features',
    visible: true,
    order: 5,
    editable: true
};

window.estalaraAdmin.addSection('home', newSection);
```

### Loading Page Content
```javascript
// Get page content
const homeContent = window.estalaraAdmin.getPageContent('home');

// Update specific field
homeContent.heroTitle = "New Hero Title";
window.estalaraAdmin.updatePageContent('home', homeContent);
```

### Adding a Property
```javascript
const newProperty = {
    title: "Villa in Marbella",
    location: "Marbella, Spain",
    price: 1500000,
    image: "https://...",
    description: "Luxury villa...",
    link: "https://app.estalara.com/..."
};

window.estalaraAdmin.addLiveProperty(newProperty);
```

---

## 🚢 Deployment Checklist

### Pre-deployment
- [ ] All meta tags configured
- [ ] Open Graph images created (1200x630px)
- [ ] Favicons generated
- [ ] Sitemap updated
- [ ] robots.txt configured
- [ ] Analytics installed (GA4)
- [ ] Search Console verified
- [ ] All links tested
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing complete

### Post-deployment
- [ ] Submit sitemap to Google
- [ ] Submit sitemap to Bing
- [ ] Test PWA installation
- [ ] Verify schema markup
- [ ] Test mobile menu
- [ ] Check page load speed
- [ ] Verify CMS functionality

---

## 📞 Integration Points

### External Links
- `https://app.estalara.com` - Main application
- Property detail pages: `https://app.estalara.com/listing/{id}`
- CTA buttons link to app for sign-up

### API Endpoints (Future)
Currently using localStorage. For production, connect to:
- `POST /api/properties` - Create property
- `GET /api/properties` - List properties
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property
- `POST /api/pages` - Update page content
- `POST /api/media` - Upload media

---

## 🎓 Developer Notes

### Code Style
- ES6+ JavaScript
- Modular structure
- Descriptive variable names
- Comprehensive comments
- Error handling with try-catch
- Console logging for debugging

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6 support required
- IntersectionObserver API required
- localStorage required

### Known Issues
- localStorage not available in incognito mode (fallback to defaults)
- Particle background may be heavy on low-end devices
- Some animations disabled on reduced motion preference

---

## 📚 Documentation Files

Complete project documentation:
- `FRONTEND_CODE_EXTRACTION.md` - This file
- `CMS_IMPLEMENTATION_GUIDE.md` - CMS usage guide
- `IMPLEMENTATION_GUIDE.md` - SEO implementation
- `PAGE_STRUCTURE_GUIDE.md` - Page structure editor
- `design.md` - Design system
- `README.md` - Project overview

---

**Last Updated:** 2025-10-13  
**Version:** 1.0  
**Project:** Estalara Frontend  
**Branch:** cursor/extract-frontend-code-545f
