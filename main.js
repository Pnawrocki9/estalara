// Optimized Particle Background System - CSS-based with reduced particle count
let particles = [];
let particleCount = 25; // Reduced from 50 for better performance
let lastFrameTime = 0;
const targetFPS = 30; // Limit to 30 FPS instead of 60
const frameInterval = 1000 / targetFPS;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('particle-bg');
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: random(width),
            y: random(height),
            vx: random(-0.5, 0.5),
            vy: random(-0.5, 0.5),
            size: random(1, 3)
        });
    }
}

function draw() {
    // Throttle to target FPS
    const currentTime = millis();
    if (currentTime - lastFrameTime < frameInterval) {
        return;
    }
    lastFrameTime = currentTime;
    
    clear();
    
    // Update and draw particles
    for (let particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;
        
        // Draw particle
        fill(255, 255, 255, 100);
        noStroke();
        ellipse(particle.x, particle.y, particle.size);
    }
    
    // Optimized connections - only check nearby particles
    const connectionDistance = 100;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < Math.min(i + 5, particles.length); j++) { // Limit connections per particle
            let d = dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
            if (d < connectionDistance) {
                stroke(255, 255, 255, 50 * (1 - d / connectionDistance));
                strokeWeight(0.5);
                line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
            }
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// Typewriter Effect  
// Since scripts are loaded at the end of <body>, DOM may already be ready
(function initMain() {
    if (document.readyState === 'loading') {
        // DOM is still loading, wait for DOMContentLoaded
        console.log('📋 [Main] DOM is loading, waiting for DOMContentLoaded...');
        document.addEventListener('DOMContentLoaded', initializeMain);
    } else {
        // DOM is already loaded (interactive or complete), initialize immediately
        console.log('📋 [Main] DOM already loaded (state: ' + document.readyState + '), initializing immediately');
        initializeMain();
    }
})();

function initializeMain() {
    console.log('📋 [Main] Initializing main.js features...');
    const typed = new Typed('#typed-text', {
        strings: ['Go LIVE.', 'Go GLOBAL.'],
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 2000,
        loop: true,
        showCursor: true,
        cursorChar: '|'
    });
    
    // Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // Expose the observer globally so dynamic modules (e.g. CMS) can register new elements
    window.revealObserver = observer;

    // Helper to observe new reveal elements dynamically
    window.observeReveals = function(nodes) {
        if (!window.revealObserver) return;
        nodes.forEach(el => {
            window.revealObserver.observe(el);
        });
    };

    // Observe all reveal elements that exist at load time
    document.querySelectorAll('.reveal').forEach(el => {
        window.revealObserver.observe(el);
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Navbar: keep solid black, do not override via JS
    // Remove previous scroll listener if present and ensure header stays black.
    (function ensureSolidBlackHeader() {
        // Remove any inline background that may have been set earlier
        const header = document.querySelector('header');
        if (header) {
            header.style.backgroundColor = '#000000';
        }
        // No scroll-based background logic needed; header is controlled via CSS classes.
    })();
    
    // Feature cards animation
    const cards = document.querySelectorAll('.card-hover');
    cards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.05,
                duration: 300,
                easing: 'easeOutQuart'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                duration: 300,
                easing: 'easeOutQuart'
            });
        });
    });
    
    // Staggered reveal animations
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.05,
                duration: 200,
                easing: 'easeOutQuart'
            });
        });
        
        button.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                duration: 200,
                easing: 'easeOutQuart'
            });
        });
    });
    
    // Helper function to initialise property card animations. This is exposed globally so
    // that CMS-injected cards can reuse the same event handlers without duplicating code.
    window.initPropertyCards = function(cards) {
        cards.forEach((card, index) => {
            // Only set a delay if one isn't already set to avoid overwriting CMS-specified delays
            if (!card.style.animationDelay) {
                card.style.animationDelay = `${index * 0.1}s`;
            }
            card.addEventListener('mouseenter', function() {
                if (typeof anime !== 'undefined') {
                    anime({
                        targets: this,
                        translateY: -5,
                        duration: 300,
                        easing: 'easeOutQuart'
                    });
                }
            });
            card.addEventListener('mouseleave', function() {
                if (typeof anime !== 'undefined') {
                    anime({
                        targets: this,
                        translateY: 0,
                        duration: 300,
                        easing: 'easeOutQuart'
                    });
                }
            });
        });
    };

    // Property cards animation for existing cards on page load
    const propertyCards = document.querySelectorAll('.property-card');
    window.initPropertyCards(Array.from(propertyCards));
    
    // Mobile menu toggle is handled by the IIFE at the bottom of this file
    
    // Loading animation
    window.addEventListener('load', function() {
        const loader = document.querySelector('.loader');
        if (loader) {
            anime({
                targets: loader,
                opacity: 0,
                duration: 500,
                complete: function() {
                    loader.style.display = 'none';
                }
            });
        }
    });
    
    // Throttled parallax effect for hero section
    const handleParallax = window.EstalaraUtils.throttle(function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('#home');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    }, 16); // ~60fps
    
    window.addEventListener('scroll', handleParallax, { passive: true });
    
    // Form validation (if forms exist)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add form validation logic here
            console.log('Form submitted');
        });
    });
    
    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }, 0);
        });
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Counter animation for stats
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        element.textContent = Math.floor(current);
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 20);
}

