// Quick Sync Button - Add to any page for instant CMS synchronization
// This creates a floating button that forces refresh from Firebase

(function() {
    'use strict';
    // Only show this button for authenticated CMS users or on explicit sync pages
    try {
        const isForcedSyncPage = /force-sync-now\.html|verify-cms-sync\.html/i.test(window.location.pathname);
        const isCMSContext = /cms\.html|admin\.html|admin\//i.test(window.location.pathname);
        // Consider user authenticated for showing the button if:
        //  - they are actually authenticated, OR
        //  - they are in CMS/admin context (button is a CMS tool), OR
        //  - they are on explicit sync pages
        const isAuthenticated = typeof window.isAuthenticated === 'function' ? !!window.isAuthenticated() : false;
        const allowShow = isAuthenticated || isCMSContext || isForcedSyncPage;
        if (!allowShow) {
            // Do not render the button on public pages for unauthenticated users
            return;
        }
    } catch (_) { /* safest default is to hide on unexpected error */ return; }

    // Only add button if not already present
    if (document.getElementById('quick-sync-btn')) return;
    
    // Create floating sync button
    const button = document.createElement('button');
    button.id = 'quick-sync-btn';
    button.innerHTML = '🔄';
    button.title = 'Synchronizuj z CMS (kliknij aby odświeżyć dane)';
    
    // Styles
    Object.assign(button.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: '3px solid white',
        fontSize: '28px',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        zIndex: '999999',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif'
    });
    
    // Hover effect
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.1) rotate(180deg)';
        button.style.boxShadow = '0 6px 30px rgba(102, 126, 234, 0.5)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1) rotate(0deg)';
        button.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
    });
    
    // Click handler
    button.addEventListener('click', async () => {
        // Show loading state
        button.innerHTML = '⏳';
        button.style.pointerEvents = 'none';
        
        try {
            console.log('🔄 Quick Sync: Rozpoczynam synchronizację...');
            
            // Wait for Firebase (if present on the page)
            if (window.firebaseReadyPromise) {
                await window.firebaseReadyPromise;
            }
            
            // Load data from Firebase
            let data = null;
            if (typeof firebase !== 'undefined' && firebase?.database) {
                const snapshot = await firebase.database().ref('adminData').once('value');
                data = snapshot.val();
            } else if (typeof window.loadAdminDataAsync === 'function') {
                // Fallback: try adapter helper to read current data
                data = await window.loadAdminDataAsync();
            }
            
            if (!data) {
                throw new Error('Brak danych w Firebase. Sprawdź CMS.');
            }
            
            // Save to localStorage to refresh frontend cache
            localStorage.setItem('estalaraAdminData', JSON.stringify(data));
            
            console.log('✅ Quick Sync: Dane zsynchronizowane!');
            console.log('📦 Przycisk header:', data.pageButtons?.headerCta?.text);
            
            // Show success
            button.innerHTML = '✅';
            button.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            
            // Reload page after short delay if not inside an iframe
            setTimeout(() => {
                try {
                    if (window.top === window.self) {
                        window.location.reload();
                    }
                } catch (_) {
                    window.location.reload();
                }
            }, 500);
            
        } catch (error) {
            console.error('❌ Quick Sync błąd:', error);
            button.innerHTML = '❌';
            button.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
            
            // Reset after 2 seconds
            setTimeout(() => {
                button.innerHTML = '🔄';
                button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                button.style.pointerEvents = 'auto';
            }, 2000);
            
            alert('❌ Błąd synchronizacji:\n' + error.message);
        }
    });
    
    // Add to page
    document.body.appendChild(button);
    
    console.log('🔄 Quick Sync Button added - kliknij przycisk w prawym dolnym rogu aby zsynchronizować');
})();
