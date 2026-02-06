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
import { ArrowLeft, UtensilsCrossed, Save, Loader2, Check, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { CUISINE_TYPES, WEEKDAYS_DE, type OpeningHours, type OpeningHoursEntry } from "../../../shared/types";

const WEEKDAY_KEYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

export default function AdminRestaurants() {
  const { provider } = useProviderAuth();
  const isAdmin = provider?.role === "admin";

  const { data: allRestaurants } = trpc.restaurant.list.useQuery({}, { enabled: isAdmin });
  const { data: myRestaurant } = trpc.restaurant.getById.useQuery(
    { id: provider?.linkedRestaurantId || 0 },
    { enabled: !isAdmin && !!provider?.linkedRestaurantId }
  );

  const restaurants = isAdmin ? allRestaurants : myRestaurant ? [myRestaurant] : [];
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [openingHours, setOpeningHours] = useState<OpeningHours>({});
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [closedDays, setClosedDays] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const { data: selectedRestaurant } = trpc.restaurant.getById.useQuery(
    { id: selectedId || 0 },
    { enabled: !!selectedId }
  );

  const updateMutation = trpc.restaurant.update.useMutation({
    onSuccess: () => {
      toast.success("Restaurant gespeichert");
      setSaving(false);
    },
    onError: (err) => {
      toast.error(err.message);
      setSaving(false);
    },
  });

  useEffect(() => {
    if (selectedRestaurant) {
      setForm({
        name: selectedRestaurant.name || "",
        address: selectedRestaurant.address || "",
        city: selectedRestaurant.city || "",
        postalCode: selectedRestaurant.postalCode || "",
        phone: selectedRestaurant.phone || "",
        email: selectedRestaurant.email || "",
        website: selectedRestaurant.website || "",
        menuUrl: selectedRestaurant.menuUrl || "",
        priceLevel: selectedRestaurant.priceLevel || "",
        ambiance: selectedRestaurant.ambiance || "",
        descriptionDe: selectedRestaurant.descriptionDe || "",
        shortDescDe: selectedRestaurant.shortDescDe || "",
        openingHoursText: selectedRestaurant.openingHoursText || "",
        reservationUrl: selectedRestaurant.reservationUrl || "",
        mainImage: selectedRestaurant.mainImage || "",
        outdoorSeating: selectedRestaurant.outdoorSeating || false,
        terrace: selectedRestaurant.terrace || false,
        garden: selectedRestaurant.garden || false,
        wheelchairAccessible: selectedRestaurant.wheelchairAccessible || false,
        vegetarianOptions: selectedRestaurant.vegetarianOptions || false,
        veganOptions: selectedRestaurant.veganOptions || false,
        glutenFreeOptions: selectedRestaurant.glutenFreeOptions || false,
        reservationRequired: selectedRestaurant.reservationRequired || false,
      });
      setOpeningHours((selectedRestaurant.openingHours as OpeningHours) || {});
      setSelectedCuisines((selectedRestaurant.cuisineTypes as string[]) || []);
      setClosedDays((selectedRestaurant.closedDays as string[]) || []);
    }
  }, [selectedRestaurant]);

  useEffect(() => {
    if (!isAdmin && provider?.linkedRestaurantId) {
      setSelectedId(provider.linkedRestaurantId);
    }
  }, [isAdmin, provider]);

  const updateHours = (day: string, field: "open" | "close", value: string) => {
    setOpeningHours((prev) => ({
      ...prev,
      [day]: { ...(prev[day as keyof OpeningHours] || { open: "", close: "" }), [field]: value },
    }));
  };

  const toggleClosedDay = (day: string) => {
    if (closedDays.includes(day)) {
      setClosedDays(closedDays.filter((d) => d !== day));
    } else {
      setClosedDays([...closedDays, day]);
      // Remove opening hours for that day
      const newHours = { ...openingHours };
      delete newHours[day as keyof OpeningHours];
      setOpeningHours(newHours);
    }
  };

  const toggleCuisine = (ct: string) => {
    if (selectedCuisines.includes(ct)) {
      setSelectedCuisines(selectedCuisines.filter((c) => c !== ct));
    } else {
      setSelectedCuisines([...selectedCuisines, ct]);
    }
  };

  const handleSave = () => {
    if (!selectedId) return;
    setSaving(true);

    // Clean opening hours: remove entries with empty values
    const cleanedHours: OpeningHours = {};
    for (const [day, hours] of Object.entries(openingHours)) {
      if (hours && hours.open && hours.close) {
        cleanedHours[day as keyof OpeningHours] = hours;
      }
    }

    updateMutation.mutate({
      id: selectedId,
      name: form.name || undefined,
      address: form.address || undefined,
      city: form.city || undefined,
      postalCode: form.postalCode || undefined,
      phone: form.phone || undefined,
      email: form.email || undefined,
      website: form.website || undefined,
      menuUrl: form.menuUrl || null,
      cuisineTypes: selectedCuisines.length > 0 ? selectedCuisines : null,
      priceLevel: form.priceLevel || undefined,
      ambiance: form.ambiance || undefined,
      descriptionDe: form.descriptionDe || undefined,
      shortDescDe: form.shortDescDe || undefined,
      openingHours: Object.keys(cleanedHours).length > 0 ? cleanedHours : undefined,
      openingHoursText: form.openingHoursText || null,
      closedDays: closedDays.length > 0 ? closedDays : null,
      reservationUrl: form.reservationUrl || undefined,
      mainImage: form.mainImage || null,
      outdoorSeating: form.outdoorSeating,
      terrace: form.terrace,
      garden: form.garden,
      wheelchairAccessible: form.wheelchairAccessible,
      vegetarianOptions: form.vegetarianOptions,
      veganOptions: form.veganOptions,
      glutenFreeOptions: form.glutenFreeOptions,
      reservationRequired: form.reservationRequired,
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
            <UtensilsCrossed className="h-5 w-5" /> Restaurants verwalten
          </h1>
        </div>
      </header>

      <div className="container py-8">
        {/* Restaurant Selection (admin) */}
        {isAdmin && (
          <div className="mb-6">
            <Label className="mb-2 block">Restaurant auswählen</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {(restaurants || []).map((r) => (
                <Card
                  key={r.id}
                  className={`cursor-pointer transition-all ${selectedId === r.id ? "ring-2 ring-primary" : "hover:shadow-md"}`}
                  onClick={() => setSelectedId(r.id)}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <UtensilsCrossed className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div>
                      <p className="font-medium text-sm">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.address}</p>
                    </div>
                    {selectedId === r.id && <Check className="h-4 w-4 text-primary ml-auto" />}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Edit Form */}
        {selectedId && selectedRestaurant && (
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
                <div className="space-y-2">
                  <Label>Menükarte-URL</Label>
                  <Input value={form.menuUrl} onChange={(e) => setForm({ ...form, menuUrl: e.target.value })} placeholder="Link zur Menükarte (PDF oder Webseite)" />
                </div>
                <div className="space-y-2">
                  <Label>Reservierungs-URL</Label>
                  <Input value={form.reservationUrl} onChange={(e) => setForm({ ...form, reservationUrl: e.target.value })} placeholder="Link zur Online-Reservierung" />
                </div>
                <div className="space-y-2">
                  <Label>Preisklasse</Label>
                  <Input value={form.priceLevel} onChange={(e) => setForm({ ...form, priceLevel: e.target.value })} placeholder="z.B. $$ oder Mittel" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Ambiente</Label>
                  <Input value={form.ambiance} onChange={(e) => setForm({ ...form, ambiance: e.target.value })} placeholder="z.B. Gemütlich, Elegant, Rustikal" />
                </div>
              </CardContent>
            </Card>

            {/* Cuisine Types */}
            <Card>
              <CardHeader><CardTitle>Küchen-Typen</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {CUISINE_TYPES.map((ct) => (
                    <Button
                      key={ct}
                      variant={selectedCuisines.includes(ct) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCuisine(ct)}
                    >
                      {ct}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Opening Hours */}
            <Card>
              <CardHeader><CardTitle>Öffnungszeiten</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {WEEKDAY_KEYS.map((day) => {
                  const isClosed = closedDays.includes(day);
                  const hours = openingHours[day as keyof OpeningHours];
                  return (
                    <div key={day} className="flex items-center gap-4">
                      <span className="w-28 text-sm font-medium">{WEEKDAYS_DE[day]}</span>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={!isClosed}
                          onCheckedChange={() => toggleClosedDay(day)}
                        />
                        <span className="text-xs text-muted-foreground w-16">
                          {isClosed ? "Ruhetag" : "Geöffnet"}
                        </span>
                      </div>
                      {!isClosed && (
                        <>
                          <Input
                            className="w-24"
                            placeholder="09:00"
                            value={hours?.open || ""}
                            onChange={(e) => updateHours(day, "open", e.target.value)}
                          />
                          <span className="text-muted-foreground">–</span>
                          <Input
                            className="w-24"
                            placeholder="22:00"
                            value={hours?.close || ""}
                            onChange={(e) => updateHours(day, "close", e.target.value)}
                          />
                        </>
                      )}
                    </div>
                  );
                })}
                <div className="space-y-2 mt-4">
                  <Label>Zusätzliche Hinweise zu Öffnungszeiten</Label>
                  <Textarea
                    value={form.openingHoursText}
                    onChange={(e) => setForm({ ...form, openingHoursText: e.target.value })}
                    rows={2}
                    placeholder="z.B. Küche bis 21:30, Warme Küche 11:30-14:00 und 17:30-21:30"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader><CardTitle>Beschreibung</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Kurzbeschreibung</Label>
                  <Textarea value={form.shortDescDe} onChange={(e) => setForm({ ...form, shortDescDe: e.target.value })} rows={2} />
                </div>
                <div className="space-y-2">
                  <Label>Ausführliche Beschreibung</Label>
                  <Textarea value={form.descriptionDe} onChange={(e) => setForm({ ...form, descriptionDe: e.target.value })} rows={6} />
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

            {/* Features */}
            <Card>
              <CardHeader><CardTitle>Merkmale</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: "vegetarianOptions", label: "Vegetarische Optionen" },
                    { key: "veganOptions", label: "Vegane Optionen" },
                    { key: "glutenFreeOptions", label: "Glutenfreie Optionen" },
                    { key: "outdoorSeating", label: "Aussensitzplätze" },
                    { key: "terrace", label: "Terrasse" },
                    { key: "garden", label: "Garten" },
                    { key: "wheelchairAccessible", label: "Rollstuhlgerecht" },
                    { key: "reservationRequired", label: "Reservation empfohlen" },
                  ].map((feat) => (
                    <div key={feat.key} className="flex items-center justify-between">
                      <Label className="cursor-pointer">{feat.label}</Label>
                      <Switch
                        checked={form[feat.key] || false}
                        onCheckedChange={(checked) => setForm({ ...form, [feat.key]: checked })}
                      />
                    </div>
                  ))}
                </div>
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

        {!selectedId && !isAdmin && !provider?.linkedRestaurantId && (
          <Card>
            <CardContent className="p-8 text-center">
              <UtensilsCrossed className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Ihrem Konto ist noch kein Restaurant zugewiesen. Bitte kontaktieren Sie den Administrator.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
