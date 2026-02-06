import { trpc } from "@/lib/trpc";
import { useProviderAuth } from "@/hooks/useProviderAuth";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Hotel, Save, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { HOTEL_AMENITIES } from "../../../shared/types";

export default function AdminHotels() {
  const { provider } = useProviderAuth();
  const isAdmin = provider?.role === "admin";

  // For admin: list all hotels. For hotelier: get their linked hotel
  const { data: allHotels } = trpc.hotel.list.useQuery({}, { enabled: isAdmin });
  const { data: myHotel } = trpc.hotel.getById.useQuery(
    { id: provider?.linkedHotelId || 0 },
    { enabled: !isAdmin && !!provider?.linkedHotelId }
  );

  const hotels = isAdmin ? allHotels : myHotel ? [myHotel] : [];
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  const { data: selectedHotel } = trpc.hotel.getById.useQuery(
    { id: selectedId || 0 },
    { enabled: !!selectedId }
  );

  const updateMutation = trpc.hotel.update.useMutation({
    onSuccess: () => {
      toast.success("Hotel gespeichert");
      setSaving(false);
    },
    onError: (err) => {
      toast.error(err.message);
      setSaving(false);
    },
  });

  useEffect(() => {
    if (selectedHotel) {
      setForm({
        name: selectedHotel.name || "",
        stars: selectedHotel.stars || "",
        address: selectedHotel.address || "",
        city: selectedHotel.city || "",
        postalCode: selectedHotel.postalCode || "",
        phone: selectedHotel.phone || "",
        email: selectedHotel.email || "",
        website: selectedHotel.website || "",
        bookingUrl: selectedHotel.bookingUrl || "",
        descriptionDe: selectedHotel.descriptionDe || "",
        shortDescDe: selectedHotel.shortDescDe || "",
        priceFrom: selectedHotel.priceFrom ?? "",
        priceTo: selectedHotel.priceTo ?? "",
        checkInFrom: selectedHotel.checkInFrom || "",
        checkInTo: selectedHotel.checkInTo || "",
        checkOutFrom: selectedHotel.checkOutFrom || "",
        checkOutTo: selectedHotel.checkOutTo || "",
        specialFeatures: selectedHotel.specialFeatures || "",
        mainImage: selectedHotel.mainImage || "",
        // Amenities
        wifiFree: selectedHotel.wifiFree || false,
        parkingFree: selectedHotel.parkingFree || false,
        parkingPaid: selectedHotel.parkingPaid || false,
        breakfastIncluded: selectedHotel.breakfastIncluded || false,
        petsAllowed: selectedHotel.petsAllowed || false,
        petSurcharge: selectedHotel.petSurcharge || "",
        familyFriendly: selectedHotel.familyFriendly || false,
        wheelchairAccessible: selectedHotel.wheelchairAccessible || false,
        elevator: selectedHotel.elevator || false,
        spa: selectedHotel.spa || false,
        pool: selectedHotel.pool || false,
        gym: selectedHotel.gym || false,
        restaurant: selectedHotel.restaurant || false,
        bar: selectedHotel.bar || false,
        roomService: selectedHotel.roomService || false,
        airConditioning: selectedHotel.airConditioning || false,
        balcony: selectedHotel.balcony || false,
      });
    }
  }, [selectedHotel]);

  // Auto-select for non-admin
  useEffect(() => {
    if (!isAdmin && provider?.linkedHotelId) {
      setSelectedId(provider.linkedHotelId);
    }
  }, [isAdmin, provider]);

  const handleSave = () => {
    if (!selectedId) return;
    setSaving(true);
    updateMutation.mutate({
      id: selectedId,
      name: form.name || undefined,
      stars: form.stars ? Number(form.stars) : undefined,
      address: form.address || undefined,
      city: form.city || undefined,
      postalCode: form.postalCode || undefined,
      phone: form.phone || undefined,
      email: form.email || undefined,
      website: form.website || undefined,
      bookingUrl: form.bookingUrl || undefined,
      descriptionDe: form.descriptionDe || undefined,
      shortDescDe: form.shortDescDe || undefined,
      priceFrom: form.priceFrom !== "" ? Number(form.priceFrom) : null,
      priceTo: form.priceTo !== "" ? Number(form.priceTo) : null,
      checkInFrom: form.checkInFrom || undefined,
      checkInTo: form.checkInTo || undefined,
      checkOutFrom: form.checkOutFrom || undefined,
      checkOutTo: form.checkOutTo || undefined,
      specialFeatures: form.specialFeatures || undefined,
      mainImage: form.mainImage || null,
      wifiFree: form.wifiFree,
      parkingFree: form.parkingFree,
      parkingPaid: form.parkingPaid,
      breakfastIncluded: form.breakfastIncluded,
      petsAllowed: form.petsAllowed,
      petSurcharge: form.petSurcharge || undefined,
      familyFriendly: form.familyFriendly,
      wheelchairAccessible: form.wheelchairAccessible,
      elevator: form.elevator,
      spa: form.spa,
      pool: form.pool,
      gym: form.gym,
      restaurant: form.restaurant,
      bar: form.bar,
      roomService: form.roomService,
      airConditioning: form.airConditioning,
      balcony: form.balcony,
    });
  };

  if (!provider) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="container flex items-center gap-3 h-14">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" /> Dashboard
            </Button>
          </Link>
          <h1 className="font-semibold flex items-center gap-2">
            <Hotel className="h-5 w-5" /> Hotels verwalten
          </h1>
        </div>
      </header>

      <div className="container py-8">
        {/* Hotel Selection (admin) */}
        {isAdmin && (
          <div className="mb-6">
            <Label className="mb-2 block">Hotel auswählen</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {(hotels || []).map((h) => (
                <Card
                  key={h.id}
                  className={`cursor-pointer transition-all ${selectedId === h.id ? "ring-2 ring-primary" : "hover:shadow-md"}`}
                  onClick={() => setSelectedId(h.id)}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <Hotel className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div>
                      <p className="font-medium text-sm">{h.name}</p>
                      <p className="text-xs text-muted-foreground">{h.address}</p>
                    </div>
                    {selectedId === h.id && <Check className="h-4 w-4 text-primary ml-auto" />}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Edit Form */}
        {selectedId && selectedHotel && (
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader><CardTitle>Grunddaten</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Sterne</Label>
                  <Input type="number" min="1" max="5" value={form.stars} onChange={(e) => setForm({ ...form, stars: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Adresse</Label>
                  <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>PLZ</Label>
                  <Input value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Stadt</Label>
                  <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Telefon</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>E-Mail</Label>
                  <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Webseite</Label>
                  <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Booking-URL</Label>
                  <Input value={form.bookingUrl} onChange={(e) => setForm({ ...form, bookingUrl: e.target.value })} placeholder="Link zur Buchungsseite" />
                </div>
              </CardContent>
            </Card>

            {/* Prices */}
            <Card>
              <CardHeader><CardTitle>Preise</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Preis ab (CHF / Nacht)</Label>
                  <Input type="number" value={form.priceFrom} onChange={(e) => setForm({ ...form, priceFrom: e.target.value })} placeholder="z.B. 120" />
                </div>
                <div className="space-y-2">
                  <Label>Preis bis (CHF / Nacht)</Label>
                  <Input type="number" value={form.priceTo} onChange={(e) => setForm({ ...form, priceTo: e.target.value })} placeholder="z.B. 350" />
                </div>
              </CardContent>
            </Card>

            {/* Check-in/out */}
            <Card>
              <CardHeader><CardTitle>Check-in / Check-out</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Check-in ab</Label>
                  <Input value={form.checkInFrom} onChange={(e) => setForm({ ...form, checkInFrom: e.target.value })} placeholder="z.B. 15:00" />
                </div>
                <div className="space-y-2">
                  <Label>Check-in bis</Label>
                  <Input value={form.checkInTo} onChange={(e) => setForm({ ...form, checkInTo: e.target.value })} placeholder="z.B. 22:00" />
                </div>
                <div className="space-y-2">
                  <Label>Check-out ab</Label>
                  <Input value={form.checkOutFrom} onChange={(e) => setForm({ ...form, checkOutFrom: e.target.value })} placeholder="z.B. 07:00" />
                </div>
                <div className="space-y-2">
                  <Label>Check-out bis</Label>
                  <Input value={form.checkOutTo} onChange={(e) => setForm({ ...form, checkOutTo: e.target.value })} placeholder="z.B. 11:00" />
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader><CardTitle>Beschreibung</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Kurzbeschreibung</Label>
                  <Textarea value={form.shortDescDe} onChange={(e) => setForm({ ...form, shortDescDe: e.target.value })} rows={2} placeholder="Kurze Beschreibung für die Übersicht" />
                </div>
                <div className="space-y-2">
                  <Label>Ausführliche Beschreibung</Label>
                  <Textarea value={form.descriptionDe} onChange={(e) => setForm({ ...form, descriptionDe: e.target.value })} rows={6} placeholder="Detaillierte Beschreibung des Hotels" />
                </div>
                <div className="space-y-2">
                  <Label>Besonderheiten</Label>
                  <Textarea value={form.specialFeatures} onChange={(e) => setForm({ ...form, specialFeatures: e.target.value })} rows={3} placeholder="z.B. Historisches Gebäude, Panoramablick..." />
                </div>
              </CardContent>
            </Card>

            {/* Image */}
            <Card>
              <CardHeader><CardTitle>Bild</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Hauptbild-URL</Label>
                  <Input value={form.mainImage} onChange={(e) => setForm({ ...form, mainImage: e.target.value })} placeholder="https://..." />
                </div>
                {form.mainImage && (
                  <img src={form.mainImage} alt="Vorschau" className="rounded-lg h-40 object-cover" />
                )}
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader><CardTitle>Ausstattung</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {HOTEL_AMENITIES.map((amenity) => (
                    <div key={amenity.key} className="flex items-center justify-between">
                      <Label className="cursor-pointer">{amenity.label}</Label>
                      <Switch
                        checked={form[amenity.key] || false}
                        onCheckedChange={(checked) => setForm({ ...form, [amenity.key]: checked })}
                      />
                    </div>
                  ))}
                </div>
                {form.petsAllowed && (
                  <div className="mt-4 space-y-2">
                    <Label>Haustier-Zuschlag</Label>
                    <Input value={form.petSurcharge} onChange={(e) => setForm({ ...form, petSurcharge: e.target.value })} placeholder="z.B. CHF 25 pro Nacht" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end pb-8">
              <Button onClick={handleSave} disabled={saving} size="lg" className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Speichern
              </Button>
            </div>
          </div>
        )}

        {!selectedId && !isAdmin && !provider?.linkedHotelId && (
          <Card>
            <CardContent className="p-8 text-center">
              <Hotel className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Ihrem Konto ist noch kein Hotel zugewiesen. Bitte kontaktieren Sie den Administrator.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
