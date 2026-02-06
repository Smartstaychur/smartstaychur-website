import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin,
  Star,
  Phone,
  Mail,
  Globe,
  ExternalLink,
  Wifi,
  Car,
  Coffee,
  PawPrint,
  Baby,
  Accessibility,
  ArrowLeft,
  Clock,
  Utensils,
  Dumbbell,
  Waves,
  Wind
} from "lucide-react";

export default function HotelDetail() {
  const params = useParams<{ slug: string }>();
  const { data: hotel, isLoading } = trpc.hotels.getBySlug.useQuery({ slug: params.slug || "" });
  const { data: roomTypes } = trpc.roomTypes.getByHotelId.useQuery(
    { hotelId: hotel?.id || 0 },
    { enabled: !!hotel?.id }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Hotel nicht gefunden</h1>
        <Link href="/hotels">
          <Button>Zurück zur Übersicht</Button>
        </Link>
      </div>
    );
  }

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
            <Link href="/hotels" className="text-sm font-medium text-primary">
              Hotels
            </Link>
            <Link href="/restaurants" className="text-sm font-medium hover:text-primary transition-colors">
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
        <section className="bg-gradient-to-br from-primary/10 to-transparent py-8">
          <div className="container">
            <Link href="/hotels" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Zurück zur Übersicht
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold">{hotel.name}</h1>
                  {hotel.stars && (
                    <Badge className="flex items-center gap-1">
                      {hotel.stars} <Star className="w-3 h-3 fill-current" />
                    </Badge>
                  )}
                </div>
                <p className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1" />
                  {hotel.address}, {hotel.postalCode} {hotel.city}
                </p>
              </div>
              
              {hotel.bookingUrl && (
                <a href={hotel.bookingUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="gap-2">
                    Jetzt buchen <ExternalLink className="w-4 h-4" />
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
                  <CardTitle>Über das Hotel</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {hotel.description || hotel.shortDescription}
                  </p>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card>
                <CardHeader>
                  <CardTitle>Ausstattung</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {hotel.wifi && (
                      <div className="flex items-center gap-2">
                        <Wifi className="w-5 h-5 text-primary" />
                        <span>WLAN {hotel.wifiFree ? "(gratis)" : ""}</span>
                      </div>
                    )}
                    {hotel.parking && (
                      <div className="flex items-center gap-2">
                        <Car className="w-5 h-5 text-primary" />
                        <span>Parkplatz</span>
                      </div>
                    )}
                    {hotel.breakfast && (
                      <div className="flex items-center gap-2">
                        <Coffee className="w-5 h-5 text-primary" />
                        <span>Frühstück {hotel.breakfastIncluded ? "(inkl.)" : ""}</span>
                      </div>
                    )}
                    {hotel.restaurant && (
                      <div className="flex items-center gap-2">
                        <Utensils className="w-5 h-5 text-primary" />
                        <span>Restaurant</span>
                      </div>
                    )}
                    {hotel.petsAllowed && (
                      <div className="flex items-center gap-2">
                        <PawPrint className="w-5 h-5 text-primary" />
                        <span>Haustiere erlaubt</span>
                      </div>
                    )}
                    {hotel.familyFriendly && (
                      <div className="flex items-center gap-2">
                        <Baby className="w-5 h-5 text-primary" />
                        <span>Familienfreundlich</span>
                      </div>
                    )}
                    {hotel.wheelchairAccessible && (
                      <div className="flex items-center gap-2">
                        <Accessibility className="w-5 h-5 text-primary" />
                        <span>Barrierefrei</span>
                      </div>
                    )}
                    {hotel.gym && (
                      <div className="flex items-center gap-2">
                        <Dumbbell className="w-5 h-5 text-primary" />
                        <span>Fitnessraum</span>
                      </div>
                    )}
                    {hotel.pool && (
                      <div className="flex items-center gap-2">
                        <Waves className="w-5 h-5 text-primary" />
                        <span>Pool</span>
                      </div>
                    )}
                    {hotel.spa && (
                      <div className="flex items-center gap-2">
                        <Wind className="w-5 h-5 text-primary" />
                        <span>Spa/Wellness</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Room Types from Text */}
              {hotel.roomTypesText && (
                <Card>
                  <CardHeader>
                    <CardTitle>Verfügbare Zimmertypen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {hotel.roomTypesText.split(',').map((type, i) => (
                        <Badge key={i} variant="outline" className="text-sm">
                          {type.trim()}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Amenities Text */}
              {hotel.amenitiesText && (
                <Card>
                  <CardHeader>
                    <CardTitle>Zimmerausstattung</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {hotel.amenitiesText.split(',').map((amenity, i) => (
                        <Badge key={i} variant="secondary" className="text-sm">
                          {amenity.trim()}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Room Types */}
              {roomTypes && roomTypes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Zimmertypen</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {roomTypes.map((room) => (
                      <div key={room.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{room.name}</h4>
                            {room.beds && (
                              <p className="text-sm text-muted-foreground">{room.beds}</p>
                            )}
                          </div>
                          {room.pricePerNight && (
                            <div className="text-right">
                              <span className="text-lg font-bold text-primary">
                                CHF {room.pricePerNight}
                              </span>
                              <span className="text-sm text-muted-foreground block">
                                pro Nacht
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {room.description && (
                          <p className="text-sm text-muted-foreground mb-3">{room.description}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-2">
                          {room.maxGuests && (
                            <Badge variant="outline">Max. {room.maxGuests} Gäste</Badge>
                          )}
                          {room.sizeSqm && (
                            <Badge variant="outline">{room.sizeSqm} m²</Badge>
                          )}
                          {room.balcony && <Badge variant="outline">Balkon</Badge>}
                          {room.mountainView && <Badge variant="outline">Bergblick</Badge>}
                          {room.babyCot && <Badge variant="outline">Babybett</Badge>}
                          {room.minibar && <Badge variant="outline">Minibar</Badge>}
                          {room.tv && <Badge variant="outline">TV</Badge>}
                          {room.safe && <Badge variant="outline">Safe</Badge>}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Preise</CardTitle>
                </CardHeader>
                <CardContent>
                  {hotel.priceFrom ? (
                    <div className="text-center">
                      <span className="text-sm text-muted-foreground">ab</span>
                      <div className="text-3xl font-bold text-primary">
                        CHF {hotel.priceFrom}
                      </div>
                      <span className="text-sm text-muted-foreground">pro Nacht</span>
                      
                      {hotel.priceTo && (
                        <p className="text-sm text-muted-foreground mt-2">
                          bis CHF {hotel.priceTo}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground">Preis auf Anfrage</p>
                  )}
                  
                  {hotel.bookingUrl && (
                    <a href={hotel.bookingUrl} target="_blank" rel="noopener noreferrer" className="block mt-4">
                      <Button className="w-full gap-2">
                        Verfügbarkeit prüfen <ExternalLink className="w-4 h-4" />
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>

              {/* Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Kontakt</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {hotel.phone && (
                    <a href={`tel:${hotel.phone}`} className="flex items-center gap-2 text-sm hover:text-primary">
                      <Phone className="w-4 h-4" />
                      {hotel.phone}
                    </a>
                  )}
                  {hotel.email && (
                    <a href={`mailto:${hotel.email}`} className="flex items-center gap-2 text-sm hover:text-primary">
                      <Mail className="w-4 h-4" />
                      {hotel.email}
                    </a>
                  )}
                  {hotel.website && (
                    <a href={hotel.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-primary">
                      <Globe className="w-4 h-4" />
                      Website besuchen
                    </a>
                  )}
                </CardContent>
              </Card>

              {/* Check-in/out */}
              {(hotel.checkInFrom || hotel.checkOutUntil) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Check-in / Check-out</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {hotel.checkInFrom && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>Check-in ab {hotel.checkInFrom}</span>
                      </div>
                    )}
                    {hotel.checkOutUntil && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>Check-out bis {hotel.checkOutUntil}</span>
                      </div>
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
