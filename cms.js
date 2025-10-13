// CMS JavaScript functionality

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.remove('hidden');
    
    // Load settings when settings section is shown
    if (sectionId === 'settings') {
        loadSettingsForm();
    }
}

// Global variable to track current property being edited
let currentPropertyId = null;
let currentLivePropertyId = null;

// ===== NEW LIVE PROPERTIES MODAL FUNCTIONS =====

function showLivePropertyModal() {
    currentLivePropertyId = null; // Reset for new property
    document.getElementById('livePropertyModalTitle').textContent = '🔴 Dodaj Kafelek LIVE Property';
    document.getElementById('livePropertyForm').reset();
    document.getElementById('livePropertyModal').classList.remove('hidden');
    document.getElementById('livePropertyModal').classList.add('flex');
    
    // Reset preview
    updateLivePreview();
}

function hideLivePropertyModal() {
    currentLivePropertyId = null;
    document.getElementById('livePropertyModal').classList.add('hidden');
    document.getElementById('livePropertyModal').classList.remove('flex');
    document.getElementById('livePropertyForm').reset();
}

function updateLivePreview() {
    const title = document.getElementById('live-property-title')?.value || 'Tytuł Nieruchomości';
    const location = document.getElementById('live-property-location')?.value || 'Lokalizacja';
    const price = document.getElementById('live-property-price')?.value || '0';
    const description = document.getElementById('live-property-description')?.value || 'Opis nieruchomości pojawi się tutaj...';
    const image = document.getElementById('live-property-image')?.value || 'https://via.placeholder.com/400x300?text=Dodaj+Zdjęcie';
    
    document.getElementById('preview-title').textContent = title;
    document.getElementById('preview-location').textContent = location;
    document.getElementById('preview-price').textContent = `€${parseInt(price).toLocaleString()}`;
    document.getElementById('preview-description').textContent = description;
    document.getElementById('preview-image').src = image;
}

function editLiveProperty(id) {
    const admin = loadAdminData();
    const property = admin.liveProperties?.find(p => p.id === id);
    
    if (!property) {
        showNotification('Kafelek nie został znaleziony!', 'error');
        return;
    }
    
    currentLivePropertyId = id;
    document.getElementById('livePropertyModalTitle').textContent = '🔴 Edytuj Kafelek LIVE Property';
    
    document.getElementById('live-property-title').value = property.title || '';
    document.getElementById('live-property-location').value = property.location || '';
    document.getElementById('live-property-price').value = property.price || '';
    document.getElementById('live-property-description').value = property.description || '';
    document.getElementById('live-property-image').value = property.image || '';
    document.getElementById('live-property-link').value = property.link || '';
    
    updateLivePreview();
    
    document.getElementById('livePropertyModal').classList.remove('hidden');
    document.getElementById('livePropertyModal').classList.add('flex');
}

function deleteLiveProperty(id) {
    if (confirm('Czy na pewno chcesz usunąć ten kafelek?')) {
        const admin = loadAdminData();
        
        if (!admin.liveProperties) {
            admin.liveProperties = [];
        }
        
        admin.liveProperties = admin.liveProperties.filter(p => p.id !== id);
        // Ensure version is set to prevent frontend from resetting data
        if (!admin.version) {
            admin.version = 4;
        }
        
        localStorage.setItem('estalaraAdminData', JSON.stringify(admin));
        
        showNotification('Kafelek został usunięty!', 'success');
        loadLivePropertiesGrid();
    }
}

function loadLivePropertiesGrid() {
    const admin = loadAdminData();
    const grid = document.getElementById('livePropertiesGrid');
    
    if (!grid) return;
    
    if (!admin.liveProperties || admin.liveProperties.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12 cms-card">
                <p class="text-gray-500 text-lg mb-2">Brak kafelków LIVE Properties</p>
                <p class="text-gray-400 text-sm">Kliknij "Dodaj Kafelek" aby stworzyć pierwszy kafelek</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = admin.liveProperties.map(property => `
        <div class="cms-card p-4 hover:shadow-lg transition-shadow">
            <div class="relative mb-3">
                <img src="${property.image}" alt="${property.title}" class="w-full h-40 object-cover rounded">
                <span class="absolute top-2 left-2 px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded-full">LIVE</span>
            </div>
            <h3 class="font-bold text-lg mb-1 truncate">${property.title}</h3>
            <p class="text-sm text-gray-500 mb-2">${property.location}</p>
            <p class="text-sm text-gray-600 mb-3 line-clamp-2">${property.description}</p>
            <div class="flex justify-between items-center mb-3">
                <span class="font-bold text-lg text-blue-600">€${property.price.toLocaleString()}</span>
            </div>
            <div class="flex gap-2">
                <button class="cms-btn cms-btn-primary text-sm flex-1" onclick="editLiveProperty(${property.id})">Edytuj</button>
                <button class="cms-btn cms-btn-danger text-sm flex-1" onclick="deleteLiveProperty(${property.id})">Usuń</button>
            </div>
        </div>
    `).join('');
}

// ===== OLD PROPERTY MODAL FUNCTIONS (DEPRECATED) =====

function showPropertyModal() {
    currentPropertyId = null; // Reset for new property
    document.getElementById('propertyModalTitle').textContent = 'Add New Property';
    document.getElementById('propertyForm').reset();
    document.getElementById('propertyModal').classList.remove('hidden');
    document.getElementById('propertyModal').classList.add('flex');
}

function hidePropertyModal() {
    currentPropertyId = null;
    document.getElementById('propertyModal').classList.add('hidden');
    document.getElementById('propertyModal').classList.remove('flex');
    document.getElementById('propertyForm').reset();
}

function showUploadModal() {
    alert('Media upload coming soon! You can currently add image URLs directly in property forms.');
}

function showUserModal() {
    alert('User management coming soon!');
}

function editProperty(id) {
    const admin = loadAdminData();
    const property = admin.properties?.find(p => p.id === id);
    
    if (!property) {
        showNotification('Property not found!', 'error');
        return;
    }
    
    // Set current property ID for editing
    currentPropertyId = id;
    
    // Update modal title
    document.getElementById('propertyModalTitle').textContent = 'Edit Property';
    
    // Fill form with property data
    document.getElementById('property-title').value = property.title || '';
    document.getElementById('property-location').value = property.location || '';
    document.getElementById('property-price').value = property.price || '';
    document.getElementById('property-type').value = property.type || '';
    document.getElementById('property-description').value = property.description || '';
    document.getElementById('property-image').value = property.image || '';
    document.getElementById('property-link').value = property.link || '';
    
    // Show modal
    document.getElementById('propertyModal').classList.remove('hidden');
    document.getElementById('propertyModal').classList.add('flex');
}

function deleteProperty(id) {
    if (confirm('Are you sure you want to delete this property?')) {
        const admin = loadAdminData();
        
        if (!admin.properties) {
            admin.properties = [];
        }
        
        // Remove property from array
        admin.properties = admin.properties.filter(p => p.id !== id);
        
        // Ensure version is set
        if (!admin.version) {
            admin.version = 4;
        }
        
        // Save to localStorage
        localStorage.setItem('estalaraAdminData', JSON.stringify(admin));
        
        showNotification('Property deleted successfully!', 'success');
        
        // Reload properties table
        loadPropertiesTable();
    }
}

function editPage(pageId) {
    loadPageEditor(pageId);
}

function previewPage(pageId) {
    window.open(`/${pageId}.html`, '_blank');
}

function deleteMedia(id) {
    if (confirm('Are you sure you want to delete this media file?')) {
        alert('Media file deleted successfully!');
    }
}

function editUser(id) {
    alert('User editor coming soon!');
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        alert('User deleted successfully!');
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'cms-login.html';
    }
}

// Load settings form with current values
function loadSettingsForm() {
    const admin = loadAdminData();
    
    // Load general settings
    if (admin.siteTitle) {
        document.getElementById('site-title').value = admin.siteTitle;
    }
    if (admin.siteDescription) {
        document.getElementById('site-description').value = admin.siteDescription;
    }
    if (admin.contactEmail) {
        document.getElementById('contact-email').value = admin.contactEmail;
    }
    if (admin.logoUrl) {
        document.getElementById('logo-url').value = admin.logoUrl;
        updateLogoPreview(admin.logoUrl);
    }
    
    // Load platform settings
    if (admin.settings) {
        if (admin.settings.currency) {
            document.getElementById('default-currency').value = admin.settings.currency;
        }
        if (admin.settings.language) {
            document.getElementById('default-language').value = admin.settings.language;
        }
    }
    
    // Form submit handler is already attached in DOMContentLoaded, no need to re-attach here
    console.log('✓ Settings form loaded, event handler already active');
    
    // Logo handlers are already attached in DOMContentLoaded
    console.log('✓ Logo upload and preview handlers already active');
}

