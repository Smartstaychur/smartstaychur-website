import { useState, useEffect, useCallback } from "react";
import type { ProviderSession } from "../../../shared/types";

interface UseProviderAuthReturn {
  provider: ProviderSession | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useProviderAuth(): UseProviderAuthReturn {
  const [provider, setProvider] = useState<ProviderSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/provider-auth/me", { credentials: "include" });
      const data = await res.json();
      setProvider(data.provider || null);
      setError(null);
    } catch {
      setProvider(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    setError(null);
    try {
      const res = await fetch("/api/provider-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Anmeldung fehlgeschlagen");
        return false;
      }
      setProvider(data.provider);
      return true;
    } catch {
      setError("Netzwerkfehler");
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/provider-auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setProvider(null);
    }
  }, []);

  return { provider, loading, error, login, logout, refresh };
}
