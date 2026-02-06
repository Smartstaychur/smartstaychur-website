import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { users } from "../drizzle/schema";
import { getSessionCookieOptions } from "./_core/cookies";
import { sdk } from "./_core/sdk";
import { getDb } from "./db";
import { nanoid } from "nanoid";

/**
 * Register password-based authentication routes.
 * These routes allow hotels/restaurants to log in with username + password
 * instead of Manus OAuth.
 */
export function registerPasswordAuthRoutes(app: Express) {
  
  // POST /api/auth/login - Login with username + password
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        res.status(400).json({ error: "Benutzername und Passwort sind erforderlich." });
        return;
      }
      
      const db = await getDb();
      if (!db) {
        res.status(500).json({ error: "Datenbank nicht verfügbar." });
        return;
      }
      
      // Find user by username
      const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
      const user = result[0];
      
      if (!user || !user.passwordHash) {
        res.status(401).json({ error: "Ungültiger Benutzername oder Passwort." });
        return;
      }
      
      // Verify password
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        res.status(401).json({ error: "Ungültiger Benutzername oder Passwort." });
        return;
      }
      
      // Update last signed in
      await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, user.id));
      
      // Create session token
      const sessionToken = await sdk.createSessionToken(user.openId, {
        name: user.name || username,
        expiresInMs: ONE_YEAR_MS,
      });
      
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      
      res.json({ 
        success: true, 
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
          hotelId: user.hotelId,
          restaurantId: user.restaurantId,
        }
      });
    } catch (error) {
      console.error("[PasswordAuth] Login failed:", error);
      res.status(500).json({ error: "Anmeldung fehlgeschlagen." });
    }
  });
  
  // POST /api/auth/change-password - Change password (requires auth)
  app.post("/api/auth/change-password", async (req: Request, res: Response) => {
    try {
      const cookies = req.headers.cookie ? require("cookie").parse(req.headers.cookie) : {};
      const sessionCookie = cookies[COOKIE_NAME];
      const session = await sdk.verifySession(sessionCookie);
      
      if (!session) {
        res.status(401).json({ error: "Nicht angemeldet." });
        return;
      }
      
      const { currentPassword, newPassword } = req.body;
      
      if (!newPassword || newPassword.length < 6) {
        res.status(400).json({ error: "Neues Passwort muss mindestens 6 Zeichen lang sein." });
        return;
      }
      
      const db = await getDb();
      if (!db) {
        res.status(500).json({ error: "Datenbank nicht verfügbar." });
        return;
      }
      
      const result = await db.select().from(users).where(eq(users.openId, session.openId)).limit(1);
      const user = result[0];
      
      if (!user) {
        res.status(404).json({ error: "Benutzer nicht gefunden." });
        return;
      }
      
      // If user has existing password, verify current password
      if (user.passwordHash && currentPassword) {
        const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isValid) {
          res.status(401).json({ error: "Aktuelles Passwort ist falsch." });
          return;
        }
      }
      
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(newPassword, salt);
      
      await db.update(users).set({ passwordHash }).where(eq(users.id, user.id));
      
      res.json({ success: true });
    } catch (error) {
      console.error("[PasswordAuth] Change password failed:", error);
      res.status(500).json({ error: "Passwort-Änderung fehlgeschlagen." });
    }
  });
  
  // POST /api/auth/create-provider - Admin creates a provider account
  app.post("/api/auth/create-provider", async (req: Request, res: Response) => {
    try {
      const cookies = req.headers.cookie ? require("cookie").parse(req.headers.cookie) : {};
      const sessionCookie = cookies[COOKIE_NAME];
      const session = await sdk.verifySession(sessionCookie);
      
      if (!session) {
        res.status(401).json({ error: "Nicht angemeldet." });
        return;
      }
      
      const db = await getDb();
      if (!db) {
        res.status(500).json({ error: "Datenbank nicht verfügbar." });
        return;
      }
      
      // Check if requester is admin
      const adminResult = await db.select().from(users).where(eq(users.openId, session.openId)).limit(1);
      const admin = adminResult[0];
      
      if (!admin || admin.role !== "admin") {
        res.status(403).json({ error: "Nur Administratoren können Anbieter-Konten erstellen." });
        return;
      }
      
      const { username, password, name, email, role, hotelId, restaurantId } = req.body;
      
      if (!username || !password || !name) {
        res.status(400).json({ error: "Benutzername, Passwort und Name sind erforderlich." });
        return;
      }
      
      if (!["hotelier", "restaurateur", "admin"].includes(role)) {
        res.status(400).json({ error: "Ungültige Rolle. Erlaubt: hotelier, restaurateur, admin." });
        return;
      }
      
      // Check if username already exists
      const existing = await db.select().from(users).where(eq(users.username, username)).limit(1);
      if (existing.length > 0) {
        res.status(409).json({ error: "Benutzername bereits vergeben." });
        return;
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      
      // Create user with a unique openId for password-based users
      const openId = `pwd_${nanoid(16)}`;
      
      await db.insert(users).values({
        openId,
        username,
        passwordHash,
        name,
        email: email || null,
        role,
        hotelId: hotelId || null,
        restaurantId: restaurantId || null,
        loginMethod: "password",
        lastSignedIn: new Date(),
      });
      
      res.json({ success: true, message: `Anbieter-Konto für "${name}" erstellt.` });
    } catch (error) {
      console.error("[PasswordAuth] Create provider failed:", error);
      res.status(500).json({ error: "Konto-Erstellung fehlgeschlagen." });
    }
  });
}
