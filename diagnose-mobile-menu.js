/**
 * Diagnostyka menu hamburger - uruchom w konsoli przeglądarki na mobile
 */

console.log('=== 🔍 DIAGNOSTYKA MENU HAMBURGER ===\n');

// 1. Sprawdź czy elementy istnieją
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const menuOverlay = document.getElementById('menu-overlay');

console.log('1. ELEMENTY DOM:');
console.log(`   ✓ menu-toggle: ${menuToggle ? '✅ ISTNIEJE' : '❌ BRAK'}`);
console.log(`   ✓ mobile-menu: ${mobileMenu ? '✅ ISTNIEJE' : '❌ BRAK'}`);
console.log(`   ✓ menu-overlay: ${menuOverlay ? '✅ ISTNIEJE' : '❌ BRAK'}\n`);

// 2. Sprawdź viewport
const isMobile = window.innerWidth < 768;
console.log('2. VIEWPORT:');
console.log(`   ✓ Szerokość okna: ${window.innerWidth}px`);
console.log(`   ✓ To jest mobile? ${isMobile ? '✅ TAK (<768px)' : '❌ NIE (>=768px)'}\n`);

// 3. Sprawdź style CSS
if (menuToggle) {
    const btnStyle = window.getComputedStyle(menuToggle);
    console.log('3. PRZYCISK HAMBURGER:');
    console.log(`   ✓ display: ${btnStyle.display}`);
    console.log(`   ✓ visibility: ${btnStyle.visibility}`);
    console.log(`   ✓ z-index: ${btnStyle.zIndex}`);
    console.log(`   ✓ aria-expanded: ${menuToggle.getAttribute('aria-expanded')}\n`);
}

// 4. Sprawdź menu
if (mobileMenu) {
    const menuStyle = window.getComputedStyle(mobileMenu);
    const menuClasses = mobileMenu.className;
    console.log('4. MENU:');
    console.log(`   ✓ display: ${menuStyle.display}`);
    console.log(`   ✓ visibility: ${menuStyle.visibility}`);
    console.log(`   ✓ z-index: ${menuStyle.zIndex}`);
    console.log(`   ✓ Classes: ${menuClasses}`);
    console.log(`   ✓ Ma klasę "hidden"? ${mobileMenu.classList.contains('hidden') ? 'TAK' : 'NIE'}\n`);
}

// 5. Sprawdź overlay
if (menuOverlay) {
    const overlayStyle = window.getComputedStyle(menuOverlay);
    console.log('5. OVERLAY:');
    console.log(`   ✓ display: ${overlayStyle.display}`);
    console.log(`   ✓ z-index: ${overlayStyle.zIndex}`);
    console.log(`   ✓ Ma klasę "hidden"? ${menuOverlay.classList.contains('hidden') ? 'TAK' : 'NIE'}\n`);
}

// 6. Sprawdź event listenery
if (menuToggle) {
    console.log('6. EVENT LISTENERY:');
    console.log('   ✓ Sprawdź w DevTools → Elements → Event Listeners');
    console.log('   ✓ Powinien mieć: click, touchstart\n');
}

// 7. Sprawdź czy main.js się załadował
console.log('7. SKRYPTY:');
console.log(`   ✓ EstalaraUtils: ${typeof window.EstalaraUtils !== 'undefined' ? '✅ ZAŁADOWANY' : '❌ BRAK'}`);
console.log(`   ✓ anime.js: ${typeof anime !== 'undefined' ? '✅ ZAŁADOWANY' : '❌ BRAK'}`);
console.log(`   ✓ Typed.js: ${typeof Typed !== 'undefined' ? '✅ ZAŁADOWANY' : '❌ BRAK'}\n`);

// 8. Test kliknięcia
console.log('8. TEST INTERAKCJI:');
if (menuToggle && mobileMenu) {
    console.log('   ℹ️  Kliknij przycisk hamburger i zobacz co się stanie...');
    
    // Dodaj tymczasowy listener do debugowania
    const testListener = function(e) {
        console.log('   ✅ Kliknięcie wykryte!');
        console.log('   ✓ Menu przed kliknięciem - hidden?', mobileMenu.classList.contains('hidden'));
        
        setTimeout(() => {
            console.log('   ✓ Menu po kliknięciu - hidden?', mobileMenu.classList.contains('hidden'));
            console.log('   ✓ aria-expanded:', menuToggle.getAttribute('aria-expanded'));
        }, 150);
    };
    
    menuToggle.addEventListener('click', testListener, { once: true });
    console.log('   ℹ️  Listener testowy dodany. Kliknij hamburger!\n');
}

// 9. Sprawdź console na błędy
console.log('9. INSTRUKCJE:');
console.log('   1. Otwórz DevTools (F12)');
console.log('   2. Przejdź do zakładki Console');
console.log('   3. Sprawdź czy nie ma czerwonych błędów');
console.log('   4. Kliknij hamburger i obserwuj komunikaty');
console.log('   5. Spróbuj też:');
console.log('      - Kliknąć overlay (jeśli menu otwarte)');
console.log('      - Nacisnąć ESC (jeśli menu otwarte)');
console.log('      - Kliknąć link w menu\n');

console.log('=== 🎯 KONIEC DIAGNOSTYKI ===');
console.log('Jeśli wszystko jest ✅, ale menu nie działa, sprawdź:');
console.log('- Czy Tailwind CSS się załadował?');
console.log('- Czy nie ma konfliktów z innymi skryptami?');
console.log('- Czy viewport meta tag jest ustawiony?');
