# 🔐 Instrukcja Logowania do CMS Estalara

## ✅ Prawidłowy sposób logowania

### Krok 1: Otwórz stronę logowania
**Prawidłowy adres:**
```
https://pnawrocki9.github.io/estalara/cms-login.html
```

❌ **NIE** otwieraj bezpośrednio: `cms.html`

### Krok 2: Zaloguj się
1. Wprowadź swój email Firebase
2. Wprowadź hasło
3. Kliknij "Sign In to CMS"

### Krok 3: Zostaniesz przekierowany
Po pomyślnym zalogowaniu system automatycznie przekieruje Cię do panelu CMS (`cms.html`)

## 🛡️ Zabezpieczenia

Od teraz, jeśli spróbujesz wejść bezpośrednio na `cms.html` bez logowania:
- System wykryje brak autentykacji
- Automatycznie przekieruje Cię na stronę logowania
- Musisz się zalogować, aby uzyskać dostęp do CMS

## 🔴 Rozwiązanie błędów Firebase

Czerwone błędy, które widziałeś w konsoli występowały, ponieważ:

1. **Wchodziłeś bezpośrednio na `cms.html`** - omijając proces logowania
2. **Firebase nie był zainicjalizowany** - bo system autentykacji uruchamia się dopiero po zalogowaniu
3. **Brak sesji użytkownika** - Firebase próbował działać bez zalogowanego użytkownika

### Po wprowadzonych zmianach:
✅ System automatycznie przekieruje na logowanie jeśli nie jesteś zalogowany  
✅ Firebase będzie się inicjalizował w prawidłowej kolejności  
✅ Nie będzie błędów w konsoli po zalogowaniu  

## 📝 Dane logowania

Użyj danych logowania, które utworzyłeś w Firebase Console:
- Email: `[twój email Firebase]`
- Hasło: `[twoje hasło Firebase]`

## ❓ Dodatkowe informacje

### Wylogowanie
Aby się wylogować, kliknij przycisk **"Logout"** w prawym górnym rogu CMS.

### Zapomniałeś hasła?
Jeśli zapomniałeś hasła, musisz je zresetować w Firebase Console:
1. Otwórz [Firebase Console](https://console.firebase.google.com/)
2. Wybierz projekt: `estalara-8e22a`
3. Przejdź do Authentication → Users
4. Zresetuj hasło dla swojego użytkownika

### Pierwsze logowanie
Jeśli logujesz się po raz pierwszy, upewnij się że:
1. Utworzyłeś konto użytkownika w Firebase Console
2. Użytkownik ma włączoną metodę Email/Password
3. Konto jest aktywne (nie zablokowane)

## 🔧 Rozwiązywanie problemów

### Problem: "User not found"
- Upewnij się, że utworzyłeś użytkownika w Firebase Console
- Sprawdź czy email jest wpisany poprawnie

### Problem: "Wrong password"
- Sprawdź czy hasło jest poprawne
- Pamiętaj, że hasło jest case-sensitive (wielkie/małe litery)

### Problem: Ciągłe przekierowania
- Wyczyść cache przeglądarki
- Sprawdź czy Firebase jest prawidłowo skonfigurowany

### Problem: Błędy Firebase w konsoli
- Upewnij się, że logujesz się przez `cms-login.html`, nie `cms.html`
- Sprawdź połączenie internetowe
- Odśwież stronę

## 📞 Wsparcie

Jeśli problem nadal występuje:
1. Sprawdź plik `NAPRAWA_FIREBASE.md`
2. Otwórz `test-firebase-connection.html` aby zdiagnozować połączenie
3. Sprawdź konsolę przeglądarki (F12) w poszukiwaniu szczegółowych błędów

---

**Ostatnia aktualizacja:** 2025-10-13  
**Autor:** Background Agent dla projektu Estalara
