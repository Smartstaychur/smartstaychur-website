import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  MapPin, ArrowLeft, Loader2, AlertCircle, CheckCircle2, UserPlus
} from "lucide-react";

export default function AdminProviders() {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    role: "hotelier" as "hotelier" | "restaurateur" | "admin",
    hotelId: "",
    restaurantId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Zugriff verweigert. Nur Administratoren können Anbieter-Konten verwalten.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/create-provider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          hotelId: formData.hotelId ? parseInt(formData.hotelId) : null,
          restaurantId: formData.restaurantId ? parseInt(formData.restaurantId) : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Fehler beim Erstellen des Kontos.");
        return;
      }

      setSuccess(data.message || "Konto erfolgreich erstellt.");
      setFormData({
        username: "",
        password: "",
        name: "",
        email: "",
        role: "hotelier",
        hotelId: "",
        restaurantId: "",
      });
    } catch (err) {
      setError("Verbindungsfehler. Bitte versuchen Sie es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex h-16 items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">SmartStayChur</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container max-w-2xl">
          <h1 className="text-3xl font-bold mb-2">Anbieter-Konto erstellen</h1>
          <p className="text-muted-foreground mb-8">
            Erstellen Sie Zugangsdaten für Hotels und Restaurants, damit diese ihre Daten selbst pflegen können.
          </p>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Neues Anbieter-Konto
              </CardTitle>
              <CardDescription>
                Der Anbieter kann sich mit diesen Zugangsdaten im Admin-Bereich anmelden.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}
                {success && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-md text-sm">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    {success}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      placeholder="z.B. Hotel ABC Chur"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="kontakt@hotel.ch"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Benutzername *</Label>
                    <Input
                      id="username"
                      placeholder="z.B. hotel-abc"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Passwort *</Label>
                    <Input
                      id="password"
                      type="text"
                      placeholder="Sicheres Passwort"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Mindestens 6 Zeichen</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Rolle *</Label>
                  <select
                    id="role"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  >
                    <option value="hotelier">Hotelier (Hotel verwalten)</option>
                    <option value="restaurateur">Gastronom (Restaurant verwalten)</option>
                    <option value="admin">Administrator (alles verwalten)</option>
                  </select>
                </div>

                {formData.role === "hotelier" && (
                  <div className="space-y-2">
                    <Label htmlFor="hotelId">Hotel-ID (aus der Datenbank)</Label>
                    <Input
                      id="hotelId"
                      type="number"
                      placeholder="z.B. 1"
                      value={formData.hotelId}
                      onChange={(e) => setFormData({ ...formData, hotelId: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Die ID des Hotels, das dieser Benutzer verwalten darf.
                    </p>
                  </div>
                )}

                {formData.role === "restaurateur" && (
                  <div className="space-y-2">
                    <Label htmlFor="restaurantId">Restaurant-ID (aus der Datenbank)</Label>
                    <Input
                      id="restaurantId"
                      type="number"
                      placeholder="z.B. 1"
                      value={formData.restaurantId}
                      onChange={(e) => setFormData({ ...formData, restaurantId: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Die ID des Restaurants, das dieser Benutzer verwalten darf.
                    </p>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Erstelle Konto...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Anbieter-Konto erstellen
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
