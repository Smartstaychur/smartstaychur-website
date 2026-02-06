import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  MapPin, ArrowLeft, Loader2, Save, Hotel, Edit, CheckCircle2, AlertCircle
} from "lucide-react";

export default function AdminHotels() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === "admin";
  
  const { data: hotels, isLoading } = trpc.hotels.list.useQuery();
  const updateHotel = trpc.hotels.update.useMutation();
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Record<string, string>>({});
  const [saveStatus, setSaveStatus] = useState<{ id: number; status: "success" | "error"; message: string } | null>(null);

  // Filter hotels based on user role
  const visibleHotels = isAdmin 
    ? hotels 
    : hotels?.filter(h => h.id === user?.hotelId);

  const startEditing = (hotel: any) => {
    setEditingId(hotel.id);
    setEditData({
      name: hotel.name || "",
      shortDescription: hotel.shortDescription || "",
      description: hotel.description || "",
      phone: hotel.phone || "",
      email: hotel.email || "",
      website: hotel.website || "",
      bookingUrl: hotel.bookingUrl || "",
      priceFrom: hotel.priceFrom || "",
      priceTo: hotel.priceTo || "",
    });
  };

  const handleSave = async (id: number) => {
    try {
      await updateHotel.mutateAsync({ id, data: editData });
      setSaveStatus({ id, status: "success", message: "Gespeichert!" });
      setEditingId(null);
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: any) {
      setSaveStatus({ id, status: "error", message: err.message || "Fehler beim Speichern" });
    }
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
            <Hotel className="w-5 h-5 text-primary" />
            <span className="font-bold text-xl">Hotels verwalten</span>
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
              {visibleHotels?.map((hotel) => (
                <Card key={hotel.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Hotel className="w-4 h-4" />
                        {hotel.name}
                        {hotel.stars && <span className="text-sm text-muted-foreground">({hotel.stars} Sterne)</span>}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {saveStatus?.id === hotel.id && (
                          <span className={`text-sm flex items-center gap-1 ${saveStatus.status === "success" ? "text-green-600" : "text-red-600"}`}>
                            {saveStatus.status === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            {saveStatus.message}
                          </span>
                        )}
                        {editingId === hotel.id ? (
                          <Button size="sm" onClick={() => handleSave(hotel.id)} disabled={updateHotel.isPending}>
                            {updateHotel.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
                            Speichern
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => startEditing(hotel)}>
                            <Edit className="w-4 h-4 mr-1" />
                            Bearbeiten
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  {editingId === hotel.id ? (
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Telefon</Label>
                          <Input value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>E-Mail</Label>
                          <Input value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Webseite</Label>
                          <Input value={editData.website} onChange={(e) => setEditData({ ...editData, website: e.target.value })} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Preis ab (CHF)</Label>
                          <Input value={editData.priceFrom} onChange={(e) => setEditData({ ...editData, priceFrom: e.target.value })} placeholder="z.B. 120" />
                        </div>
                        <div className="space-y-2">
                          <Label>Preis bis (CHF)</Label>
                          <Input value={editData.priceTo} onChange={(e) => setEditData({ ...editData, priceTo: e.target.value })} placeholder="z.B. 280" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Buchungs-URL</Label>
                        <Input value={editData.bookingUrl} onChange={(e) => setEditData({ ...editData, bookingUrl: e.target.value })} placeholder="https://..." />
                      </div>
                      <div className="space-y-2">
                        <Label>Kurzbeschreibung</Label>
                        <Textarea value={editData.shortDescription} onChange={(e) => setEditData({ ...editData, shortDescription: e.target.value })} rows={2} />
                      </div>
                      <div className="space-y-2">
                        <Label>Beschreibung</Label>
                        <Textarea value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} rows={5} />
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>Abbrechen</Button>
                    </CardContent>
                  ) : (
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-muted-foreground">Adresse:</span> {hotel.address}, {hotel.postalCode} {hotel.city}</div>
                        <div><span className="text-muted-foreground">Telefon:</span> {hotel.phone || "–"}</div>
                        <div><span className="text-muted-foreground">Preis:</span> {hotel.priceFrom ? `CHF ${hotel.priceFrom} – ${hotel.priceTo}` : "–"}</div>
                        <div><span className="text-muted-foreground">Webseite:</span> {hotel.website ? <a href={hotel.website} target="_blank" className="text-primary hover:underline">{hotel.website}</a> : "–"}</div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
              
              {visibleHotels?.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  {isAdmin ? "Keine Hotels vorhanden." : "Ihnen ist kein Hotel zugewiesen."}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
