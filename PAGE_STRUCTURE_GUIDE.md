# Page Structure Editor - Instrukcja użycia

## Przegląd funkcjonalności

Page Structure Editor w CMS Estalara pozwala na pełne zarządzanie strukturą każdej podstrony. Możesz:
- ✅ Dodawać nowe sekcje/bloki
- ✅ Usuwać sekcje (edytowalne)
- ✅ Ukrywać/pokazywać sekcje
- ✅ Zmieniać kolejność sekcji (przyciskami ↑↓)
- ✅ Podglądać zmiany na żywo
- ✅ Resetować strukturę do domyślnej

## Jak korzystać

### 1. Dostęp do edytora

1. Wejdź do CMS: `cms.html`
2. Kliknij w menu boczne: **🧩 Page Structure**
3. Wybierz stronę do edycji z listy rozwijanej

### 2. Wizualna legenda

- **👁️** = Sekcja widoczna (wyświetla się na stronie)
- **🚫** = Sekcja ukryta (nie wyświetla się na stronie)
- **🔒** = Sekcja zablokowana (nie można usunąć, np. Hero Section)
- **↑↓** = Przyciski do zmiany kolejności sekcji

### 3. Podstawowe operacje

#### Ukryj/Pokaż sekcję
- Kliknij przycisk **Hide** aby ukryć widoczną sekcję
- Kliknij przycisk **Show** aby pokazać ukrytą sekcję
- Zmiany są natychmiast zapisywane i widoczne na stronie

#### Zmień kolejność sekcji
- Użyj przycisków **↑** i **↓** aby przesunąć sekcję w górę lub w dół
- Kolejność sekcji na stronie zmienia się automatycznie

#### Usuń sekcję
- Kliknij przycisk **Delete** przy sekcji (tylko dla sekcji edytowalnych)
- Potwierdź operację w oknie dialogowym
- **Uwaga:** Sekcje zablokowane (🔒) nie mogą być usunięte

#### Dodaj nową sekcję
1. Kliknij przycisk **+ Add Section**
2. Wypełnij formularz:
   - **Section ID**: unikalny identyfikator (np. `custom-features`)
     - Używaj tylko małych liter, cyfr i myślników
     - Bez spacji i znaków specjalnych
   - **Section Title**: wyświetlana nazwa (np. "Custom Features")
   - **Section Type**: typ sekcji (section, hero, cta, stats)
3. Kliknij **Add Section**
4. **Ważne**: Po dodaniu sekcji musisz ręcznie dodać odpowiedni HTML do pliku strony z tym samym ID

### 4. Szybkie akcje

#### Podgląd strony
- Kliknij **👁️ Preview Page** aby otworzyć aktualną stronę w nowej karcie
- Zobaczysz stronę ze wszystkimi zastosowanymi zmianami

#### Reset do domyślnej struktury
- Kliknij **🔄 Reset to Default**
- Wszystkie customizacje zostaną usunięte
- Struktura zostanie przywrócona do początkowej konfiguracji

## Struktura danych

Wszystkie zmiany są zapisywane w `localStorage` pod kluczem `estalaraAdminData` w obiekcie `pageStructures`.

Przykładowa struktura dla strony:
```javascript
{
  pageStructures: {
    home: [
      {
        id: 'hero',
        type: 'hero',
        title: 'Hero Section',
        visible: true,
        order: 1,
        editable: false
      },
      {
        id: 'features',
        type: 'section',
        title: 'Features',
        visible: true,
        order: 2,
        editable: true
      }
    ]
  }
}
```

## Dostępne strony

- **Home** (`index.html`)
- **For Agents** (`agents.html`)
- **For Agencies** (`agencies.html`)
- **For Investors** (`investors.html`)
- **About** (`about.html`)

## Najczęstsze problemy

### Problem: Nie widzę zmian na stronie
**Rozwiązanie**: Odśwież stronę (F5) - zmiany są stosowane przy załadowaniu strony

### Problem: Dodałem sekcję ale nie widać jej na stronie
**Rozwiązanie**: Musisz ręcznie dodać HTML dla nowej sekcji w pliku strony z odpowiednim ID:
```html
<section id="custom-section-id">
  <!-- Twoja treść -->
</section>
```

### Problem: Sekcja jest ukryta ale nadal widoczna
**Rozwiązanie**: Sprawdź czy element HTML ma dokładnie ten sam ID co w strukturze

## Techniczne szczegóły

### Pliki zmodyfikowane:
1. **cms-integration.js** - dodane metody zarządzania strukturą stron:
   - `getPageStructure(pageId)`
   - `updatePageStructure(pageId, structure)`
   - `toggleSectionVisibility(pageId, sectionId)`
   - `addSection(pageId, sectionData)`
   - `removeSection(pageId, sectionId)`
   - `reorderSections(pageId, newOrder)`
   - `applyPageStructure(pageId)`

2. **cms.html** - dodana nowa sekcja "Page Structure" z:
   - Wizualnym edytorem struktury
   - Formularzem dodawania sekcji
   - Przyciskami akcji

### Automatyczne działanie:
- Przy każdym załadowaniu strony (`index.html`, `agents.html`, etc.) wywoływana jest metoda `applyPageStructure()`
- Metoda ta ukrywa/pokazuje sekcje zgodnie z ustawieniami visibility
- Wszystkie zmiany są synchronizowane w czasie rzeczywistym

## Przykłady użycia

### Przykład 1: Ukryj sekcję "Features" na stronie głównej
1. Wybierz stronę: **Home**
2. Znajdź sekcję "Features"
3. Kliknij **Hide**
4. Odśwież stronę główną - sekcja Features nie będzie widoczna

### Przykład 2: Zmień kolejność sekcji na stronie Agents
1. Wybierz stronę: **For Agents**
2. Przesuń "Testimonials" w górę przyciskiem ↑
3. Sekcja pojawi się wyżej na stronie

### Przykład 3: Dodaj nową sekcję
1. Kliknij **+ Add Section**
2. Wprowadź:
   - ID: `custom-cta`
   - Title: `Custom Call to Action`
   - Type: `cta`
3. Kliknij **Add Section**
4. Dodaj w pliku HTML:
```html
<section id="custom-cta" class="py-32">
  <div class="max-w-7xl mx-auto px-6">
    <!-- Twoja treść -->
  </div>
</section>
```

## Wsparcie

W razie problemów lub pytań, sprawdź:
- Console przeglądarki (F12) - może zawierać informacje o błędach
- `localStorage` - sprawdź czy dane są poprawnie zapisane
- Pliki HTML - upewnij się że ID sekcji pasują do struktury

---

**Wersja**: 1.0  
**Data**: 2025-10-10  
**Projekt**: Estalara CMS
