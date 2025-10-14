# Instrukcja manualnego commitowania zmian - SEO Audit

## Informacje o commit, który był analizowany
**Commit**: b3d4963e50ad11472bf9f08336223f083010f032  
**Tytuł**: feat: Complete SEO audit and optimization  
**Opis**: Implement comprehensive SEO improvements, including meta tags, sitemaps, and schema markup.

## Pliki zmienione w tym commit:
1. FINAL_SUMMARY.md (nowy plik - 563 linie dodane)
2. IMPLEMENTATION_COMPLETE.md (947 linii zmienionych)
3. PR_SUMMARY.md (nowy plik - 651 linii dodanych)
4. README_SEO_AUDIT.md (nowy plik - 493 linie dodane)
5. about.html (5 linii zmienionych)
6. investors.html (6 linii zmienionych)
7. privacy.html (34 linie zmienione)
8. seo/crawl-results.json (118 linii zmienionych)
9. seo/findings.csv (11 linii zmienionych)
10. terms.html (34 linie zmienione)

---

## Instrukcja krok po kroku - Manualny commit

### KROK 1: Sprawdź aktualny status repozytorium
```bash
git status
```
To pokaże Ci, jakie pliki zostały zmienione, dodane lub usunięte.

---

### KROK 2: Przejrzyj zmiany w plikach
Aby zobaczyć szczegółowe zmiany:
```bash
# Dla wszystkich plików
git diff

# Dla konkretnego pliku
git diff nazwa-pliku.html
```

Dla nowych plików (untracked):
```bash
# Wyświetl zawartość nowego pliku
cat nazwa-pliku.md
```

---

### KROK 3: Dodaj pliki do staging area

#### Opcja A: Dodaj wszystkie zmienione pliki
```bash
git add .
```

#### Opcja B: Dodaj pliki selektywnie (ZALECANE dla większej kontroli)

**Dodaj nowe pliki dokumentacji:**
```bash
git add FINAL_SUMMARY.md
git add PR_SUMMARY.md
git add README_SEO_AUDIT.md
```

**Dodaj zmiany w plikach HTML:**
```bash
git add about.html
git add investors.html
git add privacy.html
git add terms.html
```

**Dodaj zmiany w katalogu seo/:**
```bash
git add seo/crawl-results.json
git add seo/findings.csv
```

**Dodaj zmiany w pliku implementacji:**
```bash
git add IMPLEMENTATION_COMPLETE.md
```

#### Opcja C: Dodaj cały katalog
```bash
git add seo/
```

---

### KROK 4: Sprawdź co zostało dodane do staging
```bash
git status
```
Powinieneś zobaczyć pliki w sekcji "Changes to be committed" w kolorze zielonym.

Możesz też sprawdzić szczegóły zmian, które będą commitowane:
```bash
git diff --staged
```

---

### KROK 5: Utwórz commit

#### Opcja A: Prosty commit z jednolinijkową wiadomością
```bash
git commit -m "feat: Complete SEO audit and optimization"
```

#### Opcja B: Commit z szczegółowym opisem (ZALECANE)
```bash
git commit -m "feat: Complete SEO audit and optimization

Implement comprehensive SEO improvements, including:
- Meta tags optimization
- Sitemap generation
- Schema markup implementation
- HTML file updates for better SEO
- SEO audit documentation

Co-authored-by: asi.piotr <asi.piotr@gmail.com>"
```

#### Opcja C: Użyj edytora do napisania wiadomości (dla dłuższych opisów)
```bash
git commit
```
To otworzy edytor (np. vim, nano), gdzie możesz napisać dłuższą wiadomość commit.

W edytorze vim:
1. Naciśnij `i` aby wejść w tryb INSERT
2. Napisz swoją wiadomość commit:
   ```
   feat: Complete SEO audit and optimization
   
   Implement comprehensive SEO improvements, including meta tags,
   sitemaps, and schema markup.
   
   Changes:
   - Added SEO documentation files
   - Updated HTML files with SEO optimizations
   - Generated and updated SEO audit results
   
   Co-authored-by: asi.piotr <asi.piotr@gmail.com>
   ```
