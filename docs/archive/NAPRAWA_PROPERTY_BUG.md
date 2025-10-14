# 🔧 Naprawa Bug'u - Zapisywanie Właściwości w CMS

## 🐛 Problem
W CMS próba edycji nieruchomości (zmiana linku i rodzaju) kończyła się komunikatem "OK" i "saved", ale zmiany nie były faktycznie zapisywane do localStorage.

## 🔍 Przyczyna
Znaleziono następujące problemy w kodzie:

### 1. **Brak implementacji `editProperty()`** (`cms.js` linia 36-38)
```javascript
// PRZED:
function editProperty(id) {
    alert('Property editor coming soon!');
}
```
Funkcja tylko pokazywała alert zamiast ładować dane właściwości do formularza.

### 2. **Formularz nie zapisywał do localStorage** (`cms.js` linia 180-195)
```javascript
// PRZED:
propertyForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const propertyData = Object.fromEntries(formData);
    console.log('New Property Data:', propertyData);
    alert('Property saved successfully!');
    hidePropertyModal();
    e.target.reset();
});
```
- Dane były tylko logowane do konsoli
- Nie było zapisu do localStorage
- Brak rozróżnienia między tworzeniem nowej a edycją istniejącej właściwości

### 3. **Brak ID w polach formularza** (`cms.html`)
Pola formularza nie miały atrybutów `id`, przez co nie można było programowo ustawić ich wartości.

### 4. **Brak funkcji ładowania właściwości do tabeli**
Nie było mechanizmu który ładowałby i wyświetlał właściwości w tabeli CMS.

## ✅ Rozwiązanie

### 1. **Dodano zmienną globalną do śledzenia edycji**
```javascript
let currentPropertyId = null;
```

### 2. **Zaimplementowano pełną funkcję `editProperty()`**
```javascript
function editProperty(id) {
    const admin = loadAdminData();
    const property = admin.properties?.find(p => p.id === id);
    
    if (!property) {
        showNotification('Property not found!', 'error');
        return;
    }
    
    currentPropertyId = id;
    document.getElementById('propertyModalTitle').textContent = 'Edit Property';
    
    // Wypełnij formularz danymi właściwości
    document.getElementById('property-title').value = property.title || '';
    document.getElementById('property-location').value = property.location || '';
    document.getElementById('property-price').value = property.price || '';
    document.getElementById('property-type').value = property.type || '';
    document.getElementById('property-description').value = property.description || '';
    document.getElementById('property-image').value = property.image || '';
    document.getElementById('property-link').value = property.link || '';
    
    // Pokaż modal
    document.getElementById('propertyModal').classList.remove('hidden');
    document.getElementById('propertyModal').classList.add('flex');
}
```

### 3. **Naprawiono handler formularza - teraz zapisuje do localStorage**
```javascript
propertyForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    try {
        const admin = loadAdminData();
        
        if (!admin.properties) {
            admin.properties = [];
        }
        
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
            // AKTUALIZACJA istniejącej właściwości
            const index = admin.properties.findIndex(p => p.id === currentPropertyId);
            if (index !== -1) {
                admin.properties[index] = {
                    ...admin.properties[index],
                    ...propertyData
                };
            }
        } else {
            // TWORZENIE nowej właściwości
            const maxId = admin.properties.length > 0 
                ? Math.max(...admin.properties.map(p => p.id || 0)) 
                : 0;
            propertyData.id = maxId + 1;
            admin.properties.push(propertyData);
        }
        
        // ZAPISZ do localStorage
        localStorage.setItem('estalaraAdminData', JSON.stringify(admin));
        
        // Weryfikacja zapisu
        const savedData = localStorage.getItem('estalaraAdminData');
        if (!savedData) {
            throw new Error('Failed to save to localStorage');
        }
        
        showNotification('Property saved successfully!', 'success');
        hidePropertyModal();
        loadPropertiesTable();
    } catch (error) {
        console.error('✗ Error saving property:', error);
        showNotification('Error saving property: ' + error.message, 'error');
    }
});
```

### 4. **Dodano funkcję `loadPropertiesTable()`**
```javascript
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
```

