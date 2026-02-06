import { useProviderAuth } from "@/hooks/useProviderAuth";
import { trpc } from "@/lib/trpc";
import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Users, Plus, Loader2, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";

interface Provider {
  id: number;
  username: string;
  displayName: string | null;
  email: string | null;
  role: string;
  linkedHotelId: number | null;
  linkedRestaurantId: number | null;
  isActive: boolean;
  createdAt: Date;
}

export default function AdminProviders() {
  const { provider: currentProvider } = useProviderAuth();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  const [newProvider, setNewProvider] = useState({
    username: "",
    password: "",
    displayName: "",
    email: "",
    role: "hotelier",
    linkedHotelId: "",
    linkedRestaurantId: "",
  });

  const { data: allHotels } = trpc.hotel.list.useQuery({});
  const { data: allRestaurants } = trpc.restaurant.list.useQuery({});

  const fetchProviders = useCallback(async () => {
    try {
      const res = await fetch("/api/provider-auth/providers", { credentials: "include" });
      const data = await res.json();
      setProviders(data.providers || []);
    } catch {
      toast.error("Fehler beim Laden der Anbieter");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/provider-auth/create-provider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: newProvider.username,
          password: newProvider.password,
          displayName: newProvider.displayName || null,
          email: newProvider.email || null,
          role: newProvider.role,
          linkedHotelId: newProvider.linkedHotelId ? Number(newProvider.linkedHotelId) : null,
          linkedRestaurantId: newProvider.linkedRestaurantId ? Number(newProvider.linkedRestaurantId) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
      } else {
        toast.success("Anbieter erstellt");
        setShowCreate(false);
        setNewProvider({ username: "", password: "", displayName: "", email: "", role: "hotelier", linkedHotelId: "", linkedRestaurantId: "" });
        fetchProviders();
      }
    } catch {
      toast.error("Netzwerkfehler");
    } finally {
      setCreating(false);
    }
  };

  const toggleActive = async (providerId: number, isActive: boolean) => {
    try {
      await fetch("/api/provider-auth/toggle-active", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ providerId, isActive }),
      });
      fetchProviders();
      toast.success(isActive ? "Anbieter aktiviert" : "Anbieter deaktiviert");
    } catch {
      toast.error("Fehler");
    }
  };

  if (!currentProvider || currentProvider.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" /> Dashboard
              </Button>
            </Link>
            <h1 className="font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" /> Anbieter verwalten
            </h1>
          </div>
          <Button onClick={() => setShowCreate(!showCreate)} className="gap-1">
            <Plus className="h-4 w-4" /> Neuer Anbieter
          </Button>
        </div>
      </header>

      <div className="container py-8">
        {/* Create Form */}
        {showCreate && (
          <Card className="mb-6">
            <CardHeader><CardTitle>Neuen Anbieter erstellen</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Benutzername *</Label>
                  <Input
                    value={newProvider.username}
                    onChange={(e) => setNewProvider({ ...newProvider, username: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Passwort *</Label>
                  <Input
                    type="password"
                    value={newProvider.password}
                    onChange={(e) => setNewProvider({ ...newProvider, password: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Anzeigename</Label>
                  <Input
                    value={newProvider.displayName}
                    onChange={(e) => setNewProvider({ ...newProvider, displayName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>E-Mail</Label>
                  <Input
                    type="email"
                    value={newProvider.email}
                    onChange={(e) => setNewProvider({ ...newProvider, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rolle</Label>
                  <Select value={newProvider.role} onValueChange={(v) => setNewProvider({ ...newProvider, role: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="hotelier">Hotelier</SelectItem>
                      <SelectItem value="gastronom">Gastronom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newProvider.role === "hotelier" && (
                  <div className="space-y-2">
                    <Label>Verknüpftes Hotel</Label>
                    <Select value={newProvider.linkedHotelId} onValueChange={(v) => setNewProvider({ ...newProvider, linkedHotelId: v })}>
                      <SelectTrigger><SelectValue placeholder="Hotel wählen" /></SelectTrigger>
                      <SelectContent>
                        {(allHotels || []).map((h) => (
                          <SelectItem key={h.id} value={String(h.id)}>{h.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {newProvider.role === "gastronom" && (
                  <div className="space-y-2">
                    <Label>Verknüpftes Restaurant</Label>
                    <Select value={newProvider.linkedRestaurantId} onValueChange={(v) => setNewProvider({ ...newProvider, linkedRestaurantId: v })}>
                      <SelectTrigger><SelectValue placeholder="Restaurant wählen" /></SelectTrigger>
                      <SelectContent>
                        {(allRestaurants || []).map((r) => (
                          <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="md:col-span-2 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Abbrechen</Button>
                  <Button type="submit" disabled={creating}>
                    {creating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Erstellen
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Provider List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-3">
            {providers.map((p) => (
              <Card key={p.id} className={!p.isActive ? "opacity-60" : ""}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${p.isActive ? "bg-green-100" : "bg-red-100"}`}>
                      {p.isActive ? <UserCheck className="h-4 w-4 text-green-600" /> : <UserX className="h-4 w-4 text-red-600" />}
                    </div>
                    <div>
                      <p className="font-medium">{p.displayName || p.username}</p>
                      <p className="text-xs text-muted-foreground">
                        @{p.username} · {p.role === "admin" ? "Admin" : p.role === "hotelier" ? "Hotelier" : "Gastronom"}
                        {p.email && ` · ${p.email}`}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(p.id, !p.isActive)}
                  >
                    {p.isActive ? "Deaktivieren" : "Aktivieren"}
                  </Button>
                </CardContent>
              </Card>
            ))}
            {providers.length === 0 && (
              <p className="text-center text-muted-foreground py-8">Noch keine Anbieter vorhanden.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
