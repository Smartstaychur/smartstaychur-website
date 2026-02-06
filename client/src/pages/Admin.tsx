import { useState, useCallback } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MapPin,
  Hotel,
  UtensilsCrossed,
  Mountain,
  Settings,
  LogOut,
  Plus,
  Edit,
  BarChart3,
  Users,
  Loader2,
  UserPlus,
  Key
} from "lucide-react";
import AdminLogin from "./AdminLogin";
import { trpc } from "@/lib/trpc";

export default function Admin() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [loginKey, setLoginKey] = useState(0);

  const handleLoginSuccess = useCallback(() => {
    // Force a page reload to pick up the new session cookie
    window.location.reload();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin key={loginKey} onLoginSuccess={handleLoginSuccess} />;
  }

  // Determine what the user can manage based on their role
  const isAdmin = user?.role === "admin";
  const isHotelier = user?.role === "hotelier";
  const isRestaurateur = user?.role === "restaurateur";

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">SmartStayChur</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Angemeldet als <strong>{user?.name || user?.email}</strong>
              {user?.role && (
                <span className="ml-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {user.role === "admin" ? "Administrator" : 
                   user.role === "hotelier" ? "Hotelier" : 
                   user.role === "restaurateur" ? "Gastronom" : user.role}
                </span>
              )}
            </span>
            <Button variant="outline" size="sm" onClick={() => logout()}>
              <LogOut className="w-4 h-4 mr-2" />
              Abmelden
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container">
          <h1 className="text-3xl font-bold mb-2">
            {isAdmin ? "Admin-Dashboard" : "Anbieter-Portal"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {isAdmin 
              ? "Verwalten Sie alle Hotels, Restaurants und Erlebnisse auf SmartStayChur."
              : "Verwalten Sie Ihre Einträge auf SmartStayChur."}
          </p>

          {/* Management Sections */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Hotels - visible for admin and hotelier */}
            {(isAdmin || isHotelier) && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Hotel className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Hotels</CardTitle>
                      <CardDescription>
                        {isAdmin ? "Alle Unterkünfte verwalten" : "Ihre Unterkunft verwalten"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/admin/hotels">
                    <Button variant="outline" className="w-full justify-start">
                      <Edit className="w-4 h-4 mr-2" />
                      {isAdmin ? "Hotels bearbeiten" : "Mein Hotel bearbeiten"}
                    </Button>
                  </Link>
                  {isAdmin && (
                    <Link href="/admin/hotels/new">
                      <Button variant="outline" className="w-full justify-start">
                        <Plus className="w-4 h-4 mr-2" />
                        Neues Hotel
                      </Button>
                    </Link>
                  )}
                  <Link href="/admin/room-types">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Zimmertypen
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Restaurants - visible for admin and restaurateur */}
            {(isAdmin || isRestaurateur) && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <UtensilsCrossed className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <CardTitle>Restaurants</CardTitle>
                      <CardDescription>
                        {isAdmin ? "Alle Gastronomie verwalten" : "Ihr Restaurant verwalten"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/admin/restaurants">
                    <Button variant="outline" className="w-full justify-start">
                      <Edit className="w-4 h-4 mr-2" />
                      {isAdmin ? "Restaurants bearbeiten" : "Mein Restaurant bearbeiten"}
                    </Button>
                  </Link>
                  {isAdmin && (
                    <Link href="/admin/restaurants/new">
                      <Button variant="outline" className="w-full justify-start">
                        <Plus className="w-4 h-4 mr-2" />
                        Neues Restaurant
                      </Button>
                    </Link>
                  )}
                  <Link href="/admin/daily-specials">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Tagesmenüs
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Experiences - visible for admin only */}
            {isAdmin && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/30 rounded-lg flex items-center justify-center">
                      <Mountain className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <CardTitle>Erlebnisse</CardTitle>
                      <CardDescription>Aktivitäten verwalten</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/admin/experiences">
                    <Button variant="outline" className="w-full justify-start">
                      <Edit className="w-4 h-4 mr-2" />
                      Erlebnisse bearbeiten
                    </Button>
                  </Link>
                  <Link href="/admin/experiences/new">
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="w-4 h-4 mr-2" />
                      Neues Erlebnis
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Admin-only: User Management */}
          {isAdmin && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Anbieter-Konten verwalten
                </CardTitle>
                <CardDescription>
                  Erstellen Sie Zugangsdaten für Hotels und Restaurants, damit diese ihre Daten selbst pflegen können.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/providers">
                  <Button>
                    <Users className="w-4 h-4 mr-2" />
                    Anbieter-Konten verwalten
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Password Change */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Key className="w-5 h-5" />
                Passwort ändern
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/admin/change-password">
                <Button variant="outline">
                  Passwort ändern
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-white">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SmartStayChur. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  );
}
