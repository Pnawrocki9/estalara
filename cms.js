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

function showPropertyModal() {
    document.getElementById('propertyModal').classList.remove('hidden');
    document.getElementById('propertyModal').classList.add('flex');
}

function hidePropertyModal() {
    document.getElementById('propertyModal').classList.add('hidden');
    document.getElementById('propertyModal').classList.remove('flex');
}

function showUploadModal() {
    alert('Media upload coming soon! You can currently add image URLs directly in property forms.');
}

function showUserModal() {
    alert('User management coming soon!');
}

function editProperty(id) {
    alert('Property editor coming soon!');
}

function deleteProperty(id) {
    if (confirm('Are you sure you want to delete this property?')) {
        alert('Property deleted successfully!');
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
}

// Update logo preview
function updateLogoPreview(url) {
    if (!url || !url.trim()) {
        document.getElementById('logo-preview-container').style.display = 'none';
        return;
    }
    
    const previewImg = document.getElementById('logo-preview');
    const previewContainer = document.getElementById('logo-preview-container');
    
    previewImg.src = url;
    previewImg.onerror = function() {
        previewContainer.style.display = 'none';
    };
    previewImg.onload = function() {
        previewContainer.style.display = 'block';
    };
}

// Property Form Handler
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    showSection('dashboard');
    
    // Property form handler
    const propertyForm = document.getElementById('propertyForm');
    if (propertyForm) {
        propertyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const propertyData = Object.fromEntries(formData);
            
            // Here you would normally send this data to your backend
            console.log('New Property Data:', propertyData);
            
            alert('Property saved successfully!');
            hidePropertyModal();
            e.target.reset();
        });
    }
    
    // General settings form handler
    const generalSettingsForm = document.getElementById('general-settings-form');
    if (generalSettingsForm) {
        generalSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveGeneralSettings();
        });
    }
    
    // Logo URL input handler for live preview
    const logoUrlInput = document.getElementById('logo-url');
    if (logoUrlInput) {
        logoUrlInput.addEventListener('input', function(e) {
            updateLogoPreview(e.target.value);
        });
    }
    
    // Logo file upload handler
    const logoUploadInput = document.getElementById('logo-upload');
    if (logoUploadInput) {
        logoUploadInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file is an image
                if (!file.type.startsWith('image/')) {
                    alert('Please upload an image file (PNG, JPG, SVG, etc.)');
                    return;
                }
                
                // Convert to data URL
                const reader = new FileReader();
                reader.onload = function(event) {
                    const dataUrl = event.target.result;
                    // Update the logo URL input with the data URL
                    document.getElementById('logo-url').value = dataUrl;
                    // Update the preview
                    updateLogoPreview(dataUrl);
                    // Show success message
                    showNotification('Logo uploaded successfully! Click "Save Changes" to apply it to your website.');
                };
                reader.onerror = function() {
                    alert('Failed to read the file. Please try again.');
                };
                reader.readAsDataURL(file);
            }
        });
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
    const admin = loadAdminData();
    
    // Get form values
    const siteTitle = document.getElementById('site-title').value;
    const siteDescription = document.getElementById('site-description').value;
    const contactEmail = document.getElementById('contact-email').value;
    const logoUrl = document.getElementById('logo-url').value;
    
    // Update admin data
    admin.siteTitle = siteTitle;
    admin.siteDescription = siteDescription;
    admin.contactEmail = contactEmail;
    admin.logoUrl = logoUrl;
    
    // Save to localStorage
    localStorage.setItem('estalaraAdminData', JSON.stringify(admin));
    
    showNotification('Settings saved successfully! Refresh your website pages to see changes.');
}

// Save platform settings
function savePlatformSettings() {
    const admin = loadAdminData();
    
    if (!admin.settings) {
        admin.settings = {};
    }
    
    admin.settings.currency = document.getElementById('default-currency').value;
    admin.settings.language = document.getElementById('default-language').value;
    
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
    
    // Save to localStorage
    localStorage.setItem('estalaraAdminData', JSON.stringify(admin));
    
    // Show success message
    showNotification('Page content updated successfully! Refresh the frontend page to see changes.');
    hidePageEditor();
}

function loadAdminData() {
    const stored = localStorage.getItem('estalaraAdminData');
    if (stored) {
        return JSON.parse(stored);
    }
    return { pages: {}, settings: {} };
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
        'about': 'about.html'
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
        ]
    };

    admin.updatePageStructure(currentPageId, defaultStructures[currentPageId] || []);
    renderPageStructure();
    showNotification('Page structure reset to default!');
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize page structure editor when section is shown
const originalShowSection = showSection;
showSection = function(sectionId) {
    originalShowSection(sectionId);
    if (sectionId === 'page-structure') {
        loadPageStructureEditor();
    }
};