// Update logo preview
function updateLogoPreview(url) {
    const previewContainer = document.getElementById('logo-preview-container');
    const previewImg = document.getElementById('logo-preview');
    
    if (!url || !url.trim()) {
        previewContainer.style.display = 'none';
        return;
    }
    
    // Show container immediately with loading state
    previewContainer.style.display = 'block';
    previewContainer.innerHTML = `
        <p class="text-sm font-medium text-gray-700 mb-2">Logo Preview:</p>
        <div class="logo-preview flex items-center justify-center">
            <span class="text-gray-500">Loading preview...</span>
        </div>
        <p class="text-xs text-gray-500 mt-2">URL: <code class="bg-gray-100 px-1 rounded">${url.substring(0, 60)}${url.length > 60 ? '...' : ''}</code></p>
    `;
    
    // Encode the URL to handle spaces and special characters
    // But preserve data URLs (they start with 'data:')
    let encodedUrl = url;
    if (!url.startsWith('data:') && !url.startsWith('http://') && !url.startsWith('https://')) {
        // For relative paths, encode each component separately to preserve slashes
        const parts = url.split('/');
        encodedUrl = parts.map(part => encodeURIComponent(part)).join('/');
    }
    
    // Create a new image to test if it loads
    const testImg = new Image();
    
    testImg.onload = function() {
        // Image loaded successfully - show it
        previewContainer.innerHTML = `
            <p class="text-sm font-medium text-gray-700 mb-2">Current Logo:</p>
            <img id="logo-preview" class="logo-preview" src="${encodedUrl}" alt="Logo Preview">
            <p class="text-xs text-green-600 mt-2">✓ Logo loaded successfully</p>
        `;
    };
    
    testImg.onerror = function() {
        // Image failed to load - show helpful message
        const isRelativePath = !url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:');
        previewContainer.innerHTML = `
            <p class="text-sm font-medium text-gray-700 mb-2">Logo Preview:</p>
            <div class="logo-preview flex flex-col items-center justify-center bg-yellow-50 border-2 border-yellow-300">
                <span class="text-yellow-700 text-3xl mb-2">⚠️</span>
                <span class="text-yellow-800 font-medium">Preview not available</span>
                <span class="text-yellow-700 text-xs mt-1">${isRelativePath ? 'File will be loaded from your website' : 'Check if URL is valid'}</span>
            </div>
            <p class="text-xs text-gray-600 mt-2">URL saved: <code class="bg-gray-100 px-1 rounded">${url.substring(0, 50)}${url.length > 50 ? '...' : ''}</code></p>
            <p class="text-xs text-blue-600 mt-1">💡 Click "Save Changes" to apply this logo to your website</p>
        `;
    };
    
    // Start loading the image
    testImg.src = encodedUrl;
}

// Property Form Handler
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 CMS initialized - DOM Content Loaded');
    
    // Initialize dashboard
    showSection('dashboard');
    
    // Pre-load properties data (so it's ready when user clicks Properties tab)
    loadPropertiesTable();
    
    // Pre-load live properties grid
    loadLivePropertiesGrid();
    
    // LIVE Property form handler (NEW)
    const livePropertyForm = document.getElementById('livePropertyForm');
    if (livePropertyForm) {
        // Add live preview updates on input
        ['live-property-title', 'live-property-location', 'live-property-price', 
         'live-property-description', 'live-property-image'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', updateLivePreview);
            }
        });
        
        livePropertyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            try {
                const admin = loadAdminData();
                
                // Ensure liveProperties array exists
                if (!admin.liveProperties) {
                    admin.liveProperties = [];
                }
                
                // Get form data
                const propertyData = {
                    title: document.getElementById('live-property-title').value,
                    location: document.getElementById('live-property-location').value,
                    price: parseInt(document.getElementById('live-property-price').value),
                    description: document.getElementById('live-property-description').value,
                    image: document.getElementById('live-property-image').value,
                    link: document.getElementById('live-property-link').value || 'https://app.estalara.com'
                };
                
                if (currentLivePropertyId) {
                    // Update existing property
                    const index = admin.liveProperties.findIndex(p => p.id === currentLivePropertyId);
                    if (index !== -1) {
                        admin.liveProperties[index] = {
                            ...admin.liveProperties[index],
                            ...propertyData
                        };
                        console.log('✓ LIVE Property updated:', propertyData);
                    }
                } else {
                    // Create new property with new ID
                    const maxId = admin.liveProperties.length > 0 
                        ? Math.max(...admin.liveProperties.map(p => p.id || 0)) 
                        : 0;
                    propertyData.id = maxId + 1;
                    admin.liveProperties.push(propertyData);
                    console.log('✓ New LIVE Property created:', propertyData);
                }
                
                // Save to localStorage
                localStorage.setItem('estalaraAdminData', JSON.stringify(admin));
                
                // Verify save
                const savedData = localStorage.getItem('estalaraAdminData');
                if (!savedData) {
                    throw new Error('Failed to save to localStorage');
                }
                
                console.log('✓ LIVE Property data saved to localStorage');
                
                showNotification('Kafelek zapisany pomyślnie!', 'success');
                hideLivePropertyModal();
                
                // Reload live properties grid
                loadLivePropertiesGrid();
            } catch (error) {
                console.error('✗ Error saving LIVE property:', error);
                showNotification('Błąd podczas zapisywania: ' + error.message, 'error');
            }
        });
    }
    
    // Property form handler (OLD - DEPRECATED)
    const propertyForm = document.getElementById('propertyForm');
    if (propertyForm) {
        propertyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            try {
                const admin = loadAdminData();
                
                // Ensure properties array exists
                if (!admin.properties) {
                    admin.properties = [];
                }
                
                // Get form data
                const propertyData = {
                    title: document.getElementById('property-title').value,
                    location: document.getElementById('property-location').value,
                    price: parseInt(document.getElementById('property-price').value),
                    type: document.getElementById('property-type').value,
                    description: document.getElementById('property-description').value,
                    image: document.getElementById('property-image').value,
                    link: document.getElementById('property-link').value,
                    status: 'live'
                };
                
                if (currentPropertyId) {
                    // Update existing property
                    const index = admin.properties.findIndex(p => p.id === currentPropertyId);
                    if (index !== -1) {
                        admin.properties[index] = {
                            ...admin.properties[index],
                            ...propertyData
                        };
                        console.log('✓ Property updated:', propertyData);
                    }
                } else {
                    // Create new property with new ID
                    const maxId = admin.properties.length > 0 
                        ? Math.max(...admin.properties.map(p => p.id || 0)) 
                        : 0;
                    propertyData.id = maxId + 1;
                    admin.properties.push(propertyData);
                    console.log('✓ New property created:', propertyData);
                }
                
                // Ensure version is set
                if (!admin.version) {
                    admin.version = 4;
                }
                
                // Save to localStorage
                localStorage.setItem('estalaraAdminData', JSON.stringify(admin));
                
                // Verify save
                const savedData = localStorage.getItem('estalaraAdminData');
                if (!savedData) {
                    throw new Error('Failed to save to localStorage');
                }
                
                console.log('✓ Property data saved to localStorage');
                
                showNotification('Property saved successfully!', 'success');
                hidePropertyModal();
                
                // Reload properties table if on properties section
                loadPropertiesTable();
            } catch (error) {
                console.error('✗ Error saving property:', error);
                showNotification('Error saving property: ' + error.message, 'error');
            }
        });
    }
    
    // General settings form handler - FIXED VERSION
    const generalSettingsForm = document.getElementById('general-settings-form');
    if (generalSettingsForm) {
        console.log('✓ General settings form found, attaching submit handler');
        
        // Attach event listener directly (no cloning needed)
        generalSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('✓ Form submit event triggered');
            try {
                saveGeneralSettings();
            } catch (error) {
                console.error('✗ Error saving settings:', error);
                showNotification('Error saving settings: ' + error.message, 'error');
            }
            return false;
        }, { once: false, capture: true });
        
        console.log('✓ Form submit handler successfully attached');
    } else {
        console.error('✗ General settings form not found on page load');
    }
    
    // Logo URL input handler for live preview
    const logoUrlInput = document.getElementById('logo-url');
    if (logoUrlInput && !logoUrlInput.dataset.listenerAttached) {
        console.log('✓ Attaching logo URL input handler');
        
        // Debounce the preview update to avoid too many updates while typing
        let previewTimeout;
        logoUrlInput.addEventListener('input', function(e) {
            clearTimeout(previewTimeout);
            previewTimeout = setTimeout(() => {
                console.log('📝 Logo URL input changed:', e.target.value);
                updateLogoPreview(e.target.value);
            }, 500); // Wait 500ms after user stops typing
        });
        
        // Also update on blur (when user leaves the field)
        logoUrlInput.addEventListener('blur', function(e) {
            clearTimeout(previewTimeout);
            console.log('👁️ Logo URL field blur, updating preview');
            updateLogoPreview(e.target.value);
        });
        
        logoUrlInput.dataset.listenerAttached = 'true';
        console.log('✓ Logo URL input handler attached with debouncing');
    } else if (logoUrlInput) {
        console.log('✓ Logo URL input handler already attached, skipping');
    }
    
    // Logo file upload handler
    const logoUploadInput = document.getElementById('logo-upload');
    if (logoUploadInput && !logoUploadInput.dataset.listenerAttached) {
        console.log('✓ Attaching logo upload handler');
        logoUploadInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                console.log('📁 File selected:', file.name, file.type, file.size);
                
                // Validate file is an image
                if (!file.type.startsWith('image/')) {
                    showNotification('Please upload an image file (PNG, JPG, SVG, etc.)', 'error');
                    return;
                }
                
                // Show loading notification
                showNotification('Converting image to data URL...', 'info');
                
                // Convert to data URL
                const reader = new FileReader();
                reader.onload = function(event) {
                    const dataUrl = event.target.result;
                    console.log('✅ Image converted to data URL, length:', dataUrl.length);
                    
                    // Update the logo URL input with the data URL
                    document.getElementById('logo-url').value = dataUrl;
                    
                    // Update the preview
                    updateLogoPreview(dataUrl);
                    
                    // Show success message
                    showNotification('✅ Logo uploaded! Click "Save Changes" to apply it.', 'success');
                };
                reader.onerror = function() {
                    console.error('❌ Failed to read file');
                    showNotification('Failed to read the file. Please try again.', 'error');
                };
                reader.readAsDataURL(file);
            }
        });
        logoUploadInput.dataset.listenerAttached = 'true';
        console.log('✓ Logo upload handler attached');
    } else if (logoUploadInput) {
        console.log('✓ Logo upload handler already attached, skipping');
    }
    
    // Add Section Form Handler
    const addSectionForm = document.getElementById('addSectionForm');
    if (addSectionForm) {
        addSectionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const sectionData = {
                id: formData.get('sectionId'),
                title: formData.get('sectionTitle'),
                type: formData.get('sectionType')
            };

            const admin = window.estalaraAdmin || window.opener?.estalaraAdmin || parent.estalaraAdmin;
            if (!admin) return;

            admin.addSection(currentPageId, sectionData);
            hideAddSectionModal();
            renderPageStructure();
            showNotification('Section added successfully! Remember to add the corresponding HTML to the page.');
        });
    }
});

