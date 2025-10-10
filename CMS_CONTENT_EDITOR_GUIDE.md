# Przewodnik CMS - Edytor Treści

## Co zostało naprawione?

### ✅ Problem 1: Brak odwzorowania tekstów z frontendu w CMS
**Rozwiązanie:** Utworzono pełny edytor treści w CMS, który pozwala edytować wszystkie teksty ze stron:
- Tytuły sekcji Hero
- Podtytuły i opisy
- Treści sekcji tematycznych
- Wszystkie teksty marketingowe

### ✅ Problem 2: Brak sekcji do edycji "For Agents" w CMS
**Rozwiązanie:** Dodano dedykowany edytor dla strony "For Agents" oraz wszystkich pozostałych stron:
- **Home** - Hero, How It Works, Features, CTA
- **For Agents** - Hero, wszystkie teksty strony
- **For Investors** - Hero, 3 sekcje treści (z ikonami i obrazami)
- **For Agencies** - Hero, 3 sekcje, sekcja White Label
- **About** - Hero, wszystkie teksty strony

## Jak korzystać z CMS?

### 1. Logowanie do CMS
1. Otwórz plik `cms-login.html` w przeglądarce
2. Zaloguj się (obecnie bez autentykacji dla developmentu)
3. Zostaniesz przekierowany do panelu CMS

### 2. Edycja treści stron

#### Krok po kroku:
1. W CMS przejdź do sekcji **"📄 Content Editor"** w menu bocznym
2. Zobaczysz listę wszystkich stron z informacją o dostępnych sekcjach do edycji
3. Kliknij przycisk **"Edit Content"** przy wybranej stronie
4. Pojawi się modal z formularzem edycji

#### Dostępne pola do edycji:

**Strona Home:**
- Hero Title - Główny tytuł na stronie głównej
- Hero Subtitle - Podtytuł opisujący Estalara
- How It Works Title/Subtitle - Sekcja "Jak to działa"
- Features Title/Subtitle - Sekcja z funkcjami
- CTA Title/Subtitle - Sekcja Call-to-Action

**Strona For Agents:**
- Hero Title - Główny nagłówek (może zawierać HTML, np. `<span>` dla kolorowania)
- Hero Subtitle - Opis oferty dla agentów

**Strona For Investors:**
- Hero Title i Subtitle
- 3 sekcje treści, każda z:
  - Icon (emoji) - np. 🌍
  - Title - Tytuł sekcji
  - Content - Treść opisowa
  - Image URL - Link do obrazu ilustrującego sekcję

**Strona For Agencies:**
- Hero Title i Subtitle
- 3 sekcje treści (jak w For Investors)
- Sekcja White Label:
  - Title, Subtitle
  - Benefits Title i lista korzyści
  - Why Title i lista powodów
  - Contact Label i Email

**Strona About:**
- Hero Title - Tytuł sekcji "O nas"
- Hero Subtitle - Opis misji i wizji firmy

### 3. Zapisywanie zmian

1. Po wypełnieniu formularza kliknij **"Save Changes"**
2. Dane zostaną zapisane w localStorage przeglądarki
3. Zobaczysz komunikat potwierdzający zapis
4. **Odśwież stronę frontendową** (np. `agents.html`), aby zobaczyć zmiany

### 4. Podgląd zmian

1. Kliknij przycisk **"Preview"** przy wybranej stronie
2. Strona otworzy się w nowej karcie
3. Jeśli nie widzisz zmian, odśwież stronę (F5 lub Ctrl+R)

## Techniczne szczegóły

### Jak działa synchronizacja?

1. **CMS (`cms.html`):**
   - Edytor treści zapisuje dane do `localStorage` pod kluczem `estalaraAdminData`
   - Struktura danych: `{ version: 2, pages: { home: {...}, agents: {...}, ... } }`

2. **Frontend (`cms-integration.js`):**
   - Przy załadowaniu strony skrypt czyta dane z `localStorage`
   - Jeśli istnieją dane dla danej strony, nadpisuje domyślne wartości
   - Aktualizuje elementy DOM na podstawie zapisanych treści

