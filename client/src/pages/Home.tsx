import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Hotel, 
  UtensilsCrossed, 
  Mountain, 
  Search, 
  Bot, 
  MapPin,
  Star,
  ArrowRight,
  Sparkles,
  Loader2,
  ExternalLink
} from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [, setLocation] = useLocation();
  const { data: stats } = trpc.stats.get.useQuery();
  
  const { data: searchResults, isLoading: isSearching, refetch } = trpc.aiSearch.query.useQuery(
    { query: searchQuery },
    { enabled: false }
  );

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowResults(true);
      await refetch();
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hotel': return <Hotel className="w-4 h-4" />;
      case 'restaurant': return <UtensilsCrossed className="w-4 h-4" />;
      case 'experience': return <Mountain className="w-4 h-4" />;
      case 'daily_special': return <Sparkles className="w-4 h-4" />;
      default: return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'hotel': return 'Hotel';
      case 'restaurant': return 'Restaurant';
      case 'experience': return 'Erlebnis';
      case 'daily_special': return 'Tagesmenü';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
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
            <Link href="/restaurants" className="text-sm font-medium hover:text-primary transition-colors">
              Restaurants
            </Link>
            <Link href="/erlebnisse" className="text-sm font-medium hover:text-primary transition-colors">
              Erlebnisse
            </Link>
            <Link href="/admin">
              <Button variant="outline" size="sm">Admin</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Entdecken Sie{" "}
              <span className="text-primary">Chur</span>{" "}
              und Graubünden
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Die älteste Stadt der Schweiz erwartet Sie. Finden Sie Hotels, Restaurants 
              und Erlebnisse mit unserem KI-gestützten Reiseassistenten.
            </p>

            {/* AI Search Box */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <Input
                  type="text"
                  placeholder="Fragen Sie: 'Wo gibt es heute Spaghetti?' oder '3-Sterne-Hotel mit Balkon'"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-32 h-14 text-base rounded-full border-2 focus:border-primary"
                />
                <Button 
                  type="submit" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  Suchen
                </Button>
              </div>
            </form>

            {/* Example queries */}
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
              <span>Beispiele:</span>
              <button 
                onClick={() => { setSearchQuery("3 Sterne Hotel mit Familienzimmer"); }}
                className="text-primary hover:underline"
              >
                Familienzimmer
              </button>
              <span>·</span>
              <button 
                onClick={() => { setSearchQuery("Restaurant vegetarisch"); }}
                className="text-primary hover:underline"
              >
                Vegetarische Küche
              </button>
              <span>·</span>
              <button 
                onClick={() => { setSearchQuery("Stadtführung Altstadt"); }}
                className="text-primary hover:underline"
              >
                Stadtführung
              </button>
            </div>

            {/* Search Results */}
            {showResults && (
              <div className="mt-8 text-left">
                {isSearching ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <span className="ml-3 text-muted-foreground">Suche läuft...</span>
                  </div>
                ) : searchResults && searchResults.results.length > 0 ? (
                  <div className="bg-white rounded-2xl shadow-lg p-6 border">
                    <h3 className="font-semibold mb-4">
                      {searchResults.totalResults} Ergebnisse für "{searchResults.query}"
                    </h3>
                    <div className="space-y-3">
                      {searchResults.results.map((result, index) => (
                        <Link 
                          key={index} 
                          href={result.url}
                          className="block p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              {getTypeIcon(result.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{result.name}</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                  {getTypeLabel(result.type)}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {result.description}
                              </p>

                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : searchResults && searchResults.results.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-lg p-6 border text-center">
                    <p className="text-muted-foreground">
                      Keine Ergebnisse für "{searchResults.query}" gefunden.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Versuchen Sie es mit anderen Suchbegriffen oder durchsuchen Sie unsere Kategorien.
                    </p>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary">
                {stats?.hotelCount ?? 19}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Hotels</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary">
                {stats?.restaurantCount ?? 75}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Restaurants</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary">
                {stats?.experienceCount ?? 15}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Erlebnisse</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Was suchen Sie?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Entdecken Sie das vielfältige Angebot in Chur und der Region Graubünden
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Hotels Card */}
            <Link href="/hotels">
              <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Hotel className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Hotels</CardTitle>
                  <CardDescription>
                    Von gemütlichen Pensionen bis zu eleganten 4-Sterne-Hotels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-primary font-medium">
                    {stats?.hotelCount ?? 19} Unterkünfte entdecken
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Restaurants Card */}
            <Link href="/restaurants">
              <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                    <UtensilsCrossed className="w-7 h-7 text-secondary" />
                  </div>
                  <CardTitle className="text-xl">Restaurants</CardTitle>
                  <CardDescription>
                    Bündner Spezialitäten und internationale Küche
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-secondary font-medium">
                    {stats?.restaurantCount ?? 75} Restaurants entdecken
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Experiences Card */}
            <Link href="/erlebnisse">
              <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 rounded-2xl bg-accent/30 flex items-center justify-center mb-4 group-hover:bg-accent/50 transition-colors">
                    <Mountain className="w-7 h-7 text-accent-foreground" />
                  </div>
                  <CardTitle className="text-xl">Erlebnisse</CardTitle>
                  <CardDescription>
                    Stadtführungen, Wanderungen und kulturelle Highlights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-accent-foreground font-medium">
                    {stats?.experienceCount ?? 15} Aktivitäten entdecken
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* AI Optimization Info */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-6 p-6 bg-white rounded-2xl shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">KI-optimiert für moderne Reiseplanung</h3>
                <p className="text-muted-foreground mb-4">
                  SmartStayChur ist speziell für KI-Assistenten wie ChatGPT, Claude und Gemini optimiert. 
                  Fragen Sie Ihren bevorzugten KI-Assistenten nach Hotels, Restaurants oder Aktivitäten 
                  in Chur – er wird die aktuellsten Informationen von unserer Plattform abrufen.
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <a href="/llms.txt" className="text-primary hover:underline flex items-center gap-1">
                    <span>llms.txt</span>
                  </a>
                  <a href="/ai.txt" className="text-primary hover:underline flex items-center gap-1">
                    <span>ai.txt</span>
                  </a>
                  <a href="/api/feeds/hotels.json" className="text-primary hover:underline flex items-center gap-1">
                    <span>Hotels API</span>
                  </a>
                  <a href="/api/feeds/restaurants.json" className="text-primary hover:underline flex items-center gap-1">
                    <span>Restaurants API</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t py-12 bg-muted/20">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold">SmartStayChur</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Ihr digitaler Reisebegleiter für Chur und Graubünden.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Entdecken</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/hotels" className="hover:text-primary">Hotels</Link></li>
                <li><Link href="/restaurants" className="hover:text-primary">Restaurants</Link></li>
                <li><Link href="/erlebnisse" className="hover:text-primary">Erlebnisse</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Für Anbieter</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/admin" className="hover:text-primary">Admin-Login</Link></li>
                <li><Link href="/admin/daily-specials" className="hover:text-primary">Tagesmenüs verwalten</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">KI-Integration</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/llms.txt" className="hover:text-primary">llms.txt</a></li>
                <li><a href="/ai.txt" className="hover:text-primary">ai.txt</a></li>
                <li><a href="/api/feeds/hotels.json" className="hover:text-primary">API-Feeds</a></li>
                <li><a href="/.well-known/ai-plugin.json" className="hover:text-primary">AI Plugin</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} SmartStayChur. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
