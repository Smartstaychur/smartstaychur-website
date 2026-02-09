import { trpc } from "@/lib/trpc";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star, MapPin, Phone, Mail, Globe, ExternalLink, ArrowLeft, Hotel,
  Wifi, Car, Coffee, PawPrint, Baby, Accessibility, ArrowUpDown,
  Sparkles, Waves, Dumbbell, UtensilsCrossed, Wine, BellRing, Snowflake, Sun,
  Clock
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HOTEL_AMENITIES } from "../../../shared/types";

const ICON_MAP: Record<string, any> = {
  Wifi, Car, Coffee, Dog: PawPrint, Baby, Accessibility, ArrowUpDown,
  Sparkles, Waves, Dumbbell, UtensilsCrossed, Wine, BellRing, Snowflake, Sun,
};

export default function HotelDetail() {
  const params = useParams<{ slug: string }>();
  const { data: hotel, isLoading, error } = trpc.hotel.getBySlug.useQuery(
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

  if (error || !hotel) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="container py-12 text-center">
          <Hotel className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Hotel nicht gefunden</h1>
          <Link href="/hotels"><Button variant="outline">Zurück zur Übersicht</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const activeAmenities = HOTEL_AMENITIES.filter((a) => (hotel as any)[a.key]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <div className="container py-8">
        <Link href="/hotels">
          <Button variant="ghost" size="sm" className="gap-1 mb-4">
            <ArrowLeft className="h-4 w-4" /> Alle Hotels
          </Button>
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              {hotel.name}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              {hotel.stars && (
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: hotel.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              )}
              {hotel.category && <Badge variant="secondary">{hotel.category}</Badge>}
            </div>
            {hotel.address && (
              <p className="text-muted-foreground flex items-center gap-1 mt-2">
                <MapPin className="h-4 w-4" /> {hotel.address}, {hotel.postalCode} {hotel.city}
              </p>
            )}
          </div>
          <div className="text-right">
            {(hotel.priceFrom || hotel.priceTo) ? (
              <div>
                <p className="text-sm text-muted-foreground">Preis pro Nacht</p>
                <p className="text-2xl font-bold text-primary">
                  CHF {hotel.priceFrom}{hotel.priceTo ? ` – ${hotel.priceTo}` : ""}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">Preis auf Anfrage</p>
            )}
            {hotel.website && (
              <a
                href={hotel.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="mt-2 gap-1">
                  Zur Hotel-Webseite <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Main Image */}
        {hotel.mainImage && (
          <div className="rounded-xl overflow-hidden mb-8">
            <img src={hotel.mainImage} alt={hotel.name} className="w-full h-64 md:h-96 object-cover" />
          </div>
        )}

        {/* Gallery */}
        {hotel.galleryImages && hotel.galleryImages.length > 1 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {hotel.galleryImages.slice(1, 7).map((img, i) => (
              <div key={i} className="rounded-lg overflow-hidden aspect-video">
                <img src={img} alt={`${hotel.name} ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {hotel.descriptionDe && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-3">Über das Hotel</h2>
                  <p className="text-muted-foreground whitespace-pre-line">{hotel.descriptionDe}</p>
                </CardContent>
              </Card>
            )}

            {/* Amenities */}
            {activeAmenities.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Ausstattung</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {activeAmenities.map((amenity) => {
                      const IconComp = ICON_MAP[amenity.icon] || Hotel;
                      return (
                        <div key={amenity.key} className="flex items-center gap-2 text-sm">
                          <IconComp className="h-4 w-4 text-primary" />
                          <span>{amenity.label}</span>
                        </div>
                      );
                    })}
                  </div>
                  {hotel.petsAllowed && hotel.petSurcharge && (
                    <p className="text-sm text-muted-foreground mt-3">
                      Haustier-Zuschlag: {hotel.petSurcharge}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Check-in/out */}
            {(hotel.checkInFrom || hotel.checkOutFrom) && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-3">Check-in / Check-out</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {hotel.checkInFrom && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Check-in</p>
                          <p className="font-medium">{hotel.checkInFrom}{hotel.checkInTo ? ` – ${hotel.checkInTo}` : ""}</p>
                        </div>
                      </div>
                    )}
                    {hotel.checkOutFrom && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Check-out</p>
                          <p className="font-medium">{hotel.checkOutFrom}{hotel.checkOutTo ? ` – ${hotel.checkOutTo}` : ""}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Special Features */}
            {hotel.specialFeatures && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-3">Besonderheiten</h2>
                  <p className="text-muted-foreground whitespace-pre-line">{hotel.specialFeatures}</p>
                </CardContent>
              </Card>
            )}

            {/* Gallery */}
            {hotel.galleryImages && hotel.galleryImages.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Bildergalerie</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {hotel.galleryImages.map((img, i) => (
                      <img key={i} src={img} alt={`${hotel.name} ${i + 1}`} className="rounded-lg h-40 w-full object-cover" />
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
                  {hotel.phone && (
                    <a href={`tel:${hotel.phone}`} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                      <Phone className="h-4 w-4 text-muted-foreground" /> {hotel.phone}
                    </a>
                  )}
                  {hotel.email && (
                    <a href={`mailto:${hotel.email}`} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                      <Mail className="h-4 w-4 text-muted-foreground" /> {hotel.email}
                    </a>
                  )}
                  {hotel.website && (
                    <a href={hotel.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                      <Globe className="h-4 w-4 text-muted-foreground" /> Webseite besuchen
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