// Save general settings
function saveGeneralSettings() {
    console.log('=== SAVE GENERAL SETTINGS CALLED ===');
    
    try {
        // Show immediate feedback
        showNotification('Saving settings...', 'info');
        
        const admin = loadAdminData();
        
        // Get form values
        const siteTitle = document.getElementById('site-title')?.value || '';
        const siteDescription = document.getElementById('site-description')?.value || '';
        const contactEmail = document.getElementById('contact-email')?.value || '';
        const logoUrl = document.getElementById('logo-url')?.value || '';
        
        console.log('📋 Form values:', { siteTitle, siteDescription, contactEmail, logoUrl: logoUrl.substring(0, 50) + '...' });
        
        // Validate logo URL for Netlify deployment
        if (logoUrl && !logoUrl.startsWith('data:')) {
            if (logoUrl.includes(' ')) {
                if (!confirm('Warning: Your logo URL contains spaces. This may cause issues on Netlify.\n\nRecommendation: Use a filename without spaces (e.g., "assets/EstalaraLogo.png").\n\nDo you want to save anyway?')) {
                    console.log('⚠️ User cancelled save due to spaces in URL');
                    showNotification('Save cancelled - please fix logo URL with spaces', 'warning');
                    return;
                }
            }
        }
        
        // Update admin data
        admin.siteTitle = siteTitle;
        admin.siteDescription = siteDescription;
        admin.contactEmail = contactEmail;
        admin.logoUrl = logoUrl;
        
        // Ensure version is set
        if (!admin.version) {
            admin.version = 4;
        }
        
        console.log('💾 Saving admin data to localStorage (version:', admin.version, ')...');
        
        // Save to localStorage
        localStorage.setItem('estalaraAdminData', JSON.stringify(admin));
        
        // Verify save
        const savedData = localStorage.getItem('estalaraAdminData');
        if (!savedData) {
            throw new Error('Failed to save to localStorage');
        }
        
        console.log('✅ Data saved successfully to localStorage');
        
        // Show helpful tip for relative URLs
        if (logoUrl && logoUrl.startsWith('assets/') && !logoUrl.startsWith('data:')) {
            showNotification('✅ Settings saved! Using relative path - good for Netlify deployment.', 'success');
        } else {
            showNotification('✅ Settings saved successfully! Refresh your website to see changes.', 'success');
        }
        
        return true;
    } catch (error) {
        console.error('❌ Error in saveGeneralSettings:', error);
        showNotification('ERROR: Failed to save settings - ' + error.message, 'error');
        throw error;
    }
}

// Save platform settings
function savePlatformSettings() {
    const admin = loadAdminData();
    
    if (!admin.settings) {
        admin.settings = {};
    }
    
    admin.settings.currency = document.getElementById('default-currency').value;
    admin.settings.language = document.getElementById('default-language').value;
    
    // Ensure version is set
    if (!admin.version) {
        admin.version = 4;
    }
    
    // Save to localStorage
    localStorage.setItem('estalaraAdminData', JSON.stringify(admin));
    
    showNotification('Platform settings saved successfully!');
}

