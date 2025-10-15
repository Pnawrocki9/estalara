# Fix: Steps Not Displaying in "How It Works" Section

## Problem
Steps w sekcji "How It Works" nie wyświetlały się na stronie głównej (index.html).

## Root Cause
Problem wystąpił, ponieważ dane załadowane z Firebase lub localStorage mogły nie zawierać struktury `howItWorks`, a system nie łączył automatycznie brakujących pól z domyślnymi wartościami.

### Szczegóły techniczne:
1. `content-store.js` zawierał domyślne wartości dla `howItWorks` (linie 456-476)
2. `cms-integration-refactored.js` miał funkcję `loadHowItWorks()` do ładowania sekcji
3. **Problem**: Gdy dane z Firebase/localStorage nie zawierały `howItWorks`, ContentStore nie łączył ich z wartościami domyślnymi
4. Funkcja `loadHowItWorks()` zwracała `return` wcześnie, jeśli `!this.content.howItWorks`

## Solution Implemented

### 1. Zaktualizowano `content-store.js`

#### Zmiany w metodzie `initialize()` (linie 37-44):
```javascript
// Always merge with defaults to ensure all fields exist
this.content = this.mergeWithDefaults(this.content);

// Validate content is complete
if (!this.validateContent(this.content)) {
    console.warn('⚠️ ContentStore: Loaded content is incomplete, using full defaults');
    this.content = this.defaults;
}
```

#### Zmiany w metodzie `loadFromSources()` (linie 66-108):
- Dodano `mergeWithDefaults()` dla danych z localStorage (fast path)
- Dodano `mergeWithDefaults()` dla danych z Firebase
- Dodano `mergeWithDefaults()` w tle podczas aktualizacji z Firebase

```javascript
// Also merge localStorage data with defaults to ensure all fields exist
const normalized = this.normalizeData(localData);
return this.mergeWithDefaults(normalized);
```

#### Rozszerzona metoda `mergeWithDefaults()` (linie 244-250):
```javascript
// Ensure howItWorks exists
if (!result.howItWorks || typeof result.howItWorks !== 'object') {
    result.howItWorks = this.defaults.howItWorks;
}
// Ensure features exist
if (!result.features || typeof result.features !== 'object') {
    result.features = this.defaults.features;
}
```

### 2. Dodano lepsze logowanie w `cms-integration-refactored.js`

Dodano diagnostyczne logi w funkcji `loadHowItWorks()` aby łatwiej debugować:
```javascript
console.log('✅ How It Works: Loading data...', {
    heading: this.content.howItWorks.heading,
    stepsCount: this.content.howItWorks.steps?.length || 0
});
```

### 3. Dodano brakującą strukturę `features` w defaults

Dodano domyślne wartości dla sekcji `features` (linie 478-507), aby zapobiec podobnym problemom w przyszłości.

## Testing

### Jak przetestować fix:
1. Otwórz konsolę przeglądarki
2. Odśwież stronę `index.html`
3. Sprawdź logi:
   ```
   ✅ ContentStore: Ready
      - Navigation: X items
      - Live Properties: X items
      - How It Works: ✅ Available
        Steps: 3
   ✅ How It Works: Loaded 3 steps
   ```
4. Przewiń do sekcji "How It Works" - kroki powinny być widoczne

### Diagnostyka (jeśli nadal występują problemy):
Otwórz konsolę i uruchom:
```javascript
// Sprawdź dane
const content = await window.contentStore.getContent();
console.log('howItWorks:', content.howItWorks);
console.log('steps:', content.howItWorks?.steps);

// Wymuś odświeżenie z CMS
window.forceRefreshFromCMS();

// Wyczyść cache i przeładuj
window.clearCMSCache();
```

## Files Modified

1. **content-store.js**
   - Linia 37-44: Zawsze łącz z domyślnymi wartościami
   - Linia 66-108: Dodano merge w `loadFromSources()`
   - Linia 223-252: Rozszerzono `mergeWithDefaults()`
   - Linia 47-50: Dodano logowanie stanu `howItWorks`
   - Linia 478-507: Dodano domyślne wartości `features`

2. **cms-integration-refactored.js**
   - Linia 286-331: Dodano lepsze logowanie w `loadHowItWorks()`

## Expected Behavior

Po zastosowaniu poprawki:
- ✅ Kroki w sekcji "How It Works" są zawsze widoczne (używając wartości domyślnych lub z CMS)
- ✅ Dane z Firebase/localStorage są automatycznie łączone z wartościami domyślnymi
- ✅ Brakujące pola (`howItWorks`, `features`, itp.) są automatycznie uzupełniane
- ✅ Console.log pokazuje jasne komunikaty o stanie danych

## Status: ✅ FIXED

Sekcja "How It Works" powinna teraz poprawnie wyświetlać kroki na wszystkich stronach, niezależnie od tego czy dane pochodzą z Firebase, localStorage czy domyślnych wartości.
