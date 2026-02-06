import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  MapPin, ArrowLeft, Loader2, Save, UtensilsCrossed, Edit, CheckCircle2, AlertCircle, Clock
} from "lucide-react";

const DAYS = [
  { key: "monday", label: "Montag" },
  { key: "tuesday", label: "Dienstag" },
  { key: "wednesday", label: "Mittwoch" },
  { key: "thursday", label: "Donnerstag" },
  { key: "friday", label: "Freitag" },
  { key: "saturday", label: "Samstag" },
  { key: "sunday", label: "Sonntag" },
];

export default function AdminRestaurants() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === "admin";
  
  const { data: restaurants, isLoading } = trpc.restaurants.list.useQuery();
  const updateRestaurant = trpc.restaurants.update.useMutation();
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Record<string, any>>({});
  const [saveStatus, setSaveStatus] = useState<{ id: number; status: "success" | "error"; message: string } | null>(null);

  const visibleRestaurants = isAdmin 
    ? restaurants 
    : restaurants?.filter(r => r.id === user?.restaurantId);

  const startEditing = (restaurant: any) => {
    setEditingId(restaurant.id);
    
    // Parse opening hours
    let openingHours: Record<string, string> = {};
    if (restaurant.openingHours) {
      try {
        openingHours = typeof restaurant.openingHours === "string" 
          ? JSON.parse(restaurant.openingHours) 
          : restaurant.openingHours;
      } catch {}
    }
    
    setEditData({
      name: restaurant.name || "",
      cuisineType: restaurant.cuisineType || "",
      shortDescription: restaurant.shortDescription || "",
      description: restaurant.description || "",
      phone: restaurant.phone || "",
      email: restaurant.email || "",
      website: restaurant.website || "",
      menuUrl: restaurant.menuUrl || "",
      openingHours,
    });
  };

  const handleSave = async (id: number) => {
    try {
      const { openingHours, menuUrl, ...rest } = editData;
      await updateRestaurant.mutateAsync({ 
        id, 
        data: {
          ...rest,
          openingHours: Object.keys(openingHours).length > 0 ? openingHours : undefined,
        }
      });
      setSaveStatus({ id, status: "success", message: "Gespeichert!" });
      setEditingId(null);
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: any) {
      setSaveStatus({ id, status: "error", message: err.message || "Fehler beim Speichern" });
    }
  };

  const updateOpeningHour = (day: string, value: string) => {
    setEditData({
      ...editData,
      openingHours: {
        ...editData.openingHours,
        [day]: value,
      },
    });
  };

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center"><p>Bitte anmelden.</p></div>;
  }

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
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-primary" />
            <span className="font-bold text-xl">Restaurants verwalten</span>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {visibleRestaurants?.map((restaurant) => (
                <Card key={restaurant.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <UtensilsCrossed className="w-4 h-4" />
                        {restaurant.name}
                        {restaurant.cuisineType && <span className="text-sm text-muted-foreground">({restaurant.cuisineType})</span>}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {saveStatus?.id === restaurant.id && (
                          <span className={`text-sm flex items-center gap-1 ${saveStatus.status === "success" ? "text-green-600" : "text-red-600"}`}>
                            {saveStatus.status === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            {saveStatus.message}
                          </span>
                        )}
                        {editingId === restaurant.id ? (
                          <Button size="sm" onClick={() => handleSave(restaurant.id)} disabled={updateRestaurant.isPending}>
                            {updateRestaurant.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
                            Speichern
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => startEditing(restaurant)}>
                            <Edit className="w-4 h-4 mr-1" />
                            Bearbeiten
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  {editingId === restaurant.id ? (
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Küchentyp</Label>
                          <Input value={editData.cuisineType} onChange={(e) => setEditData({ ...editData, cuisineType: e.target.value })} placeholder="z.B. Bündner Küche, Italienisch" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Telefon</Label>
                          <Input value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>E-Mail</Label>
                          <Input value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Webseite</Label>
                          <Input value={editData.website} onChange={(e) => setEditData({ ...editData, website: e.target.value })} placeholder="https://..." />
                        </div>
                        <div className="space-y-2">
                          <Label>Menükarte URL</Label>
                          <Input value={editData.menuUrl} onChange={(e) => setEditData({ ...editData, menuUrl: e.target.value })} placeholder="https://... (PDF oder Webseite)" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Kurzbeschreibung</Label>
                        <Textarea value={editData.shortDescription} onChange={(e) => setEditData({ ...editData, shortDescription: e.target.value })} rows={2} />
                      </div>
                      <div className="space-y-2">
                        <Label>Beschreibung</Label>
                        <Textarea value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} rows={4} />
                      </div>
                      
                      {/* Opening Hours */}
                      <div className="space-y-3">
                        <Label className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Öffnungszeiten
                        </Label>
                        <div className="grid gap-2">
                          {DAYS.map(({ key, label }) => (
                            <div key={key} className="flex items-center gap-3">
                              <span className="w-24 text-sm font-medium">{label}</span>
                              <Input
                                className="flex-1"
                                value={editData.openingHours?.[key] || ""}
                                onChange={(e) => updateOpeningHour(key, e.target.value)}
                                placeholder="z.B. 11:00-14:00, 17:00-22:00 oder Geschlossen"
                              />
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Format: "11:00-14:00, 17:00-22:00" oder "Geschlossen" oder leer lassen.
                        </p>
                      </div>
                      
                      <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>Abbrechen</Button>
                    </CardContent>
                  ) : (
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-muted-foreground">Adresse:</span> {restaurant.address}, {restaurant.postalCode} {restaurant.city}</div>
                        <div><span className="text-muted-foreground">Telefon:</span> {restaurant.phone || "–"}</div>
                        <div><span className="text-muted-foreground">Küche:</span> {restaurant.cuisineType || "–"}</div>
                        <div><span className="text-muted-foreground">Webseite:</span> {restaurant.website ? <a href={restaurant.website} target="_blank" className="text-primary hover:underline">{restaurant.website}</a> : "–"}</div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
              
              {visibleRestaurants?.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  {isAdmin ? "Keine Restaurants vorhanden." : "Ihnen ist kein Restaurant zugewiesen."}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
