// Quick Sync Button - Add to any page for instant CMS synchronization
// This creates a floating button that forces refresh from Firebase

(function() {
    'use strict';
    
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
            
            // Wait for Firebase
            if (!window.firebaseReadyPromise) {
                throw new Error('Firebase nie jest dostępny na tej stronie');
            }
            
            await window.firebaseReadyPromise;
            
            // Load data from Firebase
            const snapshot = await firebase.database().ref('adminData').once('value');
            const data = snapshot.val();
            
            if (!data) {
                throw new Error('Brak danych w Firebase. Sprawdź CMS.');
            }
            
            // Save to localStorage
            localStorage.setItem('estalaraAdminData', JSON.stringify(data));
            
            console.log('✅ Quick Sync: Dane zsynchronizowane!');
            console.log('📦 Przycisk header:', data.pageButtons?.headerCta?.text);
            
            // Show success
            button.innerHTML = '✅';
            button.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            
            // Reload page after short delay
            setTimeout(() => {
                window.location.reload();
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
