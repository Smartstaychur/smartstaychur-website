import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Hotel, 
  Search, 
  MapPin,
  Star,
  Phone,
  Globe,
  Wifi,
  Car,
  Coffee,
  PawPrint,
  Baby,
  Accessibility,
  ArrowLeft
} from "lucide-react";

export default function Hotels() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStars, setSelectedStars] = useState<number | null>(null);
  
  const { data: hotels, isLoading } = trpc.hotels.search.useQuery({
    query: searchQuery || undefined,
    stars: selectedStars || undefined,
  });

  const starFilters = [null, 2, 3, 4, 5];

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
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/10 to-transparent py-12">
          <div className="container">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Zurück zur Startseite
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Hotels in Chur und Umgebung
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Entdecken Sie {hotels?.length ?? 19} Unterkünfte – von gemütlichen Pensionen 
              bis zu eleganten 4-Sterne-Hotels.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 border-b bg-white">
          <div className="container">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Hotel suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Star Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sterne:</span>
                {starFilters.map((stars) => (
                  <Button
                    key={stars ?? "all"}
                    variant={selectedStars === stars ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStars(stars)}
                  >
                    {stars === null ? "Alle" : (
                      <span className="flex items-center gap-1">
                        {stars} <Star className="w-3 h-3 fill-current" />
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Hotel List */}
        <section className="py-8">
          <div className="container">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-muted rounded w-full mb-2" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : hotels && hotels.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotels.map((hotel) => (
                  <Link key={hotel.id} href={`/hotels/${hotel.slug}`}>
                    <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{hotel.name}</CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              {hotel.city}
                            </CardDescription>
                          </div>
                          {hotel.stars && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              {hotel.stars} <Star className="w-3 h-3 fill-current" />
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {hotel.shortDescription}
                        </p>
                        
                        {/* Amenities */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {hotel.wifi && (
                            <Badge variant="outline" className="text-xs">
                              <Wifi className="w-3 h-3 mr-1" /> WLAN
                            </Badge>
                          )}
                          {hotel.parking && (
                            <Badge variant="outline" className="text-xs">
                              <Car className="w-3 h-3 mr-1" /> Parking
                            </Badge>
                          )}
                          {hotel.breakfast && (
                            <Badge variant="outline" className="text-xs">
                              <Coffee className="w-3 h-3 mr-1" /> Frühstück
                            </Badge>
                          )}
                          {hotel.petsAllowed && (
                            <Badge variant="outline" className="text-xs">
                              <PawPrint className="w-3 h-3 mr-1" /> Haustiere
                            </Badge>
                          )}
                        </div>
                        
                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            {hotel.priceFrom ? (
                              <span className="font-semibold text-primary">
                                ab CHF {hotel.priceFrom}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">Preis auf Anfrage</span>
                            )}
                          </div>
                          <Button variant="ghost" size="sm" className="text-primary">
                            Details →
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Hotel className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Keine Hotels gefunden</h3>
                <p className="text-muted-foreground">
                  Versuchen Sie eine andere Suche oder entfernen Sie Filter.
                </p>
              </div>
            )}
          </div>
        </section>
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
