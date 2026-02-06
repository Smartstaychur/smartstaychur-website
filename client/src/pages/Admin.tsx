import { useProviderAuth } from "@/hooks/useProviderAuth";
import AdminLogin from "./AdminLogin";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Mountain, Hotel, UtensilsCrossed, Users, KeyRound, LogOut, Loader2
} from "lucide-react";

export default function Admin() {
  const { provider, loading, error, login, logout } = useProviderAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!provider) {
    return <AdminLogin onLogin={login} error={error} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link href="/">
              <div className="flex items-center gap-2">
                <Mountain className="h-5 w-5 text-primary" />
                <span className="font-semibold text-primary" style={{ fontFamily: "'Playfair Display', serif" }}>
                  SmartStayChur
                </span>
              </div>
            </Link>
            <span className="text-sm text-muted-foreground">/ Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {provider.displayName || provider.username}
              <span className="ml-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {provider.role === "admin" ? "Admin" : provider.role === "hotelier" ? "Hotelier" : "Gastronom"}
              </span>
            </span>
            <Button variant="ghost" size="sm" onClick={logout} className="gap-1">
              <LogOut className="h-4 w-4" /> Abmelden
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
          Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Hotel Management */}
          {(provider.role === "admin" || provider.role === "hotelier") && (
            <Link href="/admin/hotels">
              <Card className="hover:shadow-lg transition-all cursor-pointer group h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
                    <Hotel className="h-5 w-5" /> Hotels verwalten
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {provider.role === "admin"
                      ? "Alle Hotels anzeigen und bearbeiten"
                      : "Ihr Hotel bearbeiten: Preise, Beschreibung, Bilder"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          )}

          {/* Restaurant Management */}
          {(provider.role === "admin" || provider.role === "gastronom") && (
            <Link href="/admin/restaurants">
              <Card className="hover:shadow-lg transition-all cursor-pointer group h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
                    <UtensilsCrossed className="h-5 w-5" /> Restaurants verwalten
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {provider.role === "admin"
                      ? "Alle Restaurants anzeigen und bearbeiten"
                      : "Ihr Restaurant bearbeiten: Öffnungszeiten, Menü, Beschreibung"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          )}

          {/* Provider Management (admin only) */}
          {provider.role === "admin" && (
            <Link href="/admin/providers">
              <Card className="hover:shadow-lg transition-all cursor-pointer group h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
                    <Users className="h-5 w-5" /> Anbieter verwalten
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Konten für Hotels und Restaurants erstellen und verwalten
                  </p>
                </CardContent>
              </Card>
            </Link>
          )}

          {/* Change Password */}
          <Link href="/admin/password">
            <Card className="hover:shadow-lg transition-all cursor-pointer group h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
                  <KeyRound className="h-5 w-5" /> Passwort ändern
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Ändern Sie Ihr Anmelde-Passwort
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
