// Particle Background System
let particles = [];
let particleCount = 50;

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
    
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            let d = dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
            if (d < 100) {
                stroke(255, 255, 255, 50 * (1 - d / 100));
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
document.addEventListener('DOMContentLoaded', function() {
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
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('#home');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
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
});

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

// Export functions for use in other files
window.EstalaraUtils = {
    debounce,
    throttle,
    animateCounter
};

    // Mobile hamburger toggle (safe, idempotent)
(function () {
    /**
     * Initialise the hamburger menu toggle. If the DOM has already been loaded
     * when this script runs (e.g. because the script is placed at the end of
     * the document), the handler is executed immediately. Otherwise it waits
     * for the DOMContentLoaded event.
     */
    
    // Helper function to check if we're on mobile viewport (< 768px)
    // This is more reliable than checking getComputedStyle, which depends on CSS being loaded
    function isMobileViewport() {
        return window.innerWidth < 768;
    }
    
    function initMobileMenu() {
        var btn  = document.getElementById('menu-toggle');
        var menu = document.getElementById('mobile-menu');
        if (!btn || !menu) return;

        // Start with menu hidden on mobile viewports
        if (isMobileViewport()) {
            menu.classList.add('hidden');
            menu.classList.remove('flex');
        }

        // Toggle menu visibility on click - toggle both 'hidden' and 'flex' for proper mobile display
        btn.addEventListener('click', function () {
            var isHidden = menu.classList.contains('hidden');
            if (isHidden) {
                menu.classList.remove('hidden');
                menu.classList.add('flex');
                btn.setAttribute('aria-expanded', 'true');
            } else {
                menu.classList.add('hidden');
                menu.classList.remove('flex');
                btn.setAttribute('aria-expanded', 'false');
            }
        });

        // Hide menu after clicking a link on mobile
        menu.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                if (isMobileViewport()) {
                    menu.classList.add('hidden');
                    menu.classList.remove('flex');
                    btn.setAttribute('aria-expanded', 'false');
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
                    menu.classList.add('hidden');
                    menu.classList.remove('flex');
                    btn.setAttribute('aria-expanded', 'false');
                } else {
                    // On desktop (>= 768px), remove manual classes and let Tailwind handle it
                    menu.classList.remove('hidden');
                    menu.classList.remove('flex');
                    btn.setAttribute('aria-expanded', 'false');
                }
            }, 100);
        });
    }

    // Run immediately if the document is ready; otherwise attach to DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileMenu);
    } else {
        initMobileMenu();
    }
})();