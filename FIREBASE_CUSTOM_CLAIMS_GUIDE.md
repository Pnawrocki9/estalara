# 🔐 Firebase Custom Claims - Przewodnik dla Zaawansowanych

## Co to są Custom Claims?

Custom Claims to dodatkowe atrybuty przypisane do użytkownika Firebase Auth, które możesz sprawdzać w regułach zabezpieczeń. To **najbezpieczniejszy sposób** zarządzania uprawnieniami.

### Dlaczego Custom Claims są lepsze niż sprawdzanie emaila?

| Metoda | Bezpieczeństwo | Elastyczność | Trudność |
|--------|----------------|--------------|----------|
| Email Domain (`auth.token.email.matches(...)`) | ⭐⭐⭐ Średnie | ⭐⭐ Niska | ⭐ Łatwe |
| Custom Claims (`auth.token.admin === true`) | ⭐⭐⭐⭐⭐ Wysokie | ⭐⭐⭐⭐⭐ Wysoka | ⭐⭐⭐ Średnie |

**Zalety Custom Claims:**
- ✅ Możesz dodać/usunąć admina bez zmiany emaila
- ✅ Możesz mieć różne poziomy uprawnień (admin, editor, viewer)
- ✅ Nie zależy od domeny emaila
- ✅ Bardziej elastyczne w zarządzaniu zespołem

---

## 🚀 Opcja 1: Proste Rozwiązanie (Email-Based)

**Użyj tego, jeśli:**
- Masz małą liczbę administratorów
- Wszyscy admini mają emaile @estalara.com
- Chcesz szybkie wdrożenie bez dodatkowej konfiguracji

**Reguły do użycia:** `database.rules.email-based.json`

```bash
firebase deploy --only database
```

---

## 🎯 Opcja 2: Zaawansowane Rozwiązanie (Custom Claims)

**Użyj tego, jeśli:**
- Chcesz maksymalne bezpieczeństwo
- Planujesz mieć różne role (admin, editor, moderator)
- Admini mogą mieć różne domeny emailowe

**Reguły do użycia:** `database.rules.production.json`

### Krok 1: Pobierz Service Account Key

1. Otwórz Firebase Console: https://console.firebase.google.com
2. Wybierz projekt **estalara-8e22a**
3. Kliknij ikonę ⚙️ → **Project settings**
4. Zakładka **Service accounts**
5. Kliknij **Generate new private key**
6. Zapisz plik jako `service-account-key.json` w tym folderze

⚠️ **WAŻNE:** Ten plik zawiera wrażliwe dane! Dodaj do `.gitignore`:
```
service-account-key.json
```

### Krok 2: Zainstaluj Firebase Admin SDK

```bash
npm install firebase-admin
```

### Krok 3: Ustaw Custom Claims

#### Metoda A: Lokalnie (Node.js)

```bash
# Edytuj set-admin-custom-claim.js i zmień email
node set-admin-custom-claim.js
```

#### Metoda B: W Firebase Console (przez API)

1. Otwórz Firebase Console
2. Authentication → Users
3. Znajdź użytkownika
4. Skopiuj UID
5. Użyj Firebase CLI:

```bash
firebase functions:shell

# W shellu:
const admin = require('firebase-admin');
admin.auth().setCustomUserClaims('USER_UID', { admin: true });
```

#### Metoda C: Cloud Function (produkcja)

Stwórz Cloud Function:

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.setAdminRole = functions.https.onCall(async (data, context) => {
  // Sprawdź, czy użytkownik wywołujący to już admin
  if (!context.auth.token.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Tylko admini mogą nadawać uprawnienia'
    );
  }
  
  const email = data.email;
  const user = await admin.auth().getUserByEmail(email);
  
  await admin.auth().setCustomUserClaims(user.uid, {
    admin: true
  });
  
  return { success: true, message: `Admin role nadana dla ${email}` };
});
```

### Krok 4: Wdróż Reguły

```bash
# Upewnij się, że firebase.json wskazuje na odpowiedni plik
# Zmień: "rules": "database.rules.production.json"

firebase deploy --only database
```

### Krok 5: Weryfikacja

Użytkownik z custom claim musi się **wylogować i zalogować ponownie**.

```javascript
// Test w konsoli przeglądarki po zalogowaniu
firebase.auth().currentUser.getIdTokenResult()
  .then(idTokenResult => {
    console.log('Claims:', idTokenResult.claims);
    if (idTokenResult.claims.admin) {
      console.log('✅ Użytkownik jest adminem');
    } else {
      console.log('❌ Użytkownik NIE jest adminem');
    }
  });
```

---

## 🔧 Zarządzanie Adminami

### Dodaj nowego admina

```javascript
// set-admin-custom-claim.js
setAdminClaim('nowy-admin@example.com');
```

### Usuń admina

```javascript
removeAdminClaim('stary-admin@example.com');
```

### Lista wszystkich adminów

```javascript
listAdmins();
```

---

## 🎨 Różne Role (Opcjonalnie)

Możesz stworzyć więcej ról:

```javascript
// Ustaw różne role
admin.auth().setCustomUserClaims(uid, {
  admin: true,
  editor: false,
  moderator: false
});
```

W regułach:

```json
{
  "rules": {
    "adminData": {
      ".read": true,
      ".write": "auth != null && (auth.token.admin === true || auth.token.editor === true)"
    },
    "systemLogs": {
      ".read": "auth != null && auth.token.admin === true",
      ".write": "auth != null && auth.token.admin === true"
    }
  }
}
```

---

## 📋 Porównanie Obu Metod

### Email-Based (Prosta)
```json
".write": "auth != null && auth.token.email.matches(/^[a-zA-Z0-9._%+-]+@estalara\\.com$/)"
```
**Plusy:**
- ✅ Szybkie wdrożenie
- ✅ Nie wymaga dodatkowego kodu
- ✅ Działa od razu

**Minusy:**
- ❌ Wszyscy z domeną @estalara.com są adminami
- ❌ Trudniej zarządzać indywidualnymi uprawnieniami
- ❌ Mniej elastyczne

### Custom Claims (Zaawansowana)
```json
".write": "auth != null && auth.token.admin === true"
```
**Plusy:**
- ✅ Maksymalne bezpieczeństwo
- ✅ Pełna kontrola nad uprawnieniami
- ✅ Różne poziomy dostępu
- ✅ Niezależne od domeny email

**Minusy:**
- ❌ Wymaga dodatkowej konfiguracji
- ❌ Potrzebny Firebase Admin SDK
- ❌ Bardziej skomplikowane

---

## 🎯 Rekomendacja

### Dla Małych Projektów / Prototypów
Użyj **Email-Based** (`database.rules.email-based.json`)

### Dla Projektów Produkcyjnych
Użyj **Custom Claims** (`database.rules.production.json`)

---

## ❓ FAQ

### Czy mogę zmienić regułę później?
Tak! Możesz w dowolnym momencie zmienić reguły w Firebase Console.

### Czy użytkownicy zostaną wylogowani?
Nie, ale muszą się **wylogować i zalogować ponownie**, aby custom claims weszły w życie.

### Czy mogę mieć wielu adminów?
Tak! Wywołaj `setAdminClaim()` dla każdego użytkownika.

### Co jeśli zapomniałem ustawić custom claim?
Użyj skryptu `set-admin-custom-claim.js` aby dodać claim dla swojego emaila.

---

**Data utworzenia**: 2025-10-16  
**Autor**: AI Assistant  
**Status**: Gotowe do użycia