// Load page editor
function loadPageEditor(pageId) {
    const admin = loadAdminData();
    const page = admin.pages[pageId] || {};
    
    document.getElementById('pageEditorTitle').textContent = `Edit ${pageId.charAt(0).toUpperCase() + pageId.slice(1)} Page`;
    
    let editorHtml = `<form id="pageEditorForm" class="space-y-4">`;
    
    // Hero Section
    editorHtml += `<div class="border-b pb-4 mb-4">
        <h4 class="font-semibold text-lg mb-3">Hero Section</h4>
        <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-2">Hero Title</label>
            <input type="text" name="heroTitle" class="cms-input w-full" value="${page.heroTitle || ''}" placeholder="Main headline">
        </div>
        <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-2">Hero Subtitle</label>
            <textarea name="heroSubtitle" class="cms-input w-full" rows="3" placeholder="Subtitle text">${page.heroSubtitle || ''}</textarea>
        </div>
    </div>`;
    
    // For home page - additional sections
    if (pageId === 'home') {
        editorHtml += `<div class="border-b pb-4 mb-4">
            <h4 class="font-semibold text-lg mb-3">How It Works Section</h4>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input type="text" name="howItWorksTitle" class="cms-input w-full" value="${page.howItWorksTitle || ''}">
            </div>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                <textarea name="howItWorksSubtitle" class="cms-input w-full" rows="2">${page.howItWorksSubtitle || ''}</textarea>
            </div>
        </div>`;
        
        editorHtml += `<div class="border-b pb-4 mb-4">
            <h4 class="font-semibold text-lg mb-3">Features Section</h4>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input type="text" name="featuresTitle" class="cms-input w-full" value="${page.featuresTitle || ''}">
            </div>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                <textarea name="featuresSubtitle" class="cms-input w-full" rows="2">${page.featuresSubtitle || ''}</textarea>
            </div>
        </div>`;
        
        editorHtml += `<div class="border-b pb-4 mb-4">
            <h4 class="font-semibold text-lg mb-3">CTA Section</h4>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input type="text" name="ctaTitle" class="cms-input w-full" value="${page.ctaTitle || ''}">
            </div>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                <textarea name="ctaSubtitle" class="cms-input w-full" rows="2">${page.ctaSubtitle || ''}</textarea>
            </div>
        </div>`;
    }
    
    // For investors and agencies pages - content sections
    if (pageId === 'investors' || pageId === 'agencies') {
        for (let i = 1; i <= 3; i++) {
            editorHtml += `<div class="border-b pb-4 mb-4">
                <h4 class="font-semibold text-lg mb-3">Content Section ${i}</h4>
                <div class="mb-3">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Icon (emoji)</label>
                    <input type="text" name="section${i}Icon" class="cms-input w-full" value="${page['section' + i + 'Icon'] || ''}" placeholder="🌍">
                </div>
                <div class="mb-3">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input type="text" name="section${i}Title" class="cms-input w-full" value="${page['section' + i + 'Title'] || ''}">
                </div>
                <div class="mb-3">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <textarea name="section${i}Content" class="cms-input w-full" rows="4">${page['section' + i + 'Content'] || ''}</textarea>
                </div>
                <div class="mb-3">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                    <input type="text" name="section${i}Image" class="cms-input w-full" value="${page['section' + i + 'Image'] || ''}" placeholder="https://example.com/image.jpg">
                </div>
            </div>`;
        }
    }
    
    // For agencies page - white label section
    if (pageId === 'agencies') {
        editorHtml += `<div class="border-b pb-4 mb-4">
            <h4 class="font-semibold text-lg mb-3">White Label Section</h4>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input type="text" name="whiteLabelTitle" class="cms-input w-full" value="${page.whiteLabelTitle || ''}">
            </div>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                <textarea name="whiteLabelSubtitle" class="cms-input w-full" rows="3">${page.whiteLabelSubtitle || ''}</textarea>
            </div>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Benefits Title</label>
                <input type="text" name="whiteLabelBenefitsTitle" class="cms-input w-full" value="${page.whiteLabelBenefitsTitle || ''}">
            </div>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Benefits List (one per line)</label>
                <textarea name="whiteLabelBenefitsList" class="cms-input w-full" rows="4" placeholder="Your own branding\nBranded livestreams\n...">${(page.whiteLabelBenefitsList || []).join('\n')}</textarea>
            </div>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Why Title</label>
                <input type="text" name="whiteLabelWhyTitle" class="cms-input w-full" value="${page.whiteLabelWhyTitle || ''}">
            </div>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Why List (one per line)</label>
                <textarea name="whiteLabelWhyList" class="cms-input w-full" rows="4" placeholder="Greater customer trust\nFaster implementations\n...">${(page.whiteLabelWhyList || []).join('\n')}</textarea>
            </div>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Contact Label</label>
                <input type="text" name="whiteLabelContactLabel" class="cms-input w-full" value="${page.whiteLabelContactLabel || ''}">
            </div>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                <input type="email" name="whiteLabelContactEmail" class="cms-input w-full" value="${page.whiteLabelContactEmail || ''}">
            </div>
        </div>`;
    }
    
    // For FAQ page
    if (pageId === 'faq') {
        editorHtml += `<div class="border-b pb-4 mb-4">
            <h4 class="font-semibold text-lg mb-3">Page Header</h4>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                <input type="text" name="pageTitle" class="cms-input w-full" value="${page.pageTitle || 'Frequently Asked Questions'}">
            </div>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Page Subtitle</label>
                <textarea name="pageSubtitle" class="cms-input w-full" rows="2">${page.pageSubtitle || 'Find answers to common questions about Estalara\'s global real estate platform.'}</textarea>
            </div>
        </div>`;
        
        editorHtml += `<div class="border-b pb-4 mb-4">
            <h4 class="font-semibold text-lg mb-3">CTA Section</h4>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">CTA Title</label>
                <input type="text" name="ctaTitle" class="cms-input w-full" value="${page.ctaTitle || 'Still have questions?'}">
            </div>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">CTA Text</label>
                <textarea name="ctaText" class="cms-input w-full" rows="2">${page.ctaText || 'Our team is here to help you navigate global real estate with confidence.'}</textarea>
            </div>
        </div>`;
    }
    
    // For Privacy page
    if (pageId === 'privacy') {
        editorHtml += `<div class="border-b pb-4 mb-4">
            <h4 class="font-semibold text-lg mb-3">Page Header</h4>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                <input type="text" name="pageTitle" class="cms-input w-full" value="${page.pageTitle || 'Privacy Policy'}">
            </div>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Effective Date</label>
                <input type="text" name="effectiveDate" class="cms-input w-full" value="${page.effectiveDate || 'October 10, 2025'}">
            </div>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
                <input type="text" name="lastUpdated" class="cms-input w-full" value="${page.lastUpdated || 'October 10, 2025'}">
            </div>
        </div>`;
        
        editorHtml += `<div class="border-b pb-4 mb-4">
            <h4 class="font-semibold text-lg mb-3">Company Information</h4>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input type="text" name="companyName" class="cms-input w-full" value="${page.companyName || 'Time2Show, Inc.'}">
            </div>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Company Address</label>
                <input type="text" name="companyAddress" class="cms-input w-full" value="${page.companyAddress || 'Dover, DE, USA'}">
            </div>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                <input type="email" name="contactEmail" class="cms-input w-full" value="${page.contactEmail || 'privacy@estalara.com'}">
            </div>
        </div>`;
    }
    
    // For Terms page
    if (pageId === 'terms') {
        editorHtml += `<div class="border-b pb-4 mb-4">
            <h4 class="font-semibold text-lg mb-3">Page Header</h4>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                <input type="text" name="pageTitle" class="cms-input w-full" value="${page.pageTitle || 'Terms of Service'}">
            </div>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Effective Date</label>
                <input type="text" name="effectiveDate" class="cms-input w-full" value="${page.effectiveDate || 'October 10, 2025'}">
            </div>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
                <input type="text" name="lastUpdated" class="cms-input w-full" value="${page.lastUpdated || 'October 10, 2025'}">
            </div>
        </div>`;
        
        editorHtml += `<div class="border-b pb-4 mb-4">
            <h4 class="font-semibold text-lg mb-3">Company Information</h4>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input type="text" name="companyName" class="cms-input w-full" value="${page.companyName || 'Time2Show, Inc.'}">
            </div>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Company Address</label>
                <input type="text" name="companyAddress" class="cms-input w-full" value="${page.companyAddress || 'Dover, DE, USA'}">
            </div>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Contact Email (Legal)</label>
                <input type="email" name="legalEmail" class="cms-input w-full" value="${page.legalEmail || 'legal@estalara.com'}">
            </div>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">General Contact Email</label>
                <input type="email" name="contactEmail" class="cms-input w-full" value="${page.contactEmail || 'estalara@estalara.com'}">
            </div>
        </div>`;
    }
    
    editorHtml += `<div class="flex justify-end space-x-3 pt-4">
        <button type="button" onclick="hidePageEditor()" class="cms-btn cms-btn-secondary">Cancel</button>
        <button type="submit" class="cms-btn cms-btn-primary">Save Changes</button>
    </div></form>`;
    
    document.getElementById('pageEditorContent').innerHTML = editorHtml;
    
    // Attach form handler
    document.getElementById('pageEditorForm').addEventListener('submit', function(e) {
        e.preventDefault();
        savePageContent(pageId, new FormData(e.target));
    });
    
    // Show modal
    document.getElementById('pageEditorModal').classList.remove('hidden');
    document.getElementById('pageEditorModal').classList.add('flex');
}

function hidePageEditor() {
    document.getElementById('pageEditorModal').classList.add('hidden');
    document.getElementById('pageEditorModal').classList.remove('flex');
}

function savePageContent(pageId, formData) {
    const admin = loadAdminData();
    
    if (!admin.pages[pageId]) {
        admin.pages[pageId] = {};
    }
    
    // Convert form data to object
    const updates = {};
    for (let [key, value] of formData.entries()) {
        // Handle list fields
        if (key.includes('List')) {
            updates[key] = value.split('\n').filter(item => item.trim());
        } else {
            updates[key] = value;
        }
    }
    
    // Update page content
    admin.pages[pageId] = { ...admin.pages[pageId], ...updates };
    
    // Ensure version is set
    if (!admin.version) {
        admin.version = 4;
    }
    
    // Save to localStorage
    localStorage.setItem('estalaraAdminData', JSON.stringify(admin));
    
    // Show success message
    showNotification('Page content updated successfully! Refresh the frontend page to see changes.');
    hidePageEditor();
}

function loadAdminData() {
    const stored = localStorage.getItem('estalaraAdminData');
    if (stored) {
        const data = JSON.parse(stored);
        // Ensure version is set to prevent frontend from resetting data
        if (!data.version) {
            data.version = 4; // Must match version in cms-integration.js
        }
        return data;
    }
    return { version: 4, pages: {}, settings: {}, liveProperties: [], properties: [] };
}

// ===== PAGE STRUCTURE EDITOR FUNCTIONS =====

let currentPageId = 'home';

// Load page structure editor
function loadPageStructureEditor() {
    currentPageId = document.getElementById('page-selector').value;
    renderPageStructure();
}

