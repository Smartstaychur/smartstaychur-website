import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  UtensilsCrossed, 
  Search, 
  MapPin,
  Phone,
  Globe,
  Clock,
  Leaf,
  ArrowLeft
} from "lucide-react";

export default function Restaurants() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: restaurants, isLoading } = trpc.restaurants.search.useQuery({
    query: searchQuery || undefined,
  });

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
        {/* Hero */}
        <section className="bg-gradient-to-br from-secondary/10 to-transparent py-12">
          <div className="container">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Zurück zur Startseite
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Restaurants in Chur und Umgebung
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Entdecken Sie {restaurants?.length ?? 75} Restaurants – von Bündner Spezialitäten 
              bis zur internationalen Küche.
            </p>
          </div>
        </section>

        {/* Search */}
        <section className="py-6 border-b bg-white">
          <div className="container">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Restaurant oder Küche suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </section>

        {/* Restaurant List */}
        <section className="py-8">
          <div className="container">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
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
            ) : restaurants && restaurants.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map((restaurant) => (
                  <Link key={restaurant.id} href={`/restaurants/${restaurant.slug}`}>
                    <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{restaurant.name}</CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              {restaurant.city}
                            </CardDescription>
                          </div>
                          {restaurant.cuisineType && (
                            <Badge variant="secondary" className="text-xs">
                              {restaurant.cuisineType}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {restaurant.shortDescription || restaurant.address}
                        </p>
                        
                        {/* Features */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {restaurant.vegetarianOptions && (
                            <Badge variant="outline" className="text-xs">
                              <Leaf className="w-3 h-3 mr-1" /> Vegetarisch
                            </Badge>
                          )}
                          {restaurant.veganOptions && (
                            <Badge variant="outline" className="text-xs">
                              <Leaf className="w-3 h-3 mr-1" /> Vegan
                            </Badge>
                          )}
                          {restaurant.outdoorSeating && (
                            <Badge variant="outline" className="text-xs">
                              Terrasse
                            </Badge>
                          )}
                        </div>
                        
                        {/* Contact */}
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          {restaurant.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {restaurant.phone}
                            </span>
                          )}
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
                <UtensilsCrossed className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Keine Restaurants gefunden</h3>
                <p className="text-muted-foreground">
                  Versuchen Sie eine andere Suche.
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
