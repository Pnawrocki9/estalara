# Przewodnik wgrywania logo do CMS

## Jak dodać własne logo Estalara

Udało się! Dodano funkcję wgrywania logo do CMS-a. Oto jak z niej korzystać:

### Krok 1: Wejdź do CMS

1. Otwórz plik `cms.html` w przeglądarce
2. Zaloguj się do panelu administracyjnego

### Krok 2: Przejdź do ustawień

1. W menu bocznym kliknij na **⚙️ Settings**
2. Zobaczysz sekcję **General Settings**

### Krok 3: Dodaj logo

W sekcji "General Settings" znajdziesz pole **Logo URL (PNG or JPG)**:

1. Wklej URL swojego logo w formacie PNG lub JPG
   - Możesz użyć zewnętrznego linku (np. `https://example.com/logo.png`)
   - Lub ścieżkę lokalną (np. `assets/logo.png`)
   - Domyślnie: `assets/logo.svg`

2. Po wpisaniu URL zobaczysz podgląd logo poniżej pola

3. Kliknij przycisk **Save Changes**

### Krok 4: Zobacz zmiany

1. Odśwież stronę główną lub dowolną podstronę
2. Logo w lewym górnym rogu (nawigacja) oraz w stopce zostanie automatycznie zastąpione Twoim nowym logo

## Gdzie logo się pojawia?

Logo jest wyświetlane w:
- **Nawigacji** (lewy górny róg) na wszystkich stronach
- **Stopce** na dole każdej strony

## Wskazówki

- **Formaty**: Najlepiej używać PNG (z przezroczystym tłem) lub SVG
- **Rozmiar**: Logo powinno mieć wysokość około 40-60px dla najlepszych rezultatów
- **Hosting**: Możesz:
  - Umieścić plik logo w folderze `assets/`
  - Użyć serwisu do hostingu obrazów (np. Imgur, Cloudinary)
  - Wkleić pełny URL z innej strony

## Przywracanie domyślnego logo

Aby przywrócić domyślne logo Estalara:
1. Wejdź do Settings w CMS
2. W polu Logo URL wpisz: `assets/logo.svg`
3. Kliknij Save Changes

## Rozwiązywanie problemów

**Logo się nie wyświetla?**
- Sprawdź, czy URL jest poprawny i dostępny
- Upewnij się, że plik istnieje w podanej lokalizacji
- Sprawdź konsolę przeglądarki (F12) czy nie ma błędów

**Logo jest zbyt duże/małe?**
- Możesz zmodyfikować rozmiar logo edytując klasy CSS w plikach HTML
- Obecne logo używa klas: `h-8 md:h-10` (wysokość 32-40px)