### Struktura danych w localStorage

```json
{
  "version": 2,
  "pages": {
    "home": {
      "heroTitle": "Go LIVE. Go GLOBAL.",
      "heroSubtitle": "...",
      "howItWorksTitle": "...",
      "featuresTitle": "...",
      "ctaTitle": "..."
    },
    "agents": {
      "heroTitle": "Agents Go <span class=\"text-white\">GLOBAL</span>",
      "heroSubtitle": "..."
    },
    "investors": {
      "heroTitle": "...",
      "section1Icon": "🌍",
      "section1Title": "...",
      "section1Content": "...",
      "section1Image": "https://..."
    },
    "agencies": {
      "heroTitle": "...",
      "section1Title": "...",
      "whiteLabelTitle": "...",
      "whiteLabelBenefitsList": ["...", "..."]
    },
    "about": {
      "heroTitle": "About <span class=\"text-white\">ESTALARA</span>",
      "heroSubtitle": "..."
    }
  },
  "properties": [...],
  "settings": {...}
}
```

### Wsparcie dla HTML w treściach

Niektóre pola (np. `heroTitle`) wspierają HTML:
- Możesz używać `<span class="text-white">TEKST</span>` do kolorowania
- Pozostałe tagi HTML również są wspierane
- Bądź ostrożny z XSS - nie wklejaj niezaufanego kodu

## Najczęstsze pytania (FAQ)

### Q: Zmiany nie pojawiają się na stronie?
**A:** Upewnij się, że:
1. Zapisałeś zmiany w CMS (kliknąłeś "Save Changes")
2. Odświeżyłeś stronę frontendową (F5 lub Ctrl+R)
3. Sprawdź konsolę przeglądarki (F12) czy nie ma błędów JavaScript

### Q: Jak przywrócić domyślne wartości?
**A:** 
1. Otwórz konsolę przeglądarki (F12)
2. Wpisz: `localStorage.removeItem('estalaraAdminData')`
3. Odśwież stronę - załadują się wartości domyślne

### Q: Czy mogę dodać nowe sekcje do stron?
**A:** 
Obecnie CMS wspiera predefiniowane sekcje. Aby dodać nowe sekcje:
1. Zmodyfikuj funkcję `loadPageEditor()` w `cms.html`
2. Dodaj obsługę nowych pól w `loadPageContent()` w `cms-integration.js`
3. Upewnij się, że HTML strony ma odpowiednie elementy z ID

### Q: Gdzie są przechowywane obrazy?
**A:** 
Obecnie system używa zewnętrznych URL-i obrazów (np. Unsplash). W przyszłości planujemy dodać:
- Upload obrazów do Media Library
- Integrację z CDN
- Zarządzanie plikami multimedialnymi

## Wsparcie

Jeśli masz pytania lub problemy:
1. Sprawdź konsolę przeglądarki (F12) pod kątem błędów
2. Sprawdź czy `cms-integration.js` jest poprawnie załadowany na stronie
3. Zweryfikuj strukturę danych w localStorage (Application -> Local Storage w DevTools)

## Podsumowanie zmian

### Zmiany w `cms.html`:
- ✅ Dodano pełny edytor stron z modalem
- ✅ Funkcja `loadPageEditor()` - dynamiczne ładowanie formularzy
- ✅ Funkcja `savePageContent()` - zapis do localStorage
- ✅ Wsparcie dla różnych typów pól (text, textarea, listy)
- ✅ Zmieniono nazwę sekcji "Pages" na "Content Editor"
- ✅ Dodano informacyjną kartę z instrukcją

### Zmiany w `cms-integration.js`:
- ✅ Dodano konfigurację dla strony "about"
- ✅ Rozszerzono obsługę `loadPageContent()` o stronę about
- ✅ Już istniejące funkcje obsługują wszystkie strony

### Rezultat:
**Wszystkie teksty z frontendu są teraz w pełni edytowalne przez CMS!**