// Render page structure
function renderPageStructure() {
    const admin = window.estalaraAdmin || window.opener?.estalaraAdmin || parent.estalaraAdmin;
    if (!admin) {
        console.error('EstalaraAdmin not available');
        return;
    }

    const structure = admin.getPageStructure(currentPageId);
    const container = document.getElementById('sections-list');
    
    if (structure.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No sections found for this page.</p>';
        return;
    }

    container.innerHTML = structure.map((section, index) => `
        <div class="bg-white border-2 ${section.visible ? 'border-green-200' : 'border-gray-300'} rounded-lg p-4 hover:shadow-md transition-shadow" data-section-id="${section.id}">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3 flex-1">
                    <div class="text-2xl">
                        ${section.visible ? '👁️' : '🚫'}
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center space-x-2">
                            <h4 class="font-semibold text-gray-900">${section.title}</h4>
                            ${!section.editable ? '<span class="text-xs bg-gray-200 px-2 py-1 rounded">🔒 Locked</span>' : ''}
                        </div>
                        <p class="text-sm text-gray-500">ID: ${section.id} | Type: ${section.type}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <!-- Reorder buttons -->
                    <button 
                        onclick="moveSection('${currentPageId}', '${section.id}', 'up')" 
                        class="cms-btn cms-btn-secondary text-xs px-2 py-1"
                        ${index === 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                        ↑
                    </button>
                    <button 
                        onclick="moveSection('${currentPageId}', '${section.id}', 'down')" 
                        class="cms-btn cms-btn-secondary text-xs px-2 py-1"
                        ${index === structure.length - 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                        ↓
                    </button>
                    <!-- Toggle visibility -->
                    <button 
                        onclick="toggleSectionVisibility('${currentPageId}', '${section.id}')" 
                        class="cms-btn ${section.visible ? 'cms-btn-secondary' : 'cms-btn-success'} text-xs">
                        ${section.visible ? 'Hide' : 'Show'}
                    </button>
                    <!-- Delete button (only for editable sections) -->
                    ${section.editable ? `
                        <button 
                            onclick="deleteSection('${currentPageId}', '${section.id}')" 
                            class="cms-btn cms-btn-danger text-xs">
                            Delete
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Toggle section visibility
function toggleSectionVisibility(pageId, sectionId) {
    const admin = window.estalaraAdmin || window.opener?.estalaraAdmin || parent.estalaraAdmin;
    if (!admin) return;

    admin.toggleSectionVisibility(pageId, sectionId);
    renderPageStructure();
    showNotification('Section visibility toggled successfully!');
}

// Move section up or down
function moveSection(pageId, sectionId, direction) {
    const admin = window.estalaraAdmin || window.opener?.estalaraAdmin || parent.estalaraAdmin;
    if (!admin) return;

    const structure = admin.getPageStructure(pageId);
    const index = structure.findIndex(s => s.id === sectionId);
    
    if (index === -1) return;
    
    if (direction === 'up' && index > 0) {
        [structure[index], structure[index - 1]] = [structure[index - 1], structure[index]];
    } else if (direction === 'down' && index < structure.length - 1) {
        [structure[index], structure[index + 1]] = [structure[index + 1], structure[index]];
    } else {
        return; // Can't move
    }

    // Update order property
    structure.forEach((s, i) => {
        s.order = i + 1;
    });

    admin.updatePageStructure(pageId, structure);
    renderPageStructure();
    showNotification('Section moved successfully!');
}

// Delete section
function deleteSection(pageId, sectionId) {
    if (!confirm('Are you sure you want to delete this section? This action cannot be undone.')) {
        return;
    }

    const admin = window.estalaraAdmin || window.opener?.estalaraAdmin || parent.estalaraAdmin;
    if (!admin) return;

    admin.removeSection(pageId, sectionId);
    renderPageStructure();
    showNotification('Section deleted successfully!');
}

// Show add section modal
function showAddSectionModal() {
    document.getElementById('addSectionModal').classList.remove('hidden');
    document.getElementById('addSectionModal').classList.add('flex');
}

// Hide add section modal
function hideAddSectionModal() {
    document.getElementById('addSectionModal').classList.add('hidden');
    document.getElementById('addSectionModal').classList.remove('flex');
    document.getElementById('addSectionForm').reset();
}

// Preview current page
function previewCurrentPage() {
    const pageFiles = {
        'home': 'index.html',
        'agents': 'agents.html',
        'agencies': 'agencies.html',
        'investors': 'investors.html',
        'about': 'about.html',
        'faq': 'faq.html',
        'privacy': 'privacy.html',
        'terms': 'terms.html'
    };
    
    const file = pageFiles[currentPageId] || 'index.html';
    window.open(file, '_blank');
}

// Reset page structure to default
function resetPageStructure() {
    if (!confirm('Are you sure you want to reset this page structure to default? This will remove all customizations.')) {
        return;
    }

    const admin = window.estalaraAdmin || window.opener?.estalaraAdmin || parent.estalaraAdmin;
    if (!admin) return;

    // Get default structure from localStorage defaults
    const defaultStructures = {
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
    };

    admin.updatePageStructure(currentPageId, defaultStructures[currentPageId] || []);
    renderPageStructure();
    showNotification('Page structure reset to default!');
}

// Show notification
function showNotification(message, type = 'success') {
    console.log(`📢 Notification: [${type}] ${message}`);
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : 
                     type === 'warning' ? 'bg-yellow-500' : 
                     type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300`;
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <span>${type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '✅'}</span>
            <span>${message}</span>
        </div>
    `;
    notification.style.opacity = '0';
    document.body.appendChild(notification);
    
    // Fade in
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // Fade out and remove
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, type === 'error' ? 5000 : 3000); // Errors stay longer
}

// Load properties into the properties table
function loadPropertiesTable() {
    const admin = loadAdminData();
    const tbody = document.getElementById('propertiesTable');
    
    if (!tbody) return;
    
    if (!admin.properties || admin.properties.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-gray-500 py-8">
                    No properties found. Click "Add Property" to create your first listing.
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = admin.properties.map(property => `
        <tr>
            <td>
                <div class="flex items-center space-x-3">
                    <img src="${property.image}" alt="${property.title}" class="w-16 h-16 object-cover rounded">
                    <div>
                        <div class="font-medium">${property.title}</div>
                        <div class="text-sm text-gray-500">${property.type || 'N/A'}</div>
                    </div>
                </div>
            </td>
            <td>${property.location}</td>
            <td>€${(property.price || 0).toLocaleString()}</td>
            <td>
                <span class="cms-badge cms-badge-${property.status === 'live' ? 'live' : 'draft'}">
                    ${property.status || 'live'}
                </span>
            </td>
            <td>
                <button class="cms-btn cms-btn-secondary text-sm mr-2" onclick="editProperty(${property.id})">Edit</button>
                <button class="cms-btn cms-btn-danger text-sm" onclick="deleteProperty(${property.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Initialize page structure editor when section is shown
const originalShowSection = showSection;
showSection = function(sectionId) {
    originalShowSection(sectionId);
    if (sectionId === 'page-structure') {
        loadPageStructureEditor();
    } else if (sectionId === 'properties') {
        loadPropertiesTable();
    } else if (sectionId === 'live-properties') {
        loadLivePropertiesGrid();
    } else if (sectionId === 'frontend-editor') {
        loadFrontendEditor();
    }
};

// ===== FRONTEND EDITOR FUNCTIONS =====

// Tab switching for Frontend Editor
function showFrontendTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.frontend-tab').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    // Remove active state from all tab buttons
    document.querySelectorAll('[id^="tab-"]').forEach(btn => {
        btn.classList.remove('border-blue-500', 'text-blue-600');
        btn.classList.add('border-transparent', 'text-gray-600');
    });
    
    // Show selected tab
    document.getElementById(`frontend-${tabName}`).classList.remove('hidden');
    
    // Add active state to selected tab button
    const activeBtn = document.getElementById(`tab-${tabName}`);
    activeBtn.classList.add('border-blue-500', 'text-blue-600');
    activeBtn.classList.remove('border-transparent', 'text-gray-600');
    
    // Load data for specific tabs
    if (tabName === 'global') {
        loadFrontendGlobal();
    } else if (tabName === 'navigation') {
        loadNavigationEditor();
    } else if (tabName === 'hero') {
        loadHeroEditor();
    } else if (tabName === 'sections') {
        loadSectionsEditor();
    } else if (tabName === 'features') {
        loadFeaturesEditor();
    } else if (tabName === 'buttons') {
        loadButtonsEditor();
    } else if (tabName === 'footer') {
        loadFooterEditor();
    } else if (tabName === 'howitworks') {
        loadHowItWorksEditor();
    }
}

// Load Frontend Editor initial state
function loadFrontendEditor() {
    // Load global tab by default
    showFrontendTab('global');
}

// Global Elements Functions
function loadFrontendGlobal() {
    const admin = loadAdminData();
    
    document.getElementById('global-site-title').value = admin.siteTitle || '';
    document.getElementById('global-site-description').value = admin.siteDescription || '';
    document.getElementById('global-logo-url').value = admin.logoUrl || '';
    document.getElementById('global-contact-email').value = admin.contactEmail || '';
    document.getElementById('global-footer-text').value = admin.footerText || '';
}

function saveFrontendGlobal() {
    const admin = loadAdminData();
    
    admin.siteTitle = document.getElementById('global-site-title').value;
    admin.siteDescription = document.getElementById('global-site-description').value;
    admin.logoUrl = document.getElementById('global-logo-url').value;
    admin.contactEmail = document.getElementById('global-contact-email').value;
    admin.footerText = document.getElementById('global-footer-text').value;
    
    localStorage.setItem('estalaraAdminData', JSON.stringify(admin));
    showNotification('Global settings saved successfully!', 'success');
}

// Navigation Functions
function loadNavigationEditor() {
    const admin = loadAdminData();
    const container = document.getElementById('navigation-items');
    
    // Initialize navigation array if it doesn't exist
    if (!admin.navigation || !Array.isArray(admin.navigation)) {
        admin.navigation = [
            { id: 1, label: 'Home', url: 'index.html', order: 1 },
            { id: 2, label: 'For Agents', url: 'agents.html', order: 2 },
            { id: 3, label: 'For Agencies', url: 'agencies.html', order: 3 },
            { id: 4, label: 'For Investors', url: 'investors.html', order: 4 },
            { id: 5, label: 'About', url: 'about.html', order: 5 }
        ];
        localStorage.setItem('estalaraAdminData', JSON.stringify(admin));
    }
    
    container.innerHTML = admin.navigation
        .sort((a, b) => a.order - b.order)
        .map((item, index) => `
            <div class="cms-card p-4" data-nav-id="${item.id}">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                        <label class="block text-xs text-gray-600 mb-1">Label</label>
                        <input type="text" value="${item.label}" class="cms-input" data-field="label">
                    </div>
                    <div>
                        <label class="block text-xs text-gray-600 mb-1">URL</label>
                        <input type="text" value="${item.url}" class="cms-input" data-field="url">
                    </div>
                    <div class="flex items-end gap-2">
                        <button onclick="moveNavItem(${item.id}, -1)" class="cms-btn cms-btn-secondary text-sm" ${index === 0 ? 'disabled' : ''}>↑</button>
                        <button onclick="moveNavItem(${item.id}, 1)" class="cms-btn cms-btn-secondary text-sm" ${index === admin.navigation.length - 1 ? 'disabled' : ''}>↓</button>
                        <button onclick="deleteNavItem(${item.id})" class="cms-btn cms-btn-danger text-sm flex-1">Delete</button>
                    </div>
                </div>
            </div>
        `).join('');
}

function addNavigationItem() {
    const admin = loadAdminData();
    if (!admin.navigation) admin.navigation = [];
    
    const newId = Math.max(0, ...admin.navigation.map(n => n.id)) + 1;
    admin.navigation.push({
        id: newId,
        label: 'New Link',
        url: '#',
        order: admin.navigation.length + 1
    });
    
    localStorage.setItem('estalaraAdminData', JSON.stringify(admin));
    loadNavigationEditor();
}

function deleteNavItem(id) {
    if (confirm('Delete this navigation item?')) {
        const admin = loadAdminData();
        admin.navigation = admin.navigation.filter(n => n.id !== id);
        localStorage.setItem('estalaraAdminData', JSON.stringify(admin));
        loadNavigationEditor();
    }
}

function moveNavItem(id, direction) {
    const admin = loadAdminData();
    const index = admin.navigation.findIndex(n => n.id === id);
    if (index === -1) return;
    
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= admin.navigation.length) return;
    
    // Swap items
    [admin.navigation[index], admin.navigation[newIndex]] = [admin.navigation[newIndex], admin.navigation[index]];
    
    // Update order values
    admin.navigation.forEach((item, idx) => {
        item.order = idx + 1;
    });
    
    localStorage.setItem('estalaraAdminData', JSON.stringify(admin));
    loadNavigationEditor();
}

function saveFrontendNavigation() {
    const admin = loadAdminData();
    const items = document.querySelectorAll('[data-nav-id]');
    
    items.forEach(item => {
        const id = parseInt(item.getAttribute('data-nav-id'));
        const navItem = admin.navigation.find(n => n.id === id);
        if (navItem) {
            navItem.label = item.querySelector('[data-field="label"]').value;
            navItem.url = item.querySelector('[data-field="url"]').value;
        }
    });
    
    localStorage.setItem('estalaraAdminData', JSON.stringify(admin));
    showNotification('Navigation saved successfully!', 'success');
}

// Hero Sections Functions
function loadHeroEditor() {
    const pageId = document.getElementById('hero-page-selector').value;
    const admin = loadAdminData();
    const container = document.getElementById('hero-editor-content');
    
    const page = admin.pages?.[pageId] || {};
    
    container.innerHTML = `
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Hero Title</label>
            <input type="text" id="hero-title" class="cms-input" value="${page.heroTitle || ''}" placeholder="Enter hero title">
            <p class="text-xs text-gray-500 mt-1">Main headline displayed in the hero section</p>
        </div>
        
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Hero Subtitle</label>
            <textarea id="hero-subtitle" class="cms-input" rows="3" placeholder="Enter hero subtitle">${page.heroSubtitle || ''}</textarea>
            <p class="text-xs text-gray-500 mt-1">Supporting text below the hero title</p>
        </div>
        
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Hero CTA Text</label>
            <input type="text" id="hero-cta-text" class="cms-input" value="${page.heroCtaText || 'Get Started'}" placeholder="Button text">
        </div>
        
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Hero CTA Link</label>
            <input type="text" id="hero-cta-link" class="cms-input" value="${page.heroCtaLink || 'https://app.estalara.com'}" placeholder="Button URL">
        </div>
    `;
}

function saveFrontendHero() {
    const pageId = document.getElementById('hero-page-selector').value;
    const admin = loadAdminData();
    
    if (!admin.pages) admin.pages = {};
    if (!admin.pages[pageId]) admin.pages[pageId] = {};
    
    admin.pages[pageId].heroTitle = document.getElementById('hero-title').value;
    admin.pages[pageId].heroSubtitle = document.getElementById('hero-subtitle').value;
    admin.pages[pageId].heroCtaText = document.getElementById('hero-cta-text').value;
    admin.pages[pageId].heroCtaLink = document.getElementById('hero-cta-link').value;
    
    localStorage.setItem('estalaraAdminData', JSON.stringify(admin));
    showNotification('Hero section saved successfully!', 'success');
}

// Feature Cards Functions
function loadFeaturesEditor() {
    const pageId = document.getElementById('features-page-selector').value;
    const admin = loadAdminData();
    const container = document.getElementById('features-editor-content');
    
    if (!admin.features) admin.features = {};
    if (!admin.features[pageId]) admin.features[pageId] = [];
    
    const features = admin.features[pageId];
    
    container.innerHTML = features.map((feature, index) => `
        <div class="cms-card p-4" data-feature-index="${index}">
            <div class="grid grid-cols-1 gap-3">
                <div>
                    <label class="block text-xs text-gray-600 mb-1">Icon/Emoji</label>
                    <input type="text" value="${feature.icon || '⭐'}" class="cms-input" data-field="icon" placeholder="⭐">
                </div>
                <div>
                    <label class="block text-xs text-gray-600 mb-1">Title</label>
                    <input type="text" value="${feature.title || ''}" class="cms-input" data-field="title">
                </div>
                <div>
                    <label class="block text-xs text-gray-600 mb-1">Description</label>
                    <textarea class="cms-input" rows="2" data-field="description">${feature.description || ''}</textarea>
                </div>
                <div class="flex gap-2">
                    <button onclick="deleteFeature('${pageId}', ${index})" class="cms-btn cms-btn-danger text-sm">Delete Feature</button>
                </div>
            </div>
        </div>
    `).join('') || '<p class="text-gray-500">No feature cards yet. Click "Add Feature Card" to create one.</p>';
}

function addFeatureCard() {
    const pageId = document.getElementById('features-page-selector').value;
    const admin = loadAdminData();
    
    if (!admin.features) admin.features = {};
    if (!admin.features[pageId]) admin.features[pageId] = [];
    
    admin.features[pageId].push({
        icon: '⭐',
        title: 'New Feature',
        description: 'Feature description here'
    });
    
    localStorage.setItem('estalaraAdminData', JSON.stringify(admin));
    loadFeaturesEditor();
}

function deleteFeature(pageId, index) {
    if (confirm('Delete this feature card?')) {
        const admin = loadAdminData();
        admin.features[pageId].splice(index, 1);
        localStorage.setItem('estalaraAdminData', JSON.stringify(admin));
        loadFeaturesEditor();
    }
}

function saveFrontendFeatures() {
    const pageId = document.getElementById('features-page-selector').value;
    const admin = loadAdminData();
    const items = document.querySelectorAll('[data-feature-index]');
    
    if (!admin.features) admin.features = {};
    admin.features[pageId] = [];
    
    items.forEach((item, index) => {
        admin.features[pageId].push({
            icon: item.querySelector('[data-field="icon"]').value,
            title: item.querySelector('[data-field="title"]').value,
            description: item.querySelector('[data-field="description"]').value
        });
    });
    
    localStorage.setItem('estalaraAdminData', JSON.stringify(admin));
    showNotification('Features saved successfully!', 'success');
}

// Buttons & CTAs Functions
function loadButtonsEditor() {
    const pageId = document.getElementById('buttons-page-selector').value;
    const admin = loadAdminData();
    const container = document.getElementById('buttons-editor-content');
    
    if (!admin.buttons) admin.buttons = {};
    if (!admin.buttons[pageId]) {
        admin.buttons[pageId] = {
            primary: { text: 'Get Started', url: 'https://app.estalara.com' },
            secondary: { text: 'Learn More', url: '#features' }
        };
    }
    
    const buttons = admin.buttons[pageId];
    
    container.innerHTML = `
        <div class="cms-card p-4">
            <h4 class="font-medium mb-3">Primary Button</h4>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs text-gray-600 mb-1">Button Text</label>
                    <input type="text" id="primary-btn-text" class="cms-input" value="${buttons.primary?.text || ''}">
                </div>
                <div>
                    <label class="block text-xs text-gray-600 mb-1">Button URL</label>
                    <input type="text" id="primary-btn-url" class="cms-input" value="${buttons.primary?.url || ''}">
                </div>
            </div>
        </div>
        
        <div class="cms-card p-4">
            <h4 class="font-medium mb-3">Secondary Button</h4>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs text-gray-600 mb-1">Button Text</label>
                    <input type="text" id="secondary-btn-text" class="cms-input" value="${buttons.secondary?.text || ''}">
                </div>
                <div>
                    <label class="block text-xs text-gray-600 mb-1">Button URL</label>
                    <input type="text" id="secondary-btn-url" class="cms-input" value="${buttons.secondary?.url || ''}">
                </div>
            </div>
        </div>
    `;
}

function saveFrontendButtons() {
    const pageId = document.getElementById('buttons-page-selector').value;
    const admin = loadAdminData();
    
    if (!admin.buttons) admin.buttons = {};
    
    admin.buttons[pageId] = {
        primary: {
            text: document.getElementById('primary-btn-text').value,
            url: document.getElementById('primary-btn-url').value
        },
        secondary: {
            text: document.getElementById('secondary-btn-text').value,
            url: document.getElementById('secondary-btn-url').value
        }
    };
    
    localStorage.setItem('estalaraAdminData', JSON.stringify(admin));
    showNotification('Buttons saved successfully!', 'success');
}

// Footer Functions
function loadFooterEditor() {
    const admin = loadAdminData();
    
    if (!admin.footer) {
        admin.footer = {
            companyName: 'Estalara',
            tagline: 'Go LIVE. Go GLOBAL.',
            description: 'Connecting real estate agents with global investors through AI and livestreaming technology.',
            links: [
                { label: 'Home', url: 'index.html' },
                { label: 'About', url: 'about.html' },
                { label: 'Privacy Policy', url: 'privacy.html' },
                { label: 'Terms of Service', url: 'terms.html' }
            ],
            socialLinks: [
                { platform: 'LinkedIn', url: 'https://www.linkedin.com/company/estalara' },
                { platform: 'Instagram', url: 'https://www.instagram.com/estalara' },
                { platform: 'TikTok', url: 'https://www.tiktok.com/@estalara' }
            ]
        };
    }
    
    document.getElementById('footer-company-name').value = admin.footer.companyName || '';
    document.getElementById('footer-tagline').value = admin.footer.tagline || '';
    document.getElementById('footer-description').value = admin.footer.description || '';
    
    loadFooterLinks();
    loadSocialLinks();
}

function loadFooterLinks() {
    const admin = loadAdminData();
    const container = document.getElementById('footer-links-container');
    
    container.innerHTML = (admin.footer?.links || []).map((link, index) => `
        <div class="flex gap-2">
            <input type="text" value="${link.label}" class="cms-input flex-1" data-link-label="${index}">
            <input type="text" value="${link.url}" class="cms-input flex-1" data-link-url="${index}">
            <button onclick="deleteFooterLink(${index})" class="cms-btn cms-btn-danger text-sm">Delete</button>
        </div>
    `).join('');
}

function loadSocialLinks() {
    const admin = loadAdminData();
    const container = document.getElementById('social-links-container');
    
    container.innerHTML = (admin.footer?.socialLinks || []).map((link, index) => `
        <div class="flex gap-2">
            <input type="text" value="${link.platform}" class="cms-input flex-1" data-social-platform="${index}" placeholder="Platform">
            <input type="text" value="${link.url}" class="cms-input flex-1" data-social-url="${index}" placeholder="URL">
            <button onclick="deleteSocialLink(${index})" class="cms-btn cms-btn-danger text-sm">Delete</button>
        </div>
    `).join('');
}

function addFooterLink() {
    const admin = loadAdminData();
    if (!admin.footer.links) admin.footer.links = [];
    admin.footer.links.push({ label: 'New Link', url: '#' });
    localStorage.setItem('estalaraAdminData', JSON.stringify(admin));
    loadFooterLinks();
}

function addSocialLink() {
    const admin = loadAdminData();
    if (!admin.footer.socialLinks) admin.footer.socialLinks = [];
    admin.footer.socialLinks.push({ platform: 'New Platform', url: '#' });
    localStorage.setItem('estalaraAdminData', JSON.stringify(admin));
    loadSocialLinks();
}

function deleteFooterLink(index) {
    const admin = loadAdminData();
    admin.footer.links.splice(index, 1);
    localStorage.setItem('estalaraAdminData', JSON.stringify(admin));
    loadFooterLinks();
}

function deleteSocialLink(index) {
    const admin = loadAdminData();
    admin.footer.socialLinks.splice(index, 1);
    localStorage.setItem('estalaraAdminData', JSON.stringify(admin));
    loadSocialLinks();
}

function saveFrontendFooter() {
    const admin = loadAdminData();
    
    admin.footer.companyName = document.getElementById('footer-company-name').value;
    admin.footer.tagline = document.getElementById('footer-tagline').value;
    admin.footer.description = document.getElementById('footer-description').value;
    
    // Save footer links
    admin.footer.links = [];
    document.querySelectorAll('[data-link-label]').forEach((input, index) => {
        const label = input.value;
        const url = document.querySelector(`[data-link-url="${index}"]`).value;
        admin.footer.links.push({ label, url });
    });
    
    // Save social links
    admin.footer.socialLinks = [];
    document.querySelectorAll('[data-social-platform]').forEach((input, index) => {
        const platform = input.value;
        const url = document.querySelector(`[data-social-url="${index}"]`).value;
        admin.footer.socialLinks.push({ platform, url });
    });
    
    localStorage.setItem('estalaraAdminData', JSON.stringify(admin));
    showNotification('Footer saved successfully!', 'success');
}

// Preview and Reset Functions
function previewChanges() {
    window.open('index.html', '_blank');
}

function resetAllFrontend() {
    if (confirm('Are you sure you want to reset ALL frontend elements to default? This cannot be undone.')) {
        const admin = loadAdminData();
        delete admin.navigation;
        delete admin.features;
        delete admin.buttons;
        delete admin.footer;
        delete admin.sectionHeadings;
        delete admin.howItWorks;
        // Reset pages to defaults but keep properties
        admin.pages = {};
        localStorage.setItem('estalaraAdminData', JSON.stringify(admin));
        showNotification('Frontend reset to defaults!', 'success');
        loadFrontendEditor();
    }
}

// ===== SECTION HEADINGS EDITOR =====

function loadSectionsEditor() {
    const page = document.getElementById('sections-page-selector').value;
    const admin = loadAdminData();
    
    if (!admin.sectionHeadings) {
        admin.sectionHeadings = {};
    }
    
    if (!admin.sectionHeadings[page]) {
        // Set defaults based on page
        admin.sectionHeadings[page] = getDefaultSectionHeadings(page);
    }
    
    const sections = admin.sectionHeadings[page];
    const container = document.getElementById('sections-editor-content');
    
    let html = '';
    for (const [sectionId, data] of Object.entries(sections)) {
        html += `
            <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-medium text-gray-900 mb-3">${data.label || sectionId}</h4>
                <div class="space-y-3">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Heading</label>
                        <input type="text" 
                               class="cms-input" 
                               data-section="${sectionId}" 
                               data-field="heading" 
                               value="${data.heading || ''}" 
                               placeholder="${data.placeholderHeading || 'Section heading'}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                        <textarea class="cms-input" 
                                  rows="2" 
                                  data-section="${sectionId}" 
                                  data-field="subtitle" 
                                  placeholder="${data.placeholderSubtitle || 'Section subtitle'}">${data.subtitle || ''}</textarea>
                    </div>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

function getDefaultSectionHeadings(page) {
    const defaults = {
        home: {
            'how-it-works': {
                label: 'How It Works Section',
                heading: 'How It Works',
                subtitle: 'Three simple steps to revolutionize your real estate experience',
                placeholderHeading: 'How It Works',
                placeholderSubtitle: 'Three simple steps...'
            },
            'live-properties': {
                label: 'LIVE Properties Section',
                heading: 'LIVE Properties',
                subtitle: 'Discover properties currently available on our platform',
                placeholderHeading: 'LIVE Properties',
                placeholderSubtitle: 'Discover properties...'
            },
            'features': {
                label: 'Features Section',
                heading: 'Powerful Features',
                subtitle: 'Advanced technology designed for modern real estate professionals',
                placeholderHeading: 'Powerful Features',
                placeholderSubtitle: 'Advanced technology...'
            },
            'cta': {
                label: 'Final CTA Section',
                heading: 'Join the Future of Global Real Estate',
                subtitle: 'Whether you\'re an agent looking to expand globally or an investor seeking international opportunities, Estalara provides the platform you need to succeed.',
                placeholderHeading: 'Join the Future...',
                placeholderSubtitle: 'Whether you\'re an agent...'
            }
        },
        agents: {
            'features': {
                label: 'Features Section',
                heading: 'Everything You Need to Succeed',
                subtitle: 'Powerful tools designed specifically for real estate agents to expand their global reach',
                placeholderHeading: 'Everything You Need...',
                placeholderSubtitle: 'Powerful tools...'
            }
        },
        agencies: {
            'live-selling': {
                label: 'Live Selling Section',
                heading: 'Live selling meets social media',
                subtitle: 'Live tours and real‑time interaction build trust...',
                placeholderHeading: 'Live selling...',
                placeholderSubtitle: 'Live tours...'
            },
            'enterprise-features': {
                label: 'Enterprise Features',
                heading: 'Enterprise Solutions for Growing Agencies',
                subtitle: 'Comprehensive tools and features designed to help real estate agencies scale operations',
                placeholderHeading: 'Enterprise Solutions...',
                placeholderSubtitle: 'Comprehensive tools...'
            }
        },
        investors: {
            'investing-without-borders': {
                label: 'Investing Without Borders',
                heading: 'Investing without borders',
                subtitle: '',
                placeholderHeading: 'Investing without borders',
                placeholderSubtitle: ''
            }
        },
        about: {
            'mission': {
                label: 'Mission Section',
                heading: 'Our Mission',
                subtitle: '',
                placeholderHeading: 'Our Mission',
                placeholderSubtitle: ''
            },
            'vision': {
                label: 'Vision Section',
                heading: 'Our Vision',
                subtitle: '',
                placeholderHeading: 'Our Vision',
                placeholderSubtitle: ''
            },
            'values': {
                label: 'Core Values Section',
                heading: 'Our Core Values',
                subtitle: 'The principles that guide everything we do at Estalara',
                placeholderHeading: 'Our Core Values',
                placeholderSubtitle: 'The principles...'
            },
            'what-is-estalara': {
                label: 'What is Estalara Section',
                heading: 'What is Estalara?',
                subtitle: '',
                placeholderHeading: 'What is Estalara?',
                placeholderSubtitle: ''
            }
        }
    };
    
    return defaults[page] || {};
}

function saveSectionsContent() {
    const page = document.getElementById('sections-page-selector').value;
    const admin = loadAdminData();
    
    if (!admin.sectionHeadings) {
        admin.sectionHeadings = {};
    }
    
    if (!admin.sectionHeadings[page]) {
        admin.sectionHeadings[page] = {};
    }
    
    // Collect all inputs
    document.querySelectorAll('[data-section]').forEach(input => {
        const section = input.dataset.section;
        const field = input.dataset.field;
        
        if (!admin.sectionHeadings[page][section]) {
            admin.sectionHeadings[page][section] = {};
        }
        
        admin.sectionHeadings[page][section][field] = input.value;
    });
    
    localStorage.setItem('estalaraAdminData', JSON.stringify(admin));
    showNotification('Section headings saved successfully!', 'success');
}

// ===== HOW IT WORKS EDITOR =====

function loadHowItWorksEditor() {
    const admin = loadAdminData();
    
    if (!admin.howItWorks) {
        admin.howItWorks = {
            heading: 'How It Works',
            subtitle: 'Three simple steps to revolutionize your real estate experience',
            steps: [
                {
                    number: '1',
                    title: 'Go Live',
                    description: 'Stream your properties to global investors in real-time with our advanced livestreaming technology.'
                },
                {
                    number: '2',
                    title: 'Connect',
                    description: 'Engage with verified investors through AI-powered matching and instant translation capabilities.'
                },
                {
                    number: '3',
                    title: 'Close Fast',
                    description: 'Complete transactions efficiently with our trusted network and streamlined processes.'
                }
            ]
        };
    }
    
    document.getElementById('hiw-heading').value = admin.howItWorks.heading || '';
    document.getElementById('hiw-subtitle').value = admin.howItWorks.subtitle || '';
    
    loadHowItWorksSteps();
}

function loadHowItWorksSteps() {
    const admin = loadAdminData();
    const container = document.getElementById('hiw-steps-container');
    
    if (!admin.howItWorks || !admin.howItWorks.steps) {
        container.innerHTML = '<p class="text-gray-500 text-sm">No steps added yet. Click "+ Add Step" to begin.</p>';
        return;
    }
    
    container.innerHTML = admin.howItWorks.steps.map((step, index) => `
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div class="flex justify-between items-center mb-3">
                <h5 class="font-medium text-gray-900">Step ${index + 1}</h5>
                <button onclick="deleteHowItWorksStep(${index})" class="cms-btn cms-btn-danger text-sm">Delete</button>
            </div>
            <div class="space-y-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Step Number</label>
                    <input type="text" class="cms-input" data-step-index="${index}" data-step-field="number" value="${step.number || (index + 1)}" placeholder="${index + 1}">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Step Title</label>
                    <input type="text" class="cms-input" data-step-index="${index}" data-step-field="title" value="${step.title || ''}" placeholder="Step title">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Step Description</label>
                    <textarea class="cms-input" rows="3" data-step-index="${index}" data-step-field="description" placeholder="Step description">${step.description || ''}</textarea>
                </div>
            </div>
        </div>
    `).join('');
}

function addHowItWorksStep() {
    const admin = loadAdminData();
    
    if (!admin.howItWorks) {
        admin.howItWorks = { heading: '', subtitle: '', steps: [] };
    }
    
    if (!admin.howItWorks.steps) {
        admin.howItWorks.steps = [];
    }
    
    const stepNumber = admin.howItWorks.steps.length + 1;
    admin.howItWorks.steps.push({
        number: stepNumber.toString(),
        title: `Step ${stepNumber}`,
        description: 'Add step description...'
    });
    
    localStorage.setItem('estalaraAdminData', JSON.stringify(admin));
    loadHowItWorksSteps();
}

function deleteHowItWorksStep(index) {
    if (confirm('Delete this step?')) {
        const admin = loadAdminData();
        admin.howItWorks.steps.splice(index, 1);
        localStorage.setItem('estalaraAdminData', JSON.stringify(admin));
        loadHowItWorksSteps();
    }
}

function saveHowItWorks() {
    const admin = loadAdminData();
    
    if (!admin.howItWorks) {
        admin.howItWorks = {};
    }
    
    admin.howItWorks.heading = document.getElementById('hiw-heading').value;
    admin.howItWorks.subtitle = document.getElementById('hiw-subtitle').value;
    
    // Save steps
    admin.howItWorks.steps = [];
    const maxIndex = Math.max(...Array.from(document.querySelectorAll('[data-step-index]')).map(el => parseInt(el.dataset.stepIndex)));
    
    for (let i = 0; i <= maxIndex; i++) {
        const numberInput = document.querySelector(`[data-step-index="${i}"][data-step-field="number"]`);
        const titleInput = document.querySelector(`[data-step-index="${i}"][data-step-field="title"]`);
        const descInput = document.querySelector(`[data-step-index="${i}"][data-step-field="description"]`);
        
        if (titleInput) {
            admin.howItWorks.steps.push({
                number: numberInput?.value || (i + 1).toString(),
                title: titleInput.value,
                description: descInput?.value || ''
            });
        }
    }
    
    localStorage.setItem('estalaraAdminData', JSON.stringify(admin));
    showNotification('How It Works section saved successfully!', 'success');
}
