import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  MapPin,
  ArrowLeft,
  Plus,
  Trash2,
  Calendar,
  Loader2,
  UtensilsCrossed,
  Leaf
} from "lucide-react";

export default function AdminDailySpecials() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    date: new Date().toISOString().split('T')[0],
    isVegetarian: false,
    isVegan: false
  });

  const { data: restaurants, isLoading: restaurantsLoading } = trpc.restaurants.list.useQuery();
  const { data: dailySpecials, isLoading: specialsLoading, refetch } = trpc.dailySpecials.getByRestaurantId.useQuery(
    { restaurantId: parseInt(selectedRestaurant) || 0 },
    { enabled: !!selectedRestaurant }
  );

  const createSpecial = trpc.dailySpecials.create.useMutation({
    onSuccess: () => {
      toast.success("Tagesmenü erfolgreich erstellt!");
      setFormData({
        name: "",
        description: "",
        price: "",
        date: new Date().toISOString().split('T')[0],
        isVegetarian: false,
        isVegan: false
      });
      refetch();
    },
    onError: (error) => {
      toast.error("Fehler: " + error.message);
    }
  });

  const deleteSpecial = trpc.dailySpecials.delete.useMutation({
    onSuccess: () => {
      toast.success("Tagesmenü gelöscht!");
      refetch();
    },
    onError: (error) => {
      toast.error("Fehler: " + error.message);
    }
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="mb-4">Bitte melden Sie sich an.</p>
        <a href={getLoginUrl()}>
          <Button>Anmelden</Button>
        </a>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRestaurant || !formData.name || !formData.price || !formData.date) {
      toast.error("Bitte füllen Sie alle Pflichtfelder aus.");
      return;
    }

    createSpecial.mutate({
      restaurantId: parseInt(selectedRestaurant),
      name: formData.name,
      description: formData.description || undefined,
      price: formData.price,
      date: formData.date,
      isVegetarian: formData.isVegetarian,
      isVegan: formData.isVegan
    });
  };

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
          
          <nav className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zurück zum Admin
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <h1 className="text-3xl font-bold mb-2">Tagesmenüs verwalten</h1>
          <p className="text-muted-foreground mb-8">
            Erstellen und verwalten Sie Tagesmenüs und Daily Specials für Restaurants.
          </p>

          {/* Restaurant Selection */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Restaurant auswählen</CardTitle>
              <CardDescription>
                Wählen Sie das Restaurant, für das Sie Tagesmenüs verwalten möchten.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedRestaurant} onValueChange={setSelectedRestaurant}>
                <SelectTrigger>
                  <SelectValue placeholder="Restaurant auswählen..." />
                </SelectTrigger>
                <SelectContent>
                  {restaurantsLoading ? (
                    <SelectItem value="loading" disabled>Laden...</SelectItem>
                  ) : (
                    restaurants?.map((restaurant) => (
                      <SelectItem key={restaurant.id} value={restaurant.id.toString()}>
                        {restaurant.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedRestaurant && (
            <>
              {/* Add New Special Form */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Neues Tagesmenü erstellen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name des Gerichts *</Label>
                        <Input
                          id="name"
                          placeholder="z.B. Spaghetti Bolognese"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Preis (CHF) *</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.50"
                          placeholder="z.B. 18.50"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Beschreibung</Label>
                      <Textarea
                        id="description"
                        placeholder="z.B. Mit frischem Parmesan und Basilikum"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date">Datum *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>

                    <div className="flex gap-6">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="vegetarian"
                          checked={formData.isVegetarian}
                          onCheckedChange={(checked) => setFormData({ ...formData, isVegetarian: !!checked })}
                        />
                        <Label htmlFor="vegetarian" className="flex items-center gap-1">
                          <Leaf className="w-4 h-4 text-green-600" />
                          Vegetarisch
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="vegan"
                          checked={formData.isVegan}
                          onCheckedChange={(checked) => setFormData({ ...formData, isVegan: !!checked })}
                        />
                        <Label htmlFor="vegan" className="flex items-center gap-1">
                          <Leaf className="w-4 h-4 text-green-700" />
                          Vegan
                        </Label>
                      </div>
                    </div>

                    <Button type="submit" disabled={createSpecial.isPending}>
                      {createSpecial.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4 mr-2" />
                      )}
                      Tagesmenü erstellen
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Existing Specials */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Aktuelle Tagesmenüs
                  </CardTitle>
                  <CardDescription>
                    Alle Tagesmenüs für das ausgewählte Restaurant
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {specialsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : dailySpecials && dailySpecials.length > 0 ? (
                    <div className="space-y-4">
                      {dailySpecials.map((special) => (
                        <div key={special.id} className="flex items-start justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <UtensilsCrossed className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{special.name}</span>
                              {special.isVegetarian && (
                                <Badge variant="outline" className="text-xs">Vegetarisch</Badge>
                              )}
                              {special.isVegan && (
                                <Badge variant="outline" className="text-xs">Vegan</Badge>
                              )}
                            </div>
                            {special.description && (
                              <p className="text-sm text-muted-foreground mb-1">{special.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(special.date).toLocaleDateString('de-CH')}
                              </span>
                              <span className="font-semibold text-primary">CHF {special.price}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => deleteSpecial.mutate({ id: special.id })}
                            disabled={deleteSpecial.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Keine Tagesmenüs vorhanden.</p>
                      <p className="text-sm">Erstellen Sie das erste Tagesmenü oben.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-white">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SmartStayChur. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  );
}
