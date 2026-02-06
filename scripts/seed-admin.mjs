import "dotenv/config";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

/**
 * Erstellt den initialen Admin-Account für SmartStayChur.
 * 
 * Verwendung:
 *   ADMIN_USERNAME=admin ADMIN_PASSWORD=IhrSicheresPasswort node scripts/seed-admin.mjs
 * 
 * Oder mit Standard-Werten (NUR für Entwicklung!):
 *   node scripts/seed-admin.mjs
 */

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "SmartStay2026!";

async function seedAdmin() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log("Erstelle Admin-Account...");
  
  // Prüfe ob Spalten existieren, wenn nicht, erstelle sie
  try {
    await connection.execute(`ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(128) UNIQUE`);
    await connection.execute(`ALTER TABLE users ADD COLUMN IF NOT EXISTS passwordHash VARCHAR(256)`);
    console.log("✓ Datenbank-Spalten geprüft/erstellt");
  } catch (error) {
    console.log("⚠ Spalten existieren möglicherweise bereits:", error.message);
  }
  
  // Prüfe ob Admin bereits existiert
  const [existing] = await connection.execute(
    "SELECT id FROM users WHERE username = ?",
    [ADMIN_USERNAME]
  );
  
  if (existing.length > 0) {
    // Update Passwort
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, salt);
    await connection.execute(
      "UPDATE users SET passwordHash = ? WHERE username = ?",
      [passwordHash, ADMIN_USERNAME]
    );
    console.log(`✓ Admin-Passwort aktualisiert für "${ADMIN_USERNAME}"`);
  } else {
    // Erstelle neuen Admin
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, salt);
    const openId = `pwd_${nanoid(16)}`;
    
    await connection.execute(
      `INSERT INTO users (openId, username, passwordHash, name, role, loginMethod, lastSignedIn, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, 'admin', 'password', NOW(), NOW(), NOW())`,
      [openId, ADMIN_USERNAME, passwordHash, "Administrator"]
    );
    console.log(`✓ Admin-Account erstellt: "${ADMIN_USERNAME}"`);
  }
  
  console.log(`\nLogin-Daten:`);
  console.log(`  Benutzername: ${ADMIN_USERNAME}`);
  console.log(`  Passwort: ${ADMIN_PASSWORD}`);
  console.log(`\n⚠ Bitte ändern Sie das Passwort nach dem ersten Login!`);
  
  await connection.end();
}

seedAdmin().catch(console.error);