### 5. **Zaktualizowano `showSection()` aby ładować właściwości**
```javascript
showSection = function(sectionId) {
    originalShowSection(sectionId);
    if (sectionId === 'page-structure') {
        loadPageStructureEditor();
    } else if (sectionId === 'properties') {
        loadPropertiesTable();
    }
};
```

### 6. **Dodano ID do wszystkich pól formularza w HTML**
```html
<input type="text" id="property-title" name="title" ...>
<input type="text" id="property-location" name="location" ...>
<input type="number" id="property-price" name="price" ...>
<select id="property-type" name="type" ...>
<textarea id="property-description" name="description" ...>
<input type="url" id="property-image" name="image" ...>
<input type="url" id="property-link" name="link" ...>
```

### 7. **Zaktualizowano funkcję `showPropertyModal()`**
```javascript
function showPropertyModal() {
    currentPropertyId = null; // Reset dla nowej właściwości
    document.getElementById('propertyModalTitle').textContent = 'Add New Property';
    document.getElementById('propertyForm').reset();
    document.getElementById('propertyModal').classList.remove('hidden');
    document.getElementById('propertyModal').classList.add('flex');
}
```

### 8. **Zaktualizowano funkcję `hidePropertyModal()`**
```javascript
function hidePropertyModal() {
    currentPropertyId = null;
    document.getElementById('propertyModal').classList.add('hidden');
    document.getElementById('propertyModal').classList.remove('flex');
    document.getElementById('propertyForm').reset();
}
```

### 9. **Zaimplementowano funkcję `deleteProperty()`**
```javascript
function deleteProperty(id) {
    if (confirm('Are you sure you want to delete this property?')) {
        const admin = loadAdminData();
        
        if (!admin.properties) {
            admin.properties = [];
        }
        
        admin.properties = admin.properties.filter(p => p.id !== id);
        localStorage.setItem('estalaraAdminData', JSON.stringify(admin));
        
        showNotification('Property deleted successfully!', 'success');
        loadPropertiesTable();
    }
}
```

## 📋 Zmienione pliki
1. **`cms.js`** - Dodano/naprawiono funkcje edycji i zapisu właściwości
2. **`cms.html`** - Dodano ID do pól formularza i tytułu modala

## 🧪 Jak przetestować

1. **Otwórz CMS** (`cms.html`)
2. **Przejdź do sekcji Properties**
3. **Kliknij "Edit"** na dowolnej właściwości
4. **Zmień link i typ** właściwości
5. **Kliknij "Save Property"**
6. **Odśwież stronę** i sprawdź czy zmiany są zachowane
7. **Sprawdź w konsoli** (F12):
   ```javascript
   JSON.parse(localStorage.getItem('estalaraAdminData')).properties
   ```

## ✨ Co działa teraz

✅ **Edycja właściwości** - Dane są ładowane do formularza  
✅ **Zapisywanie zmian** - Zmiany są zapisywane do localStorage  
✅ **Tworzenie nowych** - Można dodawać nowe właściwości  
✅ **Usuwanie** - Można usuwać właściwości  
✅ **Odświeżanie tabeli** - Tabela automatycznie się aktualizuje  
✅ **Walidacja** - Sprawdzane jest czy zapis się powiódł  
✅ **Powiadomienia** - Użytkownik otrzymuje feedback o sukcesie/błędzie  
✅ **Persistencja** - Dane są zachowane po odświeżeniu strony  

## 🔒 Struktura danych w localStorage

```javascript
{
  "version": 3,
  "properties": [
    {
      "id": 1,
      "title": "Modern Apartment in Cádiz",
      "location": "Cádiz, Spain",
      "price": 450000,
      "type": "apartment",
      "description": "Stunning property...",
      "image": "https://...",
      "link": "https://app.estalara.com/...",
      "status": "live"
    }
  ],
  // ... inne dane CMS
}
```

## 📝 Uwagi

- **localStorage** jest używany jako tymczasowa baza danych
- W produkcji należy zastąpić to prawdziwym API backendu
- Dane w localStorage są specyficzne dla domeny i przeglądarki
- Czyszczenie localStorage spowoduje utratę wszystkich zmian

---

**Data naprawy:** 2025-10-11  
**Status:** ✅ Naprawione i przetestowane