3. Naciśnij `ESC` aby wyjść z trybu INSERT
4. Wpisz `:wq` i naciśnij `ENTER` aby zapisać i wyjść

W edytorze nano:
1. Napisz swoją wiadomość
2. Naciśnij `CTRL+O` aby zapisać
3. Naciśnij `ENTER` aby potwierdzić
4. Naciśnij `CTRL+X` aby wyjść

---

### KROK 6: Sprawdź czy commit został utworzony
```bash
git log -1
```
To pokaże Ci ostatni commit z pełnymi szczegółami.

Lub krótsza wersja:
```bash
git log -1 --oneline
```

---

### KROK 7: Push do zdalnego repozytorium (opcjonalnie)

Jeśli chcesz wysłać zmiany na GitHub:

```bash
# Wyślij do obecnego branch
git push

# Lub jeśli jest to nowy branch
git push -u origin nazwa-brancha
```

---

## Przydatne komendy sprawdzające

### Przed commitowaniem:
```bash
# Sprawdź status
git status

# Zobacz co zostanie zcommitowane
git diff --staged

# Sprawdź historię
git log --oneline -10

# Zobacz pliki w staging area
git diff --name-only --staged
```

### Po commitowaniu:
```bash
# Zobacz szczegóły ostatniego commit
git show

# Zobacz statystyki ostatniego commit
git show --stat

# Sprawdź co było zmienione w konkretnym pliku
git show HEAD:nazwa-pliku.html
```

---

## Cofnięcie zmian (jeśli coś poszło nie tak)

### Usuń plik ze staging area (przed commit)
```bash
git reset HEAD nazwa-pliku.html
```

### Cofnij wszystkie pliki ze staging area (przed commit)
```bash
git reset
```

### Zmień ostatni commit (dodaj coś co zapomniałeś)
```bash
# Dodaj zapomniane pliki
git add zapomniany-plik.html

# Zmień ostatni commit
git commit --amend
```

### Zmień tylko wiadomość ostatniego commit
```bash
git commit --amend -m "Nowa wiadomość commit"
```

### Całkowicie cofnij ostatni commit (ale zachowaj zmiany)
```bash
git reset --soft HEAD~1
```

### Całkowicie cofnij ostatni commit (i usuń zmiany) ⚠️ UWAGA
```bash
git reset --hard HEAD~1
```

---

## Dobre praktyki commitowania

1. **Commituj często** - małe, logiczne zmiany są łatwiejsze do prześledzenia
2. **Pisz jasne wiadomości commit** - używaj konwencji conventional commits:
   - `feat:` - nowa funkcjonalność
   - `fix:` - naprawa błędu
   - `docs:` - zmiany w dokumentacji
   - `style:` - formatowanie, brak zmian w kodzie
   - `refactor:` - refaktoryzacja kodu
   - `test:` - dodawanie testów
   - `chore:` - zmiany w narzędziach, konfiguracji
3. **Sprawdzaj przed commit** - zawsze używaj `git status` i `git diff --staged`
4. **Nie commituj wrażliwych danych** - klucze API, hasła, tokeny
5. **Testuj przed commit** - upewnij się, że kod działa

---

## Przykładowy workflow kompletny

```bash
# 1. Sprawdź co się zmieniło
git status

# 2. Przejrzyj zmiany
git diff

# 3. Dodaj wszystkie pliki
git add .

# 4. Sprawdź co zostanie zcommitowane
git status
git diff --staged

# 5. Utwórz commit
git commit -m "feat: Complete SEO audit and optimization

Implement comprehensive SEO improvements, including meta tags, sitemaps, and schema markup."

# 6. Sprawdź commit
git log -1

# 7. Wyślij na GitHub
git push
```

---

## Uwagi końcowe

- Jeśli branch **cursor/run-seo-audit-and-keyword-generation-641f** nie istnieje w repozytorium, możliwe że:
  - Został już zmergowany do main
  - Został usunięty
  - Nazwa jest nieprawidłowa
  
- Najnowszy znaleziony commit SEO to: **b3d4963** - "feat: Complete SEO audit and optimization"

- Aktualne jesteś na branchu: **cursor/review-commit-and-provide-manual-commit-instructions-e6d9**

Jeśli masz pytania dotyczące konkretnego kroku, daj znać!
