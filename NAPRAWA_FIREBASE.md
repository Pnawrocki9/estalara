# 🔧 Naprawa Połączenia Firebase

## ❌ Problem
Widzisz błąd: **"Firebase connection failed. Please check your configuration and internet connection."**

## ✅ Rozwiązanie

### Krok 1: Sprawdź Firebase Database

1. Otwórz **Firebase Console**: https://console.firebase.google.com
2. Wybierz projekt: **estalara-8e22a**
3. W menu po lewej kliknij: **Build → Realtime Database**

#### Jeśli widzisz "Create Database" (baza nie istnieje):
1. Kliknij **"Create Database"**
2. Wybierz lokalizację: **europe-west1 (Frankfurt)**
3. Security rules: wybierz **"Start in test mode"**
4. Kliknij **"Enable"**
5. Przejdź do Kroku 2

#### Jeśli baza już istnieje:
1. Przejdź do zakładki **"Rules"**
2. Sprawdź czy reguły wyglądają tak:

### Krok 2: Ustaw Poprawne Reguły Bezpieczeństwa

W zakładce **Rules** wpisz:

```json
{
  "rules": {
    ".read": true,
    ".write": "auth != null"
  }
}
```

**Wyjaśnienie:**
- `.read: true` = każdy może czytać dane (potrzebne do wyświetlania strony)
- `.write: "auth != null"` = tylko zalogowani użytkownicy mogą zapisywać

Kliknij **"Publish"**

### Krok 3: Sprawdź Authentication

1. W menu po lewej: **Build → Authentication**
2. Zakładka **"Sign-in method"**
3. Sprawdź czy **Email/Password** jest **ENABLED** (włączony)

#### Jeśli NIE jest włączony:
1. Kliknij na **Email/Password**
2. Włącz pierwszą opcję (Email/Password)
3. Kliknij **Save**

### Krok 4: Utwórz Użytkownika Admin

1. W **Authentication**, kliknij zakładkę **"Users"**
2. Kliknij **"Add user"**
3. Wprowadź:
   - **Email**: `admin@estalara.com` (lub Twój email)
   - **Password**: silne hasło (np. `AdminPass123!`)
4. Kliknij **"Add user"**
5. **ZAPISZ** te dane - będziesz ich potrzebować do logowania!

### Krok 5: Sprawdź Projekt ID

1. W Firebase Console, kliknij ikonę ⚙️ → **Project settings**
2. Sprawdź czy **Project ID** to: `estalara-8e22a`
3. Jeśli NIE - skopiuj prawidłowy Project ID

### Krok 6: Test Połączenia

1. Otwórz stronę ponownie
2. Sprawdź konsolę przeglądarki (F12 → Console)
3. Powinieneś zobaczyć:
   ```
   ✅ Firebase initialized successfully
   ✅ Firebase services ready
   ```

## 🚨 Najczęstsze Problemy

### Problem 1: "Database doesn't exist"
**Rozwiązanie**: Wykonaj Krok 1 - utwórz bazę danych

### Problem 2: "Permission denied"
**Rozwiązanie**: Wykonaj Krok 2 - zaktualizuj reguły bezpieczeństwa

### Problem 3: "Invalid API key"
**Rozwiązanie**: Skontaktuj się - może być potrzebna nowa konfiguracja

### Problem 4: Baza w "locked mode" (po 30 dniach)
Firebase automatycznie blokuje bazę po 30 dniach w trybie testowym.

**Rozwiązanie**:
1. Przejdź do **Realtime Database → Rules**
2. Zaktualizuj reguły jak w Kroku 2
3. Kliknij **Publish**

## 📞 Kontakt

Jeśli problem nadal występuje:
1. Sprawdź konsolę przeglądarki (F12 → Console)
2. Skopiuj dokładny komunikat błędu
3. Sprawdź czy masz połączenie z Internetem
4. Spróbuj odświeżyć stronę (Ctrl+F5)

## ✅ Po Naprawie

Kiedy połączenie działa:
1. Otwórz `cms-login.html`
2. Zaloguj się emailem i hasłem z Kroku 4
3. Możesz zarządzać treścią strony!

---

**Data**: 2025-10-13  
**Status**: Instrukcja naprawy gotowa
