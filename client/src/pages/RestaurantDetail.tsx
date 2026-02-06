import { trpc } from "@/lib/trpc";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin, Phone, Mail, Globe, ExternalLink, ArrowLeft, UtensilsCrossed,
  Clock, Leaf, TreePine, Armchair, Accessibility, CalendarOff, FileText
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { WEEKDAYS_DE, type OpeningHours } from "../../../shared/types";

export default function RestaurantDetail() {
  const params = useParams<{ slug: string }>();
  const { data: restaurant, isLoading, error } = trpc.restaurant.getBySlug.useQuery(
    { slug: params.slug || "" },
    { enabled: !!params.slug }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="container py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-64 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="container py-12 text-center">
          <UtensilsCrossed className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Restaurant nicht gefunden</h1>
          <Link href="/restaurants"><Button variant="outline">Zurück zur Übersicht</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const openingHours = restaurant.openingHours as OpeningHours | null;
  const closedDays = restaurant.closedDays as string[] | null;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <div className="container py-8">
        <Link href="/restaurants">
          <Button variant="ghost" size="sm" className="gap-1 mb-4">
            <ArrowLeft className="h-4 w-4" /> Alle Restaurants
          </Button>
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              {restaurant.name}
            </h1>
            {restaurant.cuisineTypes && restaurant.cuisineTypes.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {restaurant.cuisineTypes.map((ct) => (
                  <Badge key={ct} variant="secondary">{ct}</Badge>
                ))}
              </div>
            )}
            {restaurant.address && (
              <p className="text-muted-foreground flex items-center gap-1 mt-2">
                <MapPin className="h-4 w-4" /> {restaurant.address}, {restaurant.postalCode} {restaurant.city}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {restaurant.menuUrl && (
              <a href={restaurant.menuUrl} target="_blank" rel="noopener noreferrer">
                <Button className="gap-1">
                  <FileText className="h-4 w-4" /> Menükarte
                </Button>
              </a>
            )}
            {restaurant.reservationUrl && (
              <a href={restaurant.reservationUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-1">
                  Reservieren <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Main Image */}
        {restaurant.mainImage && (
          <div className="rounded-xl overflow-hidden mb-8">
            <img src={restaurant.mainImage} alt={restaurant.name} className="w-full h-64 md:h-96 object-cover" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {restaurant.descriptionDe && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-3">Über das Restaurant</h2>
                  <p className="text-muted-foreground whitespace-pre-line">{restaurant.descriptionDe}</p>
                </CardContent>
              </Card>
            )}

            {/* Opening Hours */}
            {openingHours && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" /> Öffnungszeiten
                  </h2>
                  <div className="space-y-2">
                    {Object.entries(WEEKDAYS_DE).map(([key, label]) => {
                      const hours = openingHours[key as keyof OpeningHours];
                      const isToday = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase() === key;
                      return (
                        <div
                          key={key}
                          className={`flex justify-between items-center py-2 px-3 rounded ${
                            isToday ? "bg-primary/5 font-medium" : ""
                          }`}
                        >
                          <span className="text-sm">{label}</span>
                          {hours ? (
                            <span className="text-sm text-green-600">{hours.open} – {hours.close}</span>
                          ) : (
                            <span className="text-sm text-red-500">Geschlossen</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {restaurant.openingHoursText && (
                    <p className="text-sm text-muted-foreground mt-3">{restaurant.openingHoursText}</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Closed Days / Ruhetage */}
            {closedDays && closedDays.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <CalendarOff className="h-5 w-5 text-red-500" /> Ruhetage
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {closedDays.map((day) => (
                      <Badge key={day} variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100">
                        {WEEKDAYS_DE[day] || day}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Merkmale</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {restaurant.vegetarianOptions && (
                    <div className="flex items-center gap-2 text-sm">
                      <Leaf className="h-4 w-4 text-green-500" /> Vegetarische Optionen
                    </div>
                  )}
                  {restaurant.veganOptions && (
                    <div className="flex items-center gap-2 text-sm">
                      <Leaf className="h-4 w-4 text-green-600" /> Vegane Optionen
                    </div>
                  )}
                  {restaurant.glutenFreeOptions && (
                    <div className="flex items-center gap-2 text-sm">
                      <Leaf className="h-4 w-4 text-amber-500" /> Glutenfreie Optionen
                    </div>
                  )}
                  {restaurant.outdoorSeating && (
                    <div className="flex items-center gap-2 text-sm">
                      <Armchair className="h-4 w-4 text-primary" /> Aussensitzplätze
                    </div>
                  )}
                  {restaurant.terrace && (
                    <div className="flex items-center gap-2 text-sm">
                      <TreePine className="h-4 w-4 text-primary" /> Terrasse
                    </div>
                  )}
                  {restaurant.garden && (
                    <div className="flex items-center gap-2 text-sm">
                      <TreePine className="h-4 w-4 text-green-500" /> Garten
                    </div>
                  )}
                  {restaurant.wheelchairAccessible && (
                    <div className="flex items-center gap-2 text-sm">
                      <Accessibility className="h-4 w-4 text-primary" /> Rollstuhlgerecht
                    </div>
                  )}
                  {restaurant.reservationRequired && (
                    <div className="flex items-center gap-2 text-sm text-amber-600">
                      Reservation empfohlen
                    </div>
                  )}
                </div>
                {restaurant.ambiance && (
                  <p className="text-sm text-muted-foreground mt-3">Ambiente: {restaurant.ambiance}</p>
                )}
                {restaurant.priceLevel && (
                  <p className="text-sm text-muted-foreground mt-1">Preisklasse: {restaurant.priceLevel}</p>
                )}
              </CardContent>
            </Card>

            {/* Gallery */}
            {restaurant.galleryImages && restaurant.galleryImages.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Bildergalerie</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {restaurant.galleryImages.map((img, i) => (
                      <img key={i} src={img} alt={`${restaurant.name} ${i + 1}`} className="rounded-lg h-40 w-full object-cover" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Kontakt</h2>
                <div className="space-y-3">
                  {restaurant.phone && (
                    <a href={`tel:${restaurant.phone}`} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                      <Phone className="h-4 w-4 text-muted-foreground" /> {restaurant.phone}
                    </a>
                  )}
                  {restaurant.email && (
                    <a href={`mailto:${restaurant.email}`} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                      <Mail className="h-4 w-4 text-muted-foreground" /> {restaurant.email}
                    </a>
                  )}
                  {restaurant.website && (
                    <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                      <Globe className="h-4 w-4 text-muted-foreground" /> Webseite besuchen
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {restaurant.menuUrl && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-3">Menükarte</h2>
                  <a href={restaurant.menuUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full gap-1">
                      <FileText className="h-4 w-4" /> Menü ansehen
                    </Button>
                  </a>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
