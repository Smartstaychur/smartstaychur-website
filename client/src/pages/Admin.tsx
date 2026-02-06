import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
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
  Loader2
} from "lucide-react";

export default function Admin() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/20">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">SmartStayChur</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Admin-Bereich</CardTitle>
              <CardDescription>
                Melden Sie sich an, um Hotels, Restaurants und Erlebnisse zu verwalten.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a href={getLoginUrl()}>
                <Button className="w-full" size="lg">
                  Mit Manus anmelden
                </Button>
              </a>
              <p className="text-xs text-center text-muted-foreground mt-4">
                Nur für autorisierte Anbieter und Administratoren.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold mb-2">Admin-Dashboard</h1>
          <p className="text-muted-foreground mb-8">
            Verwalten Sie Hotels, Restaurants und Erlebnisse auf SmartStayChur.
          </p>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Hotels</p>
                    <p className="text-2xl font-bold">19</p>
                  </div>
                  <Hotel className="w-8 h-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Restaurants</p>
                    <p className="text-2xl font-bold">75</p>
                  </div>
                  <UtensilsCrossed className="w-8 h-8 text-secondary opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Erlebnisse</p>
                    <p className="text-2xl font-bold">15</p>
                  </div>
                  <Mountain className="w-8 h-8 text-accent-foreground opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Benutzer</p>
                    <p className="text-2xl font-bold">1</p>
                  </div>
                  <Users className="w-8 h-8 text-muted-foreground opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Management Sections */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Hotels */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Hotel className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Hotels</CardTitle>
                    <CardDescription>Unterkünfte verwalten</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/admin/hotels">
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="w-4 h-4 mr-2" />
                    Hotels bearbeiten
                  </Button>
                </Link>
                <Link href="/admin/hotels/new">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Neues Hotel
                  </Button>
                </Link>
                <Link href="/admin/room-types">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Zimmertypen
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Restaurants */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <UtensilsCrossed className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <CardTitle>Restaurants</CardTitle>
                    <CardDescription>Gastronomie verwalten</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/admin/restaurants">
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="w-4 h-4 mr-2" />
                    Restaurants bearbeiten
                  </Button>
                </Link>
                <Link href="/admin/restaurants/new">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Neues Restaurant
                  </Button>
                </Link>
                <Link href="/admin/daily-specials">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Tagesmenüs
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Experiences */}
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
                <Link href="/admin/experience-dates">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Termine
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Info Box */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Hotel-Portal für Anbieter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Hotels und Restaurants können ihre eigenen Daten über das Anbieter-Portal pflegen. 
                Dort können Zimmerpreise, Tagesmenüs und weitere Informationen aktualisiert werden.
              </p>
              <Link href="/hotel-portal">
                <Button>
                  Zum Anbieter-Portal →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-white">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SmartStayChur Admin. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  );
}
