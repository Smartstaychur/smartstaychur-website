import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { providers } from "../drizzle/schema";

const PROVIDER_COOKIE = "provider_session";
const JWT_SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "smartstaychur-secret-key-2026");

export interface ProviderSession {
  id: number;
  username: string;
  role: "admin" | "hotelier" | "gastronom";
  linkedHotelId: number | null;
  linkedRestaurantId: number | null;
  displayName: string | null;
}

export async function createProviderToken(provider: ProviderSession): Promise<string> {
  return new SignJWT({
    id: provider.id,
    username: provider.username,
    role: provider.role,
    linkedHotelId: provider.linkedHotelId,
    linkedRestaurantId: provider.linkedRestaurantId,
    displayName: provider.displayName,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET_KEY);
}

export async function verifyProviderToken(token: string): Promise<ProviderSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_KEY);
    return payload as unknown as ProviderSession;
  } catch {
    return null;
  }
}

export async function getProviderFromRequest(req: Request): Promise<ProviderSession | null> {
  const cookieHeader = req.headers.cookie || "";
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [key, ...val] = c.trim().split("=");
      return [key, val.join("=")];
    })
  );
  const token = cookies[PROVIDER_COOKIE];
  if (!token) return null;
  return verifyProviderToken(token);
}

function getCookieOptions(req: Request) {
  const isSecure = req.protocol === "https" || req.headers["x-forwarded-proto"] === "https";
  return {
    httpOnly: true,
    secure: isSecure,
    sameSite: isSecure ? ("none" as const) : ("lax" as const),
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

export function createPasswordAuthRouter(): Router {
  const authRouter = Router();

  // POST /api/provider-auth/login
  authRouter.post("/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Benutzername und Passwort erforderlich" });
      }

      const db = await getDb();
      if (!db) {
        return res.status(500).json({ error: "Datenbank nicht verfügbar" });
      }

      const result = await db.select().from(providers).where(eq(providers.username, username)).limit(1);
      const provider = result[0];

      if (!provider || !provider.isActive) {
        return res.status(401).json({ error: "Ungültige Anmeldedaten" });
      }

      const valid = await bcrypt.compare(password, provider.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: "Ungültige Anmeldedaten" });
      }

      const session: ProviderSession = {
        id: provider.id,
        username: provider.username,
        role: provider.role,
        linkedHotelId: provider.linkedHotelId,
        linkedRestaurantId: provider.linkedRestaurantId,
        displayName: provider.displayName,
      };

      const token = await createProviderToken(session);
      res.cookie(PROVIDER_COOKIE, token, getCookieOptions(req));
      return res.json({ success: true, provider: session });
    } catch (error) {
      console.error("[PasswordAuth] Login error:", error);
      return res.status(500).json({ error: "Interner Fehler" });
    }
  });

  // POST /api/provider-auth/logout
  authRouter.post("/logout", async (req: Request, res: Response) => {
    const opts = getCookieOptions(req);
    res.clearCookie(PROVIDER_COOKIE, { ...opts, maxAge: -1 });
    return res.json({ success: true });
  });

  // GET /api/provider-auth/me
  authRouter.get("/me", async (req: Request, res: Response) => {
    const session = await getProviderFromRequest(req);
    if (!session) {
      return res.json({ provider: null });
    }
    return res.json({ provider: session });
  });

  // POST /api/provider-auth/change-password
  authRouter.post("/change-password", async (req: Request, res: Response) => {
    try {
      const session = await getProviderFromRequest(req);
      if (!session) {
        return res.status(401).json({ error: "Nicht angemeldet" });
      }

      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Aktuelles und neues Passwort erforderlich" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ error: "Neues Passwort muss mindestens 6 Zeichen lang sein" });
      }

      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Datenbank nicht verfügbar" });

      const result = await db.select().from(providers).where(eq(providers.id, session.id)).limit(1);
      const provider = result[0];
      if (!provider) return res.status(404).json({ error: "Anbieter nicht gefunden" });

      const valid = await bcrypt.compare(currentPassword, provider.passwordHash);
      if (!valid) return res.status(401).json({ error: "Aktuelles Passwort ist falsch" });

      const newHash = await bcrypt.hash(newPassword, 10);
      await db.update(providers).set({ passwordHash: newHash }).where(eq(providers.id, session.id));

      return res.json({ success: true });
    } catch (error) {
      console.error("[PasswordAuth] Change password error:", error);
      return res.status(500).json({ error: "Interner Fehler" });
    }
  });

  // POST /api/provider-auth/create-provider (admin only)
  authRouter.post("/create-provider", async (req: Request, res: Response) => {
    try {
      const session = await getProviderFromRequest(req);
      if (!session || session.role !== "admin") {
        return res.status(403).json({ error: "Nur Administratoren können Anbieter erstellen" });
      }

      const { username, password, displayName, email, role, linkedHotelId, linkedRestaurantId } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Benutzername und Passwort erforderlich" });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: "Passwort muss mindestens 6 Zeichen lang sein" });
      }

      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Datenbank nicht verfügbar" });

      // Check if username exists
      const existing = await db.select().from(providers).where(eq(providers.username, username)).limit(1);
      if (existing.length > 0) {
        return res.status(409).json({ error: "Benutzername bereits vergeben" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      await db.insert(providers).values({
        username,
        passwordHash,
        displayName: displayName || null,
        email: email || null,
        role: role || "hotelier",
        linkedHotelId: linkedHotelId || null,
        linkedRestaurantId: linkedRestaurantId || null,
      });

      return res.json({ success: true });
    } catch (error) {
      console.error("[PasswordAuth] Create provider error:", error);
      return res.status(500).json({ error: "Interner Fehler" });
    }
  });

  // GET /api/provider-auth/providers (admin only)
  authRouter.get("/providers", async (req: Request, res: Response) => {
    try {
      const session = await getProviderFromRequest(req);
      if (!session || session.role !== "admin") {
        return res.status(403).json({ error: "Nur Administratoren" });
      }

      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Datenbank nicht verfügbar" });

      const allProviders = await db.select({
        id: providers.id,
        username: providers.username,
        displayName: providers.displayName,
        email: providers.email,
        role: providers.role,
        linkedHotelId: providers.linkedHotelId,
        linkedRestaurantId: providers.linkedRestaurantId,
        isActive: providers.isActive,
        createdAt: providers.createdAt,
      }).from(providers);

      return res.json({ providers: allProviders });
    } catch (error) {
      console.error("[PasswordAuth] List providers error:", error);
      return res.status(500).json({ error: "Interner Fehler" });
    }
  });

  // POST /api/provider-auth/toggle-active (admin only)
  authRouter.post("/toggle-active", async (req: Request, res: Response) => {
    try {
      const session = await getProviderFromRequest(req);
      if (!session || session.role !== "admin") {
        return res.status(403).json({ error: "Nur Administratoren" });
      }

      const { providerId, isActive } = req.body;
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Datenbank nicht verfügbar" });

      await db.update(providers).set({ isActive: !!isActive }).where(eq(providers.id, providerId));
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: "Interner Fehler" });
    }
  });

  return authRouter;
}
