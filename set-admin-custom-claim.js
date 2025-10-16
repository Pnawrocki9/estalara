/**
 * Skrypt do ustawienia Custom Claim "admin" dla użytkownika
 * 
 * UWAGA: Ten skrypt wymaga Firebase Admin SDK i może być uruchomiony tylko:
 * 1. Na serwerze Node.js z zainstalowanym firebase-admin
 * 2. W Firebase Cloud Functions
 * 3. W Firebase CLI z odpowiednimi uprawnieniami
 * 
 * Instrukcja użycia:
 * 
 * Opcja 1: Lokalnie (Node.js)
 * ```bash
 * npm install firebase-admin
 * node set-admin-custom-claim.js
 * ```
 * 
 * Opcja 2: Firebase Functions (zalecane dla produkcji)
 * Wgraj ten kod jako Cloud Function i wywołaj ją z uprawnieniami administratora
 */

// Dla użytku lokalnego (Node.js)
const admin = require('firebase-admin');

// Inicjalizacja Firebase Admin SDK
// UWAGA: Potrzebujesz pliku service account JSON z Firebase Console
// Pobierz go z: Project Settings → Service Accounts → Generate new private key
const serviceAccount = require('./service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://estalara-8e22a-default-rtdb.europe-west1.firebasedatabase.app"
});

/**
 * Ustaw custom claim "admin" dla użytkownika po emailu
 */
async function setAdminClaim(email) {
  try {
    // Znajdź użytkownika po emailu
    const user = await admin.auth().getUserByEmail(email);
    
    // Ustaw custom claim
    await admin.auth().setCustomUserClaims(user.uid, {
      admin: true
    });
    
    console.log(`✅ Custom claim "admin" ustawiony dla użytkownika: ${email}`);
    console.log(`   UID: ${user.uid}`);
    console.log('\n📌 Użytkownik musi się wylogować i zalogować ponownie, aby zmiany weszły w życie.');
    
    return true;
  } catch (error) {
    console.error('❌ Błąd:', error.message);
    return false;
  }
}

/**
 * Usuń custom claim "admin" dla użytkownika
 */
async function removeAdminClaim(email) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    
    await admin.auth().setCustomUserClaims(user.uid, {
      admin: false
    });
    
    console.log(`✅ Custom claim "admin" usunięty dla użytkownika: ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Błąd:', error.message);
    return false;
  }
}

/**
 * Lista wszystkich adminów
 */
async function listAdmins() {
  try {
    const listUsers = await admin.auth().listUsers();
    const admins = [];
    
    for (const user of listUsers.users) {
      if (user.customClaims && user.customClaims.admin === true) {
        admins.push({
          email: user.email,
          uid: user.uid
        });
      }
    }
    
    console.log('\n👥 Lista administratorów:');
    if (admins.length === 0) {
      console.log('   (brak administratorów)');
    } else {
      admins.forEach(admin => {
        console.log(`   - ${admin.email} (${admin.uid})`);
      });
    }
    
    return admins;
  } catch (error) {
    console.error('❌ Błąd:', error.message);
    return [];
  }
}

// Przykłady użycia
async function main() {
  // ZMIEŃ TEN EMAIL NA SWÓJ
  const adminEmail = 'admin@estalara.com';
  
  console.log('🔧 Ustawianie uprawnień administratora...\n');
  
  // Ustaw admina
  await setAdminClaim(adminEmail);
  
  // Lista wszystkich adminów
  await listAdmins();
  
  // Zakończ
  process.exit(0);
}

// Uruchom tylko jeśli wywołano bezpośrednio
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Błąd główny:', error);
    process.exit(1);
  });
}

// Export funkcji dla użycia jako moduł
module.exports = {
  setAdminClaim,
  removeAdminClaim,
  listAdmins
};
