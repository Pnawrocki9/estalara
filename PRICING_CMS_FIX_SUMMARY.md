# Naprawa CMS dla Strony Pricing

## Problem
- Strona Pricing **nie była widoczna** w CMS (sekcja "Sections")
- Nie można było **zapisać zmian** w strukturze strony Pricing
- Kliknięcie **SAVE nie działało** - zmiany nie były zapisywane do Firebase/localStorage

## Przyczyny

### 1. Brak metod zarządzania strukturą strony w `cms-integration-refactored.js`
Pricing.html używa nowego systemu CMS (`cms-integration-refactored.js`), ale ten plik **NIE MIAŁ** kluczowych metod:
- `getPageStructure()` - pobieranie struktury strony
- `updatePageStructure()` - zapisywanie struktury
- `toggleSectionVisibility()` - ukrywanie/pokazywanie sekcji
- `addSection()` - dodawanie nowych sekcji
- `removeSection()` - usuwanie sekcji
- `applyPageStructure()` - stosowanie struktury na stronie

### 2. Brak domyślnych danych dla Pricing w `content-store.js`
W domyślnej konfiguracji brakowało sekcji `pricing` w obiekcie `pages`. Były tylko:
- home
- agents
- agencies
- investors
- about

**BRAKOWAŁO: pricing**

### 3. Brak mapowania w funkcji preview
Funkcja `previewCurrentPage()` w `cms.js` nie miała mapowania dla pricing.

## Rozwiązanie

### ✅ 1. Dodano metody zarządzania strukturą strony do `cms-integration-refactored.js`

```javascript
// Dodano do klasy EstalaraAdmin:

getPageStructure(pageId)
- Zwraca strukturę strony z Firebase/localStorage
- Jeśli nie ma w bazie, zwraca domyślną strukturę
- Zawiera wszystkie 6 sekcji dla Pricing

updatePageStructure(pageId, structure)
- Zapisuje strukturę do this.content.pageStructures
- Zapisuje do Firebase i localStorage przez ContentStore
- Automatycznie stosuje zmiany jeśli jesteś na tej stronie

toggleSectionVisibility(pageId, sectionId)
- Przełącza widoczność sekcji
- Zapisuje zmiany

addSection(pageId, sectionData)
- Dodaje nową sekcję do strony
- Automatycznie ustawia kolejność

removeSection(pageId, sectionId)
- Usuwa sekcję
- Przenumerowuje pozostałe

applyPageStructure(pageId)
- Ukrywa/pokazuje sekcje na podstawie visibility
- Stosuje style display: none/''
```

### ✅ 2. Dodano domyślne dane dla Pricing do `content-store.js`

```javascript
pricing: {
    hero: {
        title: "Simple, Transparent <span class=\"text-white\">PRICING</span>",
        subtitle: "No hidden fees. No surprises. Pay only for what you use and the results you get.",
        ctaText: "Start for Free →",
        ctaUrl: "https://app.estalara.com"
    },
    heroCta1Text: "Start for Free →",
    heroCta1Link: "https://app.estalara.com",
    heroCta2Text: "View Plans",
    heroCta2Link: "#pricing"
}
```

### ✅ 3. Dodano mapowanie pricing w `cms.js`

```javascript
function previewCurrentPage() {
    const pageFiles = {
        'home': 'index.html',
        'agents': 'agents.html',
        'agencies': 'agencies.html',
        'investors': 'investors.html',
        'pricing': 'pricing.html',  // ← DODANO
        'about': 'about.html',
        'faq': 'faq.html',
        'privacy': 'privacy.html',
        'terms': 'terms.html'
    };
    // ...
}
```

## Struktura Domyślna Pricing

Pricing ma teraz 6 sekcji (zgodnie z HTML):

1. **Hero Section** (editable: false)
2. **Pricing Cards** (editable: true)
3. **How It Works** (editable: true)
4. **Value Proposition** (editable: true)
5. **FAQ Section** (editable: true)
6. **CTA Section** (editable: true)

## Co Teraz Działa

✅ **Pricing jest widoczne w CMS**
- W Page Structure można wybrać "Pricing" z listy
- Wszystkie 6 sekcji są widoczne

✅ **SAVE zapisuje zmiany**
- Zmiany są zapisywane do Firebase
- Backup w localStorage
- Zmiany są natychmiast widoczne

✅ **Toggle Visibility działa**
- Można ukrywać/pokazywać sekcje
- Zmiany są zapisywane

✅ **Preview Page działa**
- Przycisk "Preview Page" otwiera pricing.html w nowej karcie

✅ **Nawigacja działa**
- Pricing jest widoczne w menu (visible: true domyślnie)

## Jak Testować

1. Wejdź do CMS: `cms.html`
2. Kliknij "🧩 Page Structure" w sidebar
3. Wybierz "Pricing" z dropdown
4. Zobaczysz 6 sekcji strony Pricing
5. Spróbuj ukryć/pokazać sekcję (kliknij Hide/Show)
6. Kliknij "Preview Page" - powinna otworzyć się pricing.html
7. Sprawdź Firebase/localStorage - dane powinny być zapisane

## Pliki Zmienione

1. **cms-integration-refactored.js** - dodano 6 metod zarządzania strukturą strony
2. **content-store.js** - dodano domyślne dane dla pricing
3. **cms.js** - dodano mapowanie pricing w previewCurrentPage()

## Uwaga dla Przyszłości

Jeśli dodajesz **nową podstronę**:

1. Dodaj mapowanie w `cms.js` → `previewCurrentPage()`
2. Dodaj domyślne dane w `content-store.js` → `pages.{nazwa}`
3. Dodaj domyślną strukturę w `cms-integration-refactored.js` → `getPageStructure()`
4. Dodaj `<option>` w `cms.html` we wszystkich selektorach stron

---

**Problem rozwiązany!** 🎉
Pricing działa teraz w CMS bez komplikowania kodu.
