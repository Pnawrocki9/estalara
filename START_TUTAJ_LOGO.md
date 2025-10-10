# 🎯 START TUTAJ - ZMIANA LOGO

## ✅ LOGO DZIAŁA! Problem został naprawiony.

---

## 🚀 SZYBKA ZMIANA LOGO (3 SEKUNDY!)

### Krok 1: Otwórz plik
```
QUICK_LOGO_TEST.html
```

### Krok 2: Kliknij przycisk
- 📁 **EstalaraLogo.png** (wersja 1)
- 📁 **EstalaraLogo-alt.png** (wersja 2)
- 🔄 **logo.svg** (domyślne)

### Krok 3: Gotowe! ✅
Logo zmienione i zapisane. Odśwież index.html aby zobaczyć efekt.

---

## 📝 ALTERNATYWNIE: Przez CMS

1. Otwórz `cms.html`
2. Kliknij **⚙️ Settings** w menu
3. Znajdź sekcję "Upload Logo"
4. Wpisz: `assets/EstalaraLogo.png`
5. Kliknij **Save Changes**
6. Odśwież stronę główną

---

## 🎨 WŁASNE LOGO

### Krok 1: Przygotuj plik
- Format: PNG, SVG, JPG
- Nazwa BEZ spacji: `MojeLogo.png` ✅ (nie "Moje Logo.png" ❌)
- Rozmiar: < 100KB

### Krok 2: Umieść w folderze
```
assets/MojeLogo.png
```

### Krok 3: Zmień logo
- Otwórz `QUICK_LOGO_TEST.html`
- Wpisz w pole: `assets/MojeLogo.png`
- Kliknij "Zmień"

---

## ✅ SPRAWDŹ CZY DZIAŁA

### Test 5 sekund:
1. Otwórz `QUICK_LOGO_TEST.html`
2. Kliknij dowolny przycisk
3. Czy logo się zmieniło? → **DZIAŁA!** ✅

### Test konsoli (dla pewności):
1. Otwórz dowolną stronę (np. index.html)
2. Naciśnij **F12** → zakładka **Console**
3. Wpisz:
```javascript
JSON.parse(localStorage.getItem('estalaraAdminData')).logoUrl
```
4. Pokaże ścieżkę do aktualnego logo

---

## 📁 DOSTĘPNE LOGA

W folderze `assets/` są gotowe pliki:

| Plik | Opis |
|------|------|
| `logo.svg` | Domyślne logo (SVG) |
| `EstalaraLogo.png` | Logo PNG (wersja 1) |
| `EstalaraLogo-alt.png` | Logo PNG (wersja 2) |

---

## 🐛 NIE DZIAŁA?

### Rozwiązanie 1: Odśwież z czyszczeniem cache
```
Ctrl + F5
```

### Rozwiązanie 2: Sprawdź logi
```
F12 → Console → szukaj 🔄 emoji lub czerwonych błędów
```

### Rozwiązanie 3: Użyj narzędzi diagnostycznych
```
test-logo-system.html → Uruchom wszystkie testy
```

### Rozwiązanie 4: Wymuś update
```javascript
// W konsoli (F12):
window.estalaraAdmin.updateLogo('assets/EstalaraLogo.png');
```

---

## 💡 WAŻNE WSKAZÓWKI

### ✅ TAK (dobre praktyki):
- `assets/MojeLogo.png` - ścieżka względna ✅
- `MojeLogo.png` - bez spacji ✅
- Format SVG lub PNG ✅
- Rozmiar < 100KB ✅

### ❌ NIE (częste błędy):
- `/assets/logo.png` - ścieżka bezwzględna ❌
- `Moje Logo.png` - spacje w nazwie ❌
- Plik > 1MB - za duży ❌
- Zapomnienie odświeżenia strony ❌

---

## 📚 DOKUMENTACJA

Jeśli potrzebujesz więcej informacji:

1. **PODSUMOWANIE_NAPRAWY.md** - kompletny przewodnik
2. **LOGO_FIX_FINAL_REPORT.md** - raport techniczny (dla developerów)
3. **JAK_ZMIENIC_LOGO.md** - szczegółowa instrukcja krok po kroku

---

## 🎯 NAJCZĘSTSZE PYTANIA

### Q: Gdzie logo się pojawia?
**A:** W nawigacji (header) i stopce (footer) na wszystkich stronach.

### Q: Czy muszę zmieniać logo na każdej stronie osobno?
**A:** NIE! Zmiana w jednym miejscu aktualizuje logo WSZĘDZIE.

### Q: Co jeśli chcę wrócić do domyślnego logo?
**A:** Otwórz `QUICK_LOGO_TEST.html` → kliknij "🔄 Przywróć logo.svg"

### Q: Czy logo będzie działać po wdrożeniu na Netlify?
**A:** TAK! Pod warunkiem że:
- Używasz ścieżki względnej (np. `assets/logo.png`)
- Plik jest w folderze `assets/` w repo Git

### Q: Jak sprawdzić czy logo jest zapisane?
**A:** Konsola (F12) → wpisz:
```javascript
JSON.parse(localStorage.getItem('estalaraAdminData')).logoUrl
```

---

## ✨ PODSUMOWANIE

**Logo działa!** System został naprawiony 2025-10-10.

**Najszybsza metoda:**
```
QUICK_LOGO_TEST.html → Kliknij przycisk → Gotowe! 🎉
```

**Pamiętaj:**
- Odśwież stronę po zmianie (Ctrl+F5)
- Używaj plików z folderu `assets/`
- Nazwy bez spacji

---

**Powodzenia!** 🚀

Jeśli masz pytania, sprawdź szczegółową dokumentację w plikach .md lub użyj narzędzi diagnostycznych.