// Export functions for use in other files
window.EstalaraUtils = {
    debounce,
    throttle,
    animateCounter
};

    // Mobile hamburger toggle (comprehensive, with focus trap and scroll lock)
(function () {
    /**
     * Comprehensive mobile menu implementation with:
     * - Focus trap to keep keyboard navigation within menu
     * - Scroll lock to prevent background scrolling
     * - Escape key to close menu
     * - Proper touch event handling
     * - Hamburger icon animation
     * - ARIA attributes for accessibility
     */
    
    // Helper function to check if we're on mobile viewport (< 768px)
    // This is more reliable than checking getComputedStyle, which depends on CSS being loaded
    function isMobileViewport() {
        return window.innerWidth < 768;
    }
    
    // State management
    var state = {
        isOpen: false,
        focusableElements: [],
        lastFocusedElement: null
    };
    
    function initMobileMenu() {
        var btn  = document.getElementById('menu-toggle');
        var menu = document.getElementById('mobile-menu');
        var overlay = document.getElementById('menu-overlay');
        if (!btn || !menu) return;

        // Get all hamburger lines for animation
        var hamburgerLines = btn.querySelectorAll('span');

        // Start with menu hidden on mobile viewports
        if (isMobileViewport()) {
            closeMenu();
        }

        // Get all focusable elements within menu for focus trap
        function updateFocusableElements() {
            state.focusableElements = Array.from(
                menu.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
            );
        }

        // Lock body scroll when menu is open
        function lockScroll() {
            // Store current scroll position
            var scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = '-' + scrollY + 'px';
            document.body.style.width = '100%';
            document.body.style.overflowY = 'scroll'; // Prevent layout shift
        }

        // Unlock body scroll when menu is closed
        function unlockScroll() {
            var scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflowY = '';
            // Restore scroll position
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }

        // Animate hamburger icon
        function animateHamburgerOpen() {
            if (hamburgerLines.length >= 3) {
                // First line rotates and moves down
                hamburgerLines[0].style.transform = 'rotate(45deg) translateY(8px)';
                hamburgerLines[0].style.transition = 'transform 0.3s ease';
                // Middle line fades out
                hamburgerLines[1].style.opacity = '0';
                hamburgerLines[1].style.transition = 'opacity 0.2s ease';
                // Last line rotates and moves up
                hamburgerLines[2].style.transform = 'rotate(-45deg) translateY(-8px)';
                hamburgerLines[2].style.transition = 'transform 0.3s ease';
            }
        }

        function animateHamburgerClose() {
            if (hamburgerLines.length >= 3) {
                hamburgerLines[0].style.transform = '';
                hamburgerLines[1].style.opacity = '';
                hamburgerLines[2].style.transform = '';
            }
        }

        // Open menu
        function openMenu() {
            if (state.isOpen) return;
            
            state.isOpen = true;
            state.lastFocusedElement = document.activeElement;
            
            // Show overlay first (if it exists)
            if (overlay) {
                overlay.classList.remove('hidden');
                overlay.setAttribute('aria-hidden', 'false');
            }
            
            // Show menu
            menu.classList.remove('hidden');
            menu.classList.add('flex');
            btn.setAttribute('aria-expanded', 'true');
            btn.setAttribute('aria-label', 'Close menu');
            
            // Only lock scroll on mobile
            if (isMobileViewport()) {
                lockScroll();
            }
            
            animateHamburgerOpen();
            updateFocusableElements();
            
            // Focus first element in menu after a brief delay
            setTimeout(function() {
                if (state.focusableElements.length > 0) {
                    state.focusableElements[0].focus();
                }
            }, 100);
        }

        // Close menu
        function closeMenu() {
            if (!state.isOpen && menu.classList.contains('hidden')) return;
            
            state.isOpen = false;
            
            // Hide overlay
            if (overlay) {
                overlay.classList.add('hidden');
                overlay.setAttribute('aria-hidden', 'true');
            }
            
            // Hide menu
            menu.classList.add('hidden');
            menu.classList.remove('flex');
            btn.setAttribute('aria-expanded', 'false');
            btn.setAttribute('aria-label', 'Open menu');
            
            unlockScroll();
            animateHamburgerClose();
            
            // Return focus to hamburger button
            if (state.lastFocusedElement && isMobileViewport()) {
                state.lastFocusedElement.focus();
            }
        }

        // Toggle menu
        function toggleMenu(event) {
            event.preventDefault();
            event.stopPropagation();
            
            if (menu.classList.contains('hidden')) {
                openMenu();
            } else {
                closeMenu();
            }
        }

        // Handle focus trap
        function handleFocusTrap(event) {
            if (!state.isOpen || !isMobileViewport()) return;
            if (state.focusableElements.length === 0) return;

            var isTabPressed = event.key === 'Tab';
            if (!isTabPressed) return;

            var firstElement = state.focusableElements[0];
            var lastElement = state.focusableElements[state.focusableElements.length - 1];

            if (event.shiftKey) {
                // Shift + Tab: if focused on first element, move to last
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab: if focused on last element, move to first
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        }

        // Handle escape key
        function handleEscapeKey(event) {
            if (event.key === 'Escape' && state.isOpen) {
                closeMenu();
            }
        }

        // Attach event listeners - using addEventListener once to avoid duplicates
        btn.addEventListener('click', toggleMenu);
        
        // Close menu when clicking overlay
        if (overlay) {
            overlay.addEventListener('click', function(event) {
                event.preventDefault();
                closeMenu();
            });
        }
        
        // Close menu when clicking outside (only on mobile) - backup if overlay doesn't exist
        document.addEventListener('click', function(event) {
            if (!state.isOpen || !isMobileViewport()) return;
            
            var isClickInsideMenu = menu.contains(event.target);
            var isClickOnButton = btn.contains(event.target);
            var isClickOnOverlay = overlay && overlay.contains(event.target);
            
            if (!isClickInsideMenu && !isClickOnButton && !isClickOnOverlay) {
                closeMenu();
            }
        });

        // Focus trap
        document.addEventListener('keydown', handleFocusTrap);
        
        // Escape key handler
        document.addEventListener('keydown', handleEscapeKey);

        // Hide menu after clicking a link on mobile
        menu.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                if (isMobileViewport()) {
                    closeMenu();
                }
            });
        });

        // Reset menu state on window resize
        var resizeTimer;
        window.addEventListener('resize', function () {
            // Debounce resize events to improve performance
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                // On mobile (< 768px), ensure menu is closed
                if (isMobileViewport()) {
                    closeMenu();
                } else {
                    // On desktop (>= 768px), remove manual classes and let Tailwind handle it
                    // Also unlock scroll if it was locked
                    unlockScroll();
                    state.isOpen = false;
                    menu.classList.remove('hidden');
                    menu.classList.remove('flex');
                    btn.setAttribute('aria-expanded', 'false');
                    btn.setAttribute('aria-label', 'Open menu');
                    animateHamburgerClose();
                }
            }, 100);
        });

        // Handle orientation change on mobile devices
        window.addEventListener('orientationchange', function() {
            setTimeout(function() {
                if (state.isOpen && isMobileViewport()) {
                    closeMenu();
                }
            }, 200);
        });
    }

    // Run immediately if the document is ready; otherwise attach to DOMContentLoaded
    // Add 50ms delay to ensure all DOM elements and styles are fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initMobileMenu, 50);
        });
    } else {
        // Use setTimeout to execute after current call stack, giving Tailwind CSS time to apply
        setTimeout(initMobileMenu, 50);
    }
})();