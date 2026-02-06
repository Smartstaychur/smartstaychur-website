import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, MapPin, Hotel, Search, Wifi, Car, Coffee, PawPrint } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Hotels() {
  const [starsFilter, setStarsFilter] = useState<number | undefined>();
  const [search, setSearch] = useState("");

  const { data: hotels, isLoading } = trpc.hotel.list.useQuery({
    stars: starsFilter,
    search: search || undefined,
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-12">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Hotels in Chur
          </h1>
          <p className="text-muted-foreground mb-6">
            Finden Sie Ihre perfekte Unterkunft in der Alpenstadt
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Hotel suchen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={starsFilter === undefined ? "default" : "outline"}
                size="sm"
                onClick={() => setStarsFilter(undefined)}
              >
                Alle
              </Button>
              {[3, 4, 5].map((s) => (
                <Button
                  key={s}
                  variant={starsFilter === s ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStarsFilter(starsFilter === s ? undefined : s)}
                  className="gap-1"
                >
                  {s} <Star className="h-3 w-3 fill-current" />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 flex-1">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted" />
                  <CardContent className="p-5 space-y-3">
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                {hotels?.length || 0} Hotel{(hotels?.length || 0) !== 1 ? "s" : ""} gefunden
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(hotels || []).map((hotel) => (
                  <Link key={hotel.id} href={`/hotels/${hotel.slug}`}>
                    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer h-full">
                      <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative">
                        {hotel.mainImage ? (
                          <img src={hotel.mainImage} alt={hotel.name} className="w-full h-full object-cover" />
                        ) : (
                          <Hotel className="h-12 w-12 text-primary/30" />
                        )}
                        {hotel.stars && (
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full px-2 py-1 flex items-center gap-0.5">
                            {Array.from({ length: hotel.stars }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        )}
                      </div>
                      <CardContent className="p-5">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors mb-1">
                          {hotel.name}
                        </h3>
                        {hotel.address && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                            <MapPin className="h-3.5 w-3.5 shrink-0" /> {hotel.address}, {hotel.city}
                          </p>
                        )}
                        {hotel.shortDescDe && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{hotel.shortDescDe}</p>
                        )}
                        {/* Amenity icons */}
                        <div className="flex gap-2 mb-3 text-muted-foreground">
                          {hotel.wifiFree && <Wifi className="h-4 w-4" />}
                          {(hotel.parkingFree || hotel.parkingPaid) && <Car className="h-4 w-4" />}
                          {hotel.breakfastIncluded && <Coffee className="h-4 w-4" />}
                          {hotel.petsAllowed && <PawPrint className="h-4 w-4" />}
                        </div>
                        {(hotel.priceFrom || hotel.priceTo) ? (
                          <p className="text-sm font-semibold text-primary">
                            ab CHF {hotel.priceFrom}
                            {hotel.priceTo ? ` – ${hotel.priceTo}` : ""} / Nacht
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">Preis auf Anfrage</p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              {hotels && hotels.length === 0 && (
                <p className="text-center text-muted-foreground py-12">
                  Keine Hotels gefunden. Versuchen Sie eine andere Suche.
                </p>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
