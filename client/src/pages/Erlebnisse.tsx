import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Mountain, 
  Search, 
  MapPin,
  Clock,
  Users,
  ArrowLeft,
  Compass,
  Footprints,
  Landmark,
  Bike,
  Heart,
  Baby,
  Sparkles,
  Wine
} from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  tour: <Compass className="w-5 h-5" />,
  hiking: <Footprints className="w-5 h-5" />,
  culture: <Landmark className="w-5 h-5" />,
  sport: <Bike className="w-5 h-5" />,
  wellness: <Heart className="w-5 h-5" />,
  family: <Baby className="w-5 h-5" />,
  adventure: <Sparkles className="w-5 h-5" />,
  food_wine: <Wine className="w-5 h-5" />,
};

const categoryNames: Record<string, string> = {
  tour: "Stadtführung",
  hiking: "Wanderung",
  culture: "Kultur",
  sport: "Sport",
  wellness: "Wellness",
  family: "Familie",
  adventure: "Abenteuer",
  food_wine: "Kulinarik",
};

export default function Erlebnisse() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { data: experiences, isLoading } = trpc.experiences.search.useQuery({
    query: searchQuery || undefined,
    category: selectedCategory || undefined,
  });

  const categories = Object.keys(categoryNames);

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
            <Link href="/restaurants" className="text-sm font-medium hover:text-primary transition-colors">
              Restaurants
            </Link>
            <Link href="/erlebnisse" className="text-sm font-medium text-primary">
              Erlebnisse
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-accent/20 to-transparent py-12">
          <div className="container">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Zurück zur Startseite
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Erlebnisse in Chur und Graubünden
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Entdecken Sie {experiences?.length ?? 15} einzigartige Aktivitäten – von 
              Stadtführungen durch die historische Altstadt bis zu alpinen Abenteuern.
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
                  placeholder="Erlebnis suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Category Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Kategorie:</span>
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  Alle
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    className="gap-1"
                  >
                    {categoryIcons[cat]}
                    <span className="hidden sm:inline">{categoryNames[cat]}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Experience List */}
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
            ) : experiences && experiences.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {experiences.map((experience) => (
                  <Link key={experience.id} href={`/erlebnisse/${experience.slug}`}>
                    <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-3">
                            {categoryIcons[experience.category] || <Mountain className="w-6 h-6" />}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {categoryNames[experience.category] || experience.category}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{experience.name}</CardTitle>
                        {experience.location && (
                          <CardDescription className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {experience.location}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {experience.shortDescription}
                        </p>
                        
                        {/* Details */}
                        <div className="flex flex-wrap gap-3 mb-4 text-sm text-muted-foreground">
                          {experience.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {experience.duration}
                            </span>
                          )}
                          {experience.maxParticipants && (
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              max. {experience.maxParticipants} Pers.
                            </span>
                          )}
                        </div>
                        
                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            {experience.priceAdult ? (
                              <span className="font-semibold text-primary">
                                ab CHF {experience.priceAdult}
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
                <Mountain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Keine Erlebnisse gefunden</h3>
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
