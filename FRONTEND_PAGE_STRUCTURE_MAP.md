# ESTALARA FRONTEND - COMPLETE PAGE STRUCTURE MAP

**Document Created:** 2025-10-13  
**Website:** Estalara - Global Real Estate Platform  
**Company:** Time2Show, Inc.

---

## TABLE OF CONTENTS
1. [Home Page (index.html)](#1-home-page-indexhtml)
2. [About Page (about.html)](#2-about-page-abouthtml)
3. [For Agencies Page (agencies.html)](#3-for-agencies-page-agencieshtml)
4. [For Agents Page (agents.html)](#4-for-agents-page-agentshtml)
5. [FAQ Page (faq.html)](#5-faq-page-faqhtml)
6. [For Investors Page (investors.html)](#6-for-investors-page-investorshtml)
7. [Privacy Policy Page (privacy.html)](#7-privacy-policy-page-privacyhtml)
8. [Terms of Service Page (terms.html)](#8-terms-of-service-page-termshtml)

---

## 1. HOME PAGE (index.html)

### NAVIGATION HEADER (Global - appears on all pages)
**Section ID:** `header`
- **Logo:** `assets/EstalaraLogo.png` - "ESTALARA" 
- **Navigation Links:**
  - Home
  - For Agents
  - For Agencies
  - For Investors
  - About
  - LIVE Properties (mobile only)
  - Launch App (button)

### HERO SECTION
**Section ID:** `#home`
- **Background:** Particle animation (p5.js)
- **Main Heading:** Typed animation with text "Go LIVE. Go GLOBAL."
- **Body Text:** "Estalara connects real estate agents and global investors through AI and live experiences. Go LIVE. Go GLOBAL. Close deals faster than ever before."
- **CTA Buttons:**
  - "Explore Estalara App →" (links to app.estalara.com)
  - "How It Works" (anchor link)
- **Graphics:** Particle background effect

### HOW IT WORKS SECTION
**Section ID:** `#how-it-works`
- **Heading:** "How It Works"
- **Subheading:** "Three simple steps to revolutionize your real estate experience"
- **Cards (3):**
  1. **Go Live**
     - Icon: Numbered circle "1"
     - Text: "Stream your properties to global investors in real-time with our advanced livestreaming technology."
  2. **Connect**
     - Icon: Numbered circle "2"
     - Text: "Engage with verified investors through AI-powered matching and instant translation capabilities."
  3. **Close Fast**
     - Icon: Numbered circle "3"
     - Text: "Complete transactions efficiently with our trusted network and streamlined processes."

### LIVE PROPERTIES SECTION
**Section ID:** `#live-properties`
- **Background:** White
- **Heading:** "LIVE Properties"
- **Subheading:** "Discover properties currently available on our platform"
- **Content:** Dynamically loaded property cards from CMS (localStorage)
- **CTA Button:** "View All Properties →" (links to app.estalara.com)
- **Note:** Properties loaded via cms-integration.js

### FEATURES SECTION
**Section ID:** `#features`
- **Heading:** "Powerful Features"
- **Subheading:** "Advanced technology designed for modern real estate professionals"
- **Feature Cards (4):**
  1. **EstalaraAI**
     - Icon: 🤖 emoji
     - Text: "Natural language property assistant with hallucination-free responses"
  2. **Livestream Shows**
     - Icon: 📺 emoji
     - Text: "Real-time 1-to-many property presentations with instant lead identification"
  3. **Auto Ads**
     - Icon: 🎯 emoji
     - Text: "AI-driven targeting that brings foreign investors directly to listings"
  4. **Legal Network**
     - Icon: ⚖️ emoji
     - Text: "Trusted notaries, title insurance, and transaction support"

### CTA SECTION
- **Background:** White
- **Heading:** "Join the Future of Global Real Estate"
- **Body Text:** "Whether you're an agent looking to expand globally or an investor seeking international opportunities, Estalara provides the platform you need to succeed."
- **CTA Button:** "Start on Estalara App →"

### FOOTER (Global - appears on all pages)
**Section:** `footer`
- **Logo:** `assets/EstalaraLogo.png`
- **Company Info:**
  - Time2Show, Inc., Dover, DE, USA
  - Email: estalara@estalara.com
- **Links:**
  - FAQ
  - Privacy Policy
  - Terms of Service
  - LinkedIn
  - TikTok
  - Instagram

---

## 2. ABOUT PAGE (about.html)

### HERO SECTION
- **Heading:** "Revolutionizing GLOBAL REAL ESTATE"
- **Body Text:** "Estalara connects real estate agents and international investors through AI and live experiences. Our mission is to simplify global property transactions and make international real estate accessible to everyone."
- **CTA Buttons:**
  - "Join Our Platform →"
  - "Our Story"

### MISSION & VISION SECTION
**Background:** White
- **Two-Column Layout:**

  **Column 1 - Our Mission:**
  - **Heading:** "Our Mission"
  - **Text:** "To democratize global real estate investment by removing barriers, simplifying processes, and creating transparent connections between agents and investors worldwide. We believe everyone should have access to international property opportunities regardless of their location."
  - **Additional Text:** "Through cutting-edge AI technology and immersive live experiences, we're transforming how properties are discovered, evaluated, and purchased across borders."

  **Column 2 - Our Vision:**
  - **Heading:** "Our Vision"
  - **Text:** "To become the world's leading platform for global real estate transactions, where agents and investors connect seamlessly across continents. We envision a future where buying property in another country is as simple as shopping online."
  - **Additional Text:** "By 2030, we aim to facilitate over $100 billion in international real estate transactions, making global property investment accessible to millions of people worldwide."

### OUR CORE VALUES SECTION
- **Heading:** "Our Core Values"
- **Subheading:** "The principles that guide everything we do at Estalara"
- **Value Cards (4):**
  1. **Global Accessibility**
     - Icon: 🌐 emoji
     - Text: "Breaking down barriers to make international real estate accessible to everyone, everywhere."
  2. **Transparency**
     - Icon: 🔍 emoji
     - Text: "Clear, honest information about properties, processes, and costs with no hidden fees or surprises."
  3. **Trust**
     - Icon: 🤝 emoji
     - Text: "Building confidence through verified properties, trusted partners, and secure transactions."
  4. **Innovation**
     - Icon: ⚡ emoji
     - Text: "Continuously advancing our technology to make global real estate faster, easier, and more efficient."

### WHAT IS ESTALARA SECTION
**Background:** White
- **Heading:** "What is Estalara?"
- **Intro Text:** "Estalara is the game-changer our industry has been waiting for. After years of watching good deals fall through because of distance, language barriers, and outdated processes, we built something that actually works for everyone involved."
- **Two-Column Layout:**

  **Column 1 - For Agents:**
  - **Heading:** "For Agents"
  - **Paragraphs (3):** Detailed description of agent benefits including livestreaming, AI lead generation, and international transaction support

  **Column 2 - For Investors:**
  - **Heading:** "For Investors"
  - **Paragraphs (3):** Detailed description of investor benefits including property tours, AI assistance, and verified agents

### OUR STORY SECTION
**Section ID:** `#story`
- **Heading:** "Our Story"
- **Subheading:** "From a simple idea to a global platform transforming real estate"
- **Timeline (3 milestones):**
  1. **2023 - The Beginning**
     - Text: Company founding in Dover, Delaware
  2. **2024 - Platform Launch**
     - Stats: €100M+ in transactions, 1,000+ agents, 10,000+ investors
  3. **2025 - Global Expansion**
     - Stats: 50+ countries, 25+ languages, €2.5B+ in transactions

### LEADERSHIP TEAM SECTION
- **Heading:** "Leadership Team"
- **Subheading:** "Experienced professionals driving Estalara's vision forward"
- **Team Cards (3):**
  1. **Alex Thompson** - CEO & Co-Founder
     - Avatar placeholder (gray circle)
     - Bio: 15+ years in real estate technology
  2. **Maria Rodriguez** - CTO & Co-Founder
     - Avatar placeholder (gray circle)
     - Bio: AI and machine learning expert
  3. **David Kim** - Head of Global Operations
     - Avatar placeholder (gray circle)
     - Bio: International business strategist

### OUR IMPACT (STATISTICS) SECTION
**Background:** White
- **Heading:** "Our Impact"
- **Subheading:** "Numbers that reflect our commitment to transforming global real estate"
- **Stats Grid (4):**
  - 50+ Countries Served
  - €2.5B+ Transaction Value
  - 10K+ Active Users
  - 25+ Languages

### GET IN TOUCH SECTION
- **Heading:** "Get in Touch"
- **Body Text:** "Have questions about Estalara? We're here to help you navigate the world of global real estate investment."
- **Two Cards:**
  1. **Company Information**
     - Time2Show, Inc.
     - Dover, DE, USA
     - estalara@estalara.com
  2. **Support & Help**
     - Technical Support: support@estalara.com
     - Agent Inquiries: agents@estalara.com
     - Investor Support: investors@estalara.com

### READY TO JOIN CTA SECTION
**Background:** White
- **Heading:** "Ready to Join the Future?"
- **Body Text:** Description encouraging agents and investors to join
- **CTA Buttons:**
  - "Start Your Journey →"
  - "Explore Properties"

---

## 3. FOR AGENCIES PAGE (agencies.html)

### HERO SECTION
- **Heading:** "Agencies Go ENTERPRISE"
- **Body Text:** "Transform your real estate agency into a global powerhouse. Scale operations, manage multiple agents, and expand internationally with Estalara's enterprise solutions designed for growing agencies."
- **CTA Buttons:**
  - "Scale Your Agency →"
  - "Explore Solutions"

### LIVE SELLING & SOCIAL MEDIA SECTION
**Section ID:** `#agency-live-selling`
**Background:** White
- **Icon Placeholder:** `#agency-section1-icon` (CMS-driven)
- **Image Placeholder:** `#agency-section1-image` (CMS-driven)
- **Heading:** "Live selling meets social media"
- **Body Text:** "Live tours and real‑time interaction build trust. Modern buyers spend hours researching homes online, and authentic livestreams let them ask questions and feel the space before they visit. Short vertical clips on TikTok, Instagram and YouTube are becoming the new search engine for property discovery. When you broadcast real tours and behind‑the‑scenes insights, you attract clients who are ready to buy."

### WHITE-LABEL OFFER SECTION (IDOL BRANDS)
**Section ID:** `#agency-white-label-offer`
- **Heading:** "Idol Brands — White label for real estate agencies"
- **Subtitle:** "We offer dedicated white label implementations — your brand, our technology. Launch a complete live commerce and social video platform under your agency's branding: on your own domain, with custom visual identity and configuration tailored to your sales processes."
- **Two-Column Layout:**

  **Column 1 - What you get:**
  - Your own branding: logo, colors, domain/subdomain
  - Branded livestreams and short‑videos
  - Agent and manager panels with permissions
  - CRM/MLS integrations and Single Sign‑On (SSO)

  **Column 2 - Why it works:**
  - Greater customer trust through consistent branding
  - Faster implementations and feature roadmap
  - SLA, training and Enterprise support
  - Security and compliance (GDPR), scalable infrastructure

- **Contact Info:**
  - Label: "Enterprise Cooperation"
  - Email: peter@estalara.com

### ENTERPRISE STATS SECTION
**Background:** White
- **Stats Grid (4):**
  - 500+ Partner Agencies
  - 10K+ Agents Empowered
  - 50+ Countries Served
  - €2.5B+ Agency Volume

### ENTERPRISE FEATURES SECTION
**Section ID:** `#enterprise-features`
- **Heading:** "Enterprise Solutions for Growing Agencies"
- **Subheading:** "Comprehensive tools and features designed to help real estate agencies scale operations and expand globally"
- **Feature Cards (6):**
  1. **Multi-Agent Management** (🏢 icon)
     - Description + 4 bullet points
  2. **Global Market Access** (🌐 icon)
     - Description + 4 bullet points
  3. **Advanced Analytics** (📊 icon)
     - Description + 4 bullet points
  4. **White-Label Solutions** (🔧 icon)
     - Description + 4 bullet points
  5. **Automated Workflows** (⚡ icon)
     - Description + 4 bullet points
  6. **Partnership Network** (🤝 icon)
     - Description + 4 bullet points

---

## 4. FOR AGENTS PAGE (agents.html)

### HERO SECTION
- **Heading:** "Agents Go GLOBAL"
- **Body Text:** "Attract and convert high-value global investors effortlessly. Livestream your listings and engage verified buyers in real time with AI-powered lead generation and automatic landing pages."
- **CTA Buttons:**
  - "Start Livestreaming →"
  - "Explore Features"

### STATS SECTION
**Background:** White
- **Stats Grid (4):**
  - 500+ Active Agents
  - 10K+ Global Investors
  - €2.5B+ Property Value
  - 95% Close Rate

### FEATURES SECTION
**Section ID:** `#features`
- **Heading:** "Everything You Need to Succeed"
- **Subheading:** "Powerful tools designed specifically for real estate agents to expand their global reach"
- **Feature Cards (6):**
  1. **Live Property Shows** (📺 icon)
     - Description + 4 bullet points (HD video, translation, lead capture, follow-up)
  2. **AI Lead Generation** (🤖 icon)
     - Description + 4 bullet points (analysis, matching, scoring, notifications)
  3. **Global Reach** (🌐 icon)
     - Description + 4 bullet points (25+ languages, translation, currency, insights)
  4. **Mobile Studio** (📱 icon)
     - Description + 4 bullet points (one-tap, filters, stabilization, multi-device)
  5. **Smart Analytics** (📊 icon)
     - Description + 4 bullet points (metrics, conversion, insights, ROI)
  6. **Instant Matching** (⚡ icon)
     - Description + 4 bullet points (alerts, scoring, automation, scheduling)

### HOW IT WORKS / SUCCESS JOURNEY SECTION
**Background:** White
- **Heading:** "Your Success Journey"
- **Subheading:** "From signup to closing deals - your path to global real estate success"
- **Process Steps (4):**
  1. **Sign Up** - Create profile and verify credentials
  2. **List Properties** - Upload listings with photos
  3. **Go Live** - Stream to global investors
  4. **Close Deals** - Convert leads to sales

### TESTIMONIALS SECTION
- **Heading:** "What Agents Say"
- **Subheading:** "Hear from real estate professionals who transformed their business with Estalara"
- **Testimonial Cards (3):**
  1. **Maria Rodriguez** - Madrid, Spain
     - Avatar placeholder
     - Quote about business transformation
  2. **James Chen** - London, UK
     - Avatar placeholder
     - Quote about AI lead generation
  3. **Sophia Laurent** - Paris, France
     - Avatar placeholder
     - Quote about livestreaming

### CTA SECTION
**Background:** White
- **Heading:** "Ready to Go Global?"
- **Body Text:** "Join thousands of agents who are already expanding their reach and closing more deals with Estalara. Start your journey today."
- **CTA Buttons:**
  - "Start Livestreaming →"
  - "Learn About Investors"

---

## 5. FAQ PAGE (faq.html)

### HERO SECTION
**Section ID:** `#hero`
- **Heading:** "Frequently Asked Questions"
- **Subheading:** "Find answers to common questions about Estalara's global real estate platform."

### GENERAL QUESTIONS SECTION
**Section ID:** `#general-questions`
- **Heading:** "General Questions"
- **FAQ Items (4):**
  1. How does Estalara work?
  2. Is Estalara available in my country?
  3. What languages does Estalara support?
  4. What is EstalaraAI?

### FOR AGENTS SECTION
**Section ID:** `#for-agents`
- **Heading:** "For Agents"
- **FAQ Items (5):**
  1. How do I get started as an agent on Estalara?
  2. What are the costs for real estate agents?
  3. How does the AI lead generation work?
  4. Do I need special equipment for livestreaming?
  5. How do I handle international transactions?

### FOR INVESTORS SECTION
**Section ID:** `#for-investors`
- **Heading:** "For Investors"
- **FAQ Items (5):**
  1. How secure are international property transactions on Estalara?
  2. Can I watch property tours if I can't attend live?
  3. What happens after I express interest in a property?
  4. Are there any fees for investors?
  5. Do you provide financing assistance?

### TECHNICAL & SUPPORT SECTION
**Section ID:** `#technical-support`
- **Heading:** "Technical & Support"
- **FAQ Items (3):**
  1. Is there a mobile app?
  2. How do I contact support?
  3. What are your privacy and data policies?

### CTA SECTION
**Section ID:** `#cta`
**Background:** White
- **Heading:** "Still have questions?"
- **Body Text:** "Our team is here to help you navigate global real estate with confidence."
- **CTA Buttons:**
  - "Contact Support" (email link)
  - "Get Started" (app link)

---

## 6. FOR INVESTORS PAGE (investors.html)

### HERO SECTION
- **Heading:** "Invest WORLDWIDE"
- **Body Text:** "Discover, evaluate, and purchase properties worldwide with confidence. Attend live property tours with real agents and understand legal, cost, and location details in your own language through EstalaraAI."
- **CTA Buttons:**
  - "Explore Properties →"
  - "Learn Benefits"

### INVESTING WITHOUT BORDERS SECTION
**Section ID:** `#investing-without-borders`
**Background:** White
- **Icon Placeholder:** `#investor-section1-icon` (CMS-driven)
- **Image Placeholder:** `#investor-section1-image` (CMS-driven)
- **Heading:** "Investing without borders"
- **Body Text:** "The world is your marketplace. Estalara lets you browse, evaluate and purchase properties around the globe from wherever you are. Live tours and remote closings make you feel like you're there and build trust through authentic video. Our network of verified agents and local experts ensures safety and transparency in every transaction."

### INVESTMENT STATS SECTION
**Background:** White
- **Stats Grid (4):**
  - 50+ Countries Available
  - €2.5B+ Properties Listed
  - 25+ Languages Supported
  - 24/7 Live Support

---

## 7. PRIVACY POLICY PAGE (privacy.html)

### HERO SECTION
**Section ID:** `#hero`
- **Heading:** "Privacy Policy"
- **Dates:**
  - Effective Date: October 10, 2025
  - Last Updated: October 10, 2025

### CONTENT SECTIONS
**Container ID:** `#privacy-content`

**Sections (13):**
1. **Introduction**
2. **Information We Collect**
   - 2.1 Information You Provide to Us
   - 2.2 Information Collected Automatically
   - 2.3 Information from Third Parties
3. **How We Use Your Information**
4. **How We Share Your Information**
5. **International Data Transfers**
6. **Data Security**
7. **Your Privacy Rights**
8. **Cookies and Tracking Technologies**
9. **Data Retention**
10. **Children's Privacy**
11. **Changes to This Privacy Policy**
12. **Contact Us**
    - Email: privacy@estalara.com
    - General: estalara@estalara.com
    - Address: Time2Show, Inc., Dover, DE, USA
13. **Regional Specific Information**
    - For European Union Users (GDPR)
    - For California Users (CCPA)

---

## 8. TERMS OF SERVICE PAGE (terms.html)

### HERO SECTION
**Section ID:** `#hero`
- **Heading:** "Terms of Service"
- **Dates:**
  - Effective Date: October 10, 2025
  - Last Updated: October 10, 2025

### CONTENT SECTIONS
**Container ID:** `#terms-content`

**Sections (18):**
1. **Acceptance of Terms**
2. **Description of Services**
3. **User Accounts**
   - 3.1 Account Registration
   - 3.2 User Verification
   - 3.3 Account Termination
4. **User Conduct and Prohibited Activities**
5. **Property Listings and Content**
   - 5.1 Listing Accuracy
   - 5.2 Intellectual Property
   - 5.3 Content Moderation
6. **Fees and Payments**
   - 6.1 Service Fees
   - 6.2 Payment Terms
   - 6.3 Taxes
7. **Disclaimer of Warranties**
8. **Limitation of Liability**
9. **Indemnification**
10. **Real Estate Transactions**
    - 10.1 Platform Role
    - 10.2 User Responsibility
    - 10.3 Compliance with Laws
11. **Intellectual Property Rights**
12. **Privacy and Data Protection** (links to Privacy Policy)
13. **Third-Party Services**
14. **Dispute Resolution**
    - 14.1 Disputes Between Users
    - 14.2 Disputes with Estalara
    - 14.3 Governing Law
15. **Changes to Terms**
16. **Termination**
17. **Miscellaneous**
    - 17.1 Entire Agreement
    - 17.2 Severability
    - 17.3 Waiver
    - 17.4 Assignment
    - 17.5 Force Majeure
18. **Contact Information**
    - Email: legal@estalara.com
    - General: estalara@estalara.com
    - Address: Time2Show, Inc., Dover, DE, USA

---

## GLOBAL ELEMENTS (Appear on All Pages)

### NAVIGATION HEADER
- **Logo:** `assets/EstalaraLogo.png` (responsive: h-8 on mobile, h-10 on desktop)
- **Mobile Menu Toggle:** Hamburger icon (3 horizontal lines)
- **Navigation Links:**
  - Home (index.html)
  - For Agents (agents.html)
  - For Agencies (agencies.html)
  - For Investors (investors.html)
  - About (about.html)
  - LIVE Properties (mobile only, links to app.estalara.com)
  - Launch App (button, links to app.estalara.com)

### FOOTER
- **Logo:** `assets/EstalaraLogo.png` or `assets/logo.svg`
- **Company Information:**
  - Time2Show, Inc., Dover, DE, USA
  - Contact: estalara@estalara.com
- **Links:**
  - FAQ (faq.html)
  - Privacy Policy (privacy.html)
  - Terms of Service (terms.html)
  - LinkedIn (placeholder link)
  - TikTok (placeholder link)
  - Instagram (placeholder link)
  - Admin Login (agencies.html only)

### BACKGROUND ELEMENTS
- **Particle Background:** `#particle-bg` div with p5.js animation (on most pages)
- **Mobile Menu Overlay:** `#menu-overlay` (appears when mobile menu is open)

---

## GRAPHICS & MEDIA ASSETS

### LOGOS
- **Primary Logo:** `assets/EstalaraLogo.png`
- **Alternative Logo:** `assets/EstalaraLogo-alt.png`
- **SVG Logo:** `assets/logo.svg` (used in some footers)

### ICONS
- Emoji-based icons used throughout (🤖, 📺, 🎯, ⚖️, 🌐, 🔍, 🤝, ⚡, 🏢, 📊, 🔧, 📱, etc.)
- Numbered circles for process steps (1, 2, 3, 4)

### IMAGES
- **Favicons:** Various sizes (32x32, 16x16, 180x180)
- **Social Media Images:**
  - og-image-home.jpg
  - og-image-about.jpg
  - og-image-agents.jpg
  - og-image-investors.jpg
  - og-image-privacy.jpg
  - og-image-terms.jpg
  - twitter-image-home.jpg
  - twitter-image-about.jpg
  - twitter-image-agents.jpg
  - twitter-image-investors.jpg
  - twitter-image-privacy.jpg
  - twitter-image-terms.jpg

### DYNAMIC CONTENT
- **Property Cards:** Loaded dynamically via `cms-integration.js` from localStorage
- **CMS Placeholders:** Several pages have placeholder elements for CMS-driven content (e.g., `#agency-section1-icon`, `#investor-section1-image`)

---

## INTERACTIVE ELEMENTS

### BUTTONS & CALLS-TO-ACTION
**Primary Style:**
- White background, black text
- Hover: Black background, white text

**Secondary Style:**
- Black background, white text with border
- Hover: White background, black text

### ANIMATIONS
- **Particle Background:** p5.js-powered animation
- **Typed Text:** Typing animation on home page hero
- **Reveal Animations:** Elements fade in and slide up on scroll
- **Hover Effects:** Cards scale or translate on hover

### FORMS
- No visible forms on public pages
- Contact via email links

---

## TECHNICAL NOTES

### SCRIPTS
- **cms-integration.js** - Handles dynamic content loading from localStorage
- **main.js** - Main JavaScript for animations and interactions
- **External Libraries:**
  - Tailwind CSS (via CDN)
  - anime.js (animations)
  - typed.js (typing effect)
  - splitting.js (text splitting animations)
  - p5.js (particle background)
  - Splide (carousel - on home page)

### FONTS
- **Playfair Display** - Serif for headings (weights: 400, 700, 900)
- **Inter** - Sans-serif for body text (weights: 300, 400, 500, 600, 700)
- **JetBrains Mono** - Monospace font (weights: 400, 500)

### COLOR SCHEME
- **Primary Black:** #000000
- **Primary White:** #FFFFFF
- **Gray:** #F5F5F5
- **Gray Text:** #CCCCCC (used for secondary text)
- **Gray Dark:** Various shades for borders and backgrounds

### RESPONSIVE DESIGN
- Mobile-first approach
- Breakpoints: md (768px and up)
- Mobile menu toggle for navigation
- Responsive font sizes using clamp()

---

## CONTACT EMAILS

### General Contacts
- **Main:** estalara@estalara.com
- **Support:** support@estalara.com
- **Privacy:** privacy@estalara.com
- **Legal:** legal@estalara.com

### Specific Contacts
- **Agents:** agents@estalara.com
- **Investors:** investors@estalara.com
- **Enterprise:** peter@estalara.com

---

## SEO & META INFORMATION

### Structured Data (Schema.org)
- Organization schema (home page)
- WebSite schema with SearchAction (home page)
- Service schema (home page, agents page)
- BreadcrumbList (about, agents, investors, FAQ pages)
- FAQPage schema (FAQ page)

### Hreflang Tags
- **Supported Languages:** en, es, fr, de
- **Default:** x-default (English)
- Language-specific URLs follow pattern: `/[lang]/[page].html`

### Social Media
- **Platforms Mentioned:**
  - LinkedIn: @estalara
  - TikTok: @estalara
  - Instagram: @estalara
  - Twitter: @estalara

---

**END OF DOCUMENT**
