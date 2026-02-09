import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, UtensilsCrossed, Hotel, ArrowRight, Mountain } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function Home() {
  const { data: hotels } = trpc.hotel.list.useQuery({ featured: true });
  const { data: restaurants } = trpc.restaurant.list.useQuery({ featured: true });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SmartStayChur",
    "description": "Hotels und Restaurants in Chur – Preise, Öffnungszeiten und Menüs auf einen Blick",
    "url": "https://smartstaychur.ch",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://smartstaychur.ch/hotels?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SEO
        title="SmartStayChur – Hotels & Restaurants in Chur"
        description="Entdecken Sie die besten Hotels und Restaurants in Chur. Preise, Öffnungszeiten, Menüs und Bewertungen auf einen Blick. Direkt buchen!"
        url="https://smartstaychur.ch"
        type="website"
        jsonLd={jsonLd}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-primary/80 text-white py-24 md:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTMwVjBoLTEydjRoMTJ6TTI0IDI0aDEydi0ySDI0djJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="container relative z-10 text-center">
          <div className="flex justify-center mb-6">
            <Mountain className="h-12 w-12 text-white/80" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Willkommen in Chur
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Entdecken Sie die besten Hotels und Restaurants der ältesten Stadt der Schweiz.
            Preise, Öffnungszeiten und Menüs auf einen Blick.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/hotels">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-white/90 gap-2">
                <Hotel className="h-5 w-5" /> Hotels entdecken
              </Button>
            </Link>
            <Link href="/restaurants">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2">
                <UtensilsCrossed className="h-5 w-5" /> Restaurants finden
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                Ausgewählte Hotels
              </h2>
              <p className="text-muted-foreground mt-1">Übernachten Sie in den besten Häusern der Region</p>
            </div>
            <Link href="/hotels">
              <Button variant="ghost" className="gap-1">
                Alle Hotels <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(hotels || []).slice(0, 6).map((hotel) => (
              <Link key={hotel.id} href={`/hotels/${hotel.slug}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer h-full">
                  <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    {hotel.mainImage ? (
                      <img src={hotel.mainImage} alt={hotel.name} className="w-full h-full object-cover" />
                    ) : (
                      <Hotel className="h-12 w-12 text-primary/30" />
                    )}
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{hotel.name}</h3>
                      {hotel.stars && (
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: hotel.stars }).map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      )}
                    </div>
                    {hotel.address && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                        <MapPin className="h-3.5 w-3.5" /> {hotel.address}, {hotel.city}
                      </p>
                    )}
                    {hotel.shortDescDe && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{hotel.shortDescDe}</p>
                    )}
                    {(hotel.priceFrom || hotel.priceTo) && (
                      <p className="mt-3 text-sm font-semibold text-primary">
                        ab CHF {hotel.priceFrom}
                        {hotel.priceTo ? ` – ${hotel.priceTo}` : ""} / Nacht
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {(!hotels || hotels.length === 0) && (
            <p className="text-center text-muted-foreground py-8">Noch keine Hotels vorhanden.</p>
          )}
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-16 bg-slate-50">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                Beliebte Restaurants
              </h2>
              <p className="text-muted-foreground mt-1">Geniessen Sie die kulinarische Vielfalt von Chur</p>
            </div>
            <Link href="/restaurants">
              <Button variant="ghost" className="gap-1">
                Alle Restaurants <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(restaurants || []).slice(0, 6).map((rest) => (
              <Link key={rest.id} href={`/restaurants/${rest.slug}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer h-full">
                  <div className="h-48 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                    {rest.mainImage ? (
                      <img src={rest.mainImage} alt={rest.name} className="w-full h-full object-cover" />
                    ) : (
                      <UtensilsCrossed className="h-12 w-12 text-amber-300" />
                    )}
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors mb-1">{rest.name}</h3>
                    {rest.address && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                        <MapPin className="h-3.5 w-3.5" /> {rest.address}, {rest.city}
                      </p>
                    )}
                    {rest.cuisineTypes && rest.cuisineTypes.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {rest.cuisineTypes.slice(0, 3).map((ct) => (
                          <span key={ct} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {ct}
                          </span>
                        ))}
                      </div>
                    )}
                    {rest.shortDescDe && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{rest.shortDescDe}</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {(!restaurants || restaurants.length === 0) && (
            <p className="text-center text-muted-foreground py-8">Noch keine Restaurants vorhanden.</p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
