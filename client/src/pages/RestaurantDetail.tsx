import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin,
  Phone,
  Mail,
  Globe,
  ExternalLink,
  Clock,
  Leaf,
  ArrowLeft,
  Calendar,
  Utensils
} from "lucide-react";

export default function RestaurantDetail() {
  const params = useParams<{ slug: string }>();
  const { data: restaurant, isLoading } = trpc.restaurants.getBySlug.useQuery({ slug: params.slug || "" });
  const { data: menuItems } = trpc.menuItems.getByRestaurantId.useQuery(
    { restaurantId: restaurant?.id || 0 },
    { enabled: !!restaurant?.id }
  );
  const { data: menuCategories } = trpc.menuCategories.getByRestaurantId.useQuery(
    { restaurantId: restaurant?.id || 0 },
    { enabled: !!restaurant?.id }
  );
  const { data: dailySpecials } = trpc.dailySpecials.getByRestaurantId.useQuery(
    { restaurantId: restaurant?.id || 0 },
    { enabled: !!restaurant?.id }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Restaurant nicht gefunden</h1>
        <Link href="/restaurants">
          <Button>Zurück zur Übersicht</Button>
        </Link>
      </div>
    );
  }

  // Parse opening hours if stored as JSON
  let openingHours: Record<string, string> = {};
  if (restaurant.openingHours) {
    try {
      openingHours = typeof restaurant.openingHours === 'string' 
        ? JSON.parse(restaurant.openingHours) 
        : restaurant.openingHours;
    } catch (e) {
      // Ignore parse errors
    }
  }

  const dayNames: Record<string, string> = {
    monday: "Montag",
    tuesday: "Dienstag",
    wednesday: "Mittwoch",
    thursday: "Donnerstag",
    friday: "Freitag",
    saturday: "Samstag",
    sunday: "Sonntag"
  };

  // Group menu items by category
  const menuByCategory = menuItems?.reduce((acc, item) => {
    const categoryId = item.categoryId || 0;
    if (!acc[categoryId]) acc[categoryId] = [];
    acc[categoryId].push(item);
    return acc;
  }, {} as Record<number, typeof menuItems>);

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
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/hotels" className="text-sm font-medium hover:text-primary transition-colors">
              Hotels
            </Link>
            <Link href="/restaurants" className="text-sm font-medium text-primary">
              Restaurants
            </Link>
            <Link href="/erlebnisse" className="text-sm font-medium hover:text-primary transition-colors">
              Erlebnisse
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Breadcrumb & Title */}
        <section className="bg-gradient-to-br from-secondary/10 to-transparent py-8">
          <div className="container">
            <Link href="/restaurants" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Zurück zur Übersicht
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold">{restaurant.name}</h1>
                  {restaurant.cuisineType && (
                    <Badge variant="secondary">{restaurant.cuisineType}</Badge>
                  )}
                </div>
                <p className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1" />
                  {restaurant.address}, {restaurant.postalCode} {restaurant.city}
                </p>
              </div>
              
              {restaurant.reservationUrl && (
                <a href={restaurant.reservationUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="gap-2">
                    Tisch reservieren <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
              )}
            </div>
          </div>
        </section>

        <div className="container py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Über das Restaurant</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {restaurant.description || restaurant.shortDescription}
                  </p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {restaurant.vegetarianOptions && (
                      <Badge variant="outline">
                        <Leaf className="w-3 h-3 mr-1" /> Vegetarische Optionen
                      </Badge>
                    )}
                    {restaurant.veganOptions && (
                      <Badge variant="outline">
                        <Leaf className="w-3 h-3 mr-1" /> Vegane Optionen
                      </Badge>
                    )}
                    {restaurant.glutenFreeOptions && (
                      <Badge variant="outline">Glutenfrei</Badge>
                    )}
                    {restaurant.outdoorSeating && (
                      <Badge variant="outline">Terrasse</Badge>
                    )}
                    {restaurant.wheelchairAccessible && (
                      <Badge variant="outline">Barrierefrei</Badge>
                    )}
                    {restaurant.takeaway && (
                      <Badge variant="outline">Take-Away</Badge>
                    )}
                    {restaurant.delivery && (
                      <Badge variant="outline">Lieferservice</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Menu & Daily Specials Tabs */}
              <Card>
                <Tabs defaultValue="menu">
                  <CardHeader>
                    <TabsList>
                      <TabsTrigger value="menu">Speisekarte</TabsTrigger>
                      <TabsTrigger value="specials">Tagesmenüs</TabsTrigger>
                    </TabsList>
                  </CardHeader>
                  <CardContent>
                    <TabsContent value="menu" className="mt-0">
                      {menuItems && menuItems.length > 0 ? (
                        <div className="space-y-6">
                          {menuCategories?.map((category) => (
                            <div key={category.id}>
                              <h3 className="font-semibold text-lg mb-3 border-b pb-2">
                                {category.name}
                              </h3>
                              <div className="space-y-3">
                                {menuByCategory?.[category.id]?.map((item) => (
                                  <div key={item.id} className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium">{item.name}</span>
                                        {item.isVegetarian && (
                                          <Badge variant="outline" className="text-xs py-0">
                                            <Leaf className="w-2 h-2 mr-1" /> V
                                          </Badge>
                                        )}
                                        {item.isVegan && (
                                          <Badge variant="outline" className="text-xs py-0">
                                            <Leaf className="w-2 h-2 mr-1" /> Vegan
                                          </Badge>
                                        )}
                                      </div>
                                      {item.description && (
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                      )}
                                    </div>
                                    <span className="font-semibold text-primary ml-4">
                                      CHF {item.price}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                          
                          {/* Items without category */}
                          {menuByCategory?.[0] && menuByCategory[0].length > 0 && (
                            <div>
                              <h3 className="font-semibold text-lg mb-3 border-b pb-2">
                                Weitere Gerichte
                              </h3>
                              <div className="space-y-3">
                                {menuByCategory[0].map((item) => (
                                  <div key={item.id} className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium">{item.name}</span>
                                        {item.isVegetarian && (
                                          <Badge variant="outline" className="text-xs py-0">V</Badge>
                                        )}
                                      </div>
                                      {item.description && (
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                      )}
                                    </div>
                                    <span className="font-semibold text-primary ml-4">
                                      CHF {item.price}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Utensils className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          {restaurant.menuUrl ? (
                            <>
                              <p className="mb-4">Speisekarte als PDF verfügbar:</p>
                              <a href={restaurant.menuUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="gap-2">
                                  <ExternalLink className="w-4 h-4" />
                                  Speisekarte ansehen
                                </Button>
                              </a>
                            </>
                          ) : (
                            <>
                              <p>Speisekarte wird noch ergänzt.</p>
                              <p className="text-sm">Bitte kontaktieren Sie das Restaurant direkt.</p>
                            </>
                          )}
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="specials" className="mt-0">
                      {dailySpecials && dailySpecials.length > 0 ? (
                        <div className="space-y-4">
                          {dailySpecials.map((special) => (
                            <div key={special.id} className="p-4 border rounded-lg bg-accent/10">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(special.date).toLocaleDateString('de-CH', {
                                  weekday: 'long',
                                  day: 'numeric',
                                  month: 'long'
                                })}
                              </div>
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold">{special.name}</h4>
                                  {special.description && (
                                    <p className="text-sm text-muted-foreground">{special.description}</p>
                                  )}
                                  <div className="flex gap-2 mt-2">
                                    {special.isVegetarian && (
                                      <Badge variant="outline" className="text-xs">Vegetarisch</Badge>
                                    )}
                                    {special.isVegan && (
                                      <Badge variant="outline" className="text-xs">Vegan</Badge>
                                    )}
                                  </div>
                                </div>
                                <span className="text-xl font-bold text-primary">
                                  CHF {special.price}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>Keine aktuellen Tagesmenüs verfügbar.</p>
                        </div>
                      )}
                    </TabsContent>
                  </CardContent>
                </Tabs>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Opening Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Öffnungszeiten
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.keys(openingHours).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(dayNames).map(([key, name]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span>{name}</span>
                          <span className="text-muted-foreground">
                            {openingHours[key] || "Geschlossen"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Öffnungszeiten auf Anfrage
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Kontakt</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{restaurant.address}, {restaurant.postalCode} {restaurant.city}</span>
                  </div>
                  {restaurant.phone && (
                    <a href={`tel:${restaurant.phone}`} className="flex items-center gap-2 text-sm hover:text-primary">
                      <Phone className="w-4 h-4" />
                      {restaurant.phone}
                    </a>
                  )}
                  {restaurant.email && (
                    <a href={`mailto:${restaurant.email}`} className="flex items-center gap-2 text-sm hover:text-primary">
                      <Mail className="w-4 h-4" />
                      {restaurant.email}
                    </a>
                  )}
                  {restaurant.website && (
                    <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-primary">
                      <Globe className="w-4 h-4" />
                      Website besuchen
                    </a>
                  )}
                </CardContent>
              </Card>

              {/* Reservation */}
              {(restaurant.reservationUrl || restaurant.phone) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Reservierung</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {restaurant.reservationUrl && (
                      <a href={restaurant.reservationUrl} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full gap-2">
                          Online reservieren <ExternalLink className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                    {restaurant.phone && (
                      <a href={`tel:${restaurant.phone}`}>
                        <Button variant="outline" className="w-full gap-2">
                          <Phone className="w-4 h-4" /> Anrufen
                        </Button>
                      </a>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
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
