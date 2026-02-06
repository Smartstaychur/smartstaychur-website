import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, UtensilsCrossed, Search, Leaf, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CUISINE_TYPES, WEEKDAYS_DE, type OpeningHours } from "../../../shared/types";

function getTodayStatus(openingHours: OpeningHours | null | undefined): string {
  if (!openingHours) return "";
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const today = days[new Date().getDay()];
  const todayHours = openingHours[today as keyof OpeningHours];
  if (!todayHours) return "Heute geschlossen";
  return `Heute ${todayHours.open} – ${todayHours.close}`;
}

export default function Restaurants() {
  const [cuisineFilter, setCuisineFilter] = useState<string | undefined>();
  const [search, setSearch] = useState("");

  const { data: restaurants, isLoading } = trpc.restaurant.list.useQuery({
    cuisineType: cuisineFilter,
    search: search || undefined,
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-12">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Restaurants in Chur
          </h1>
          <p className="text-muted-foreground mb-6">
            Entdecken Sie die kulinarische Vielfalt der Alpenstadt
          </p>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Restaurant suchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={cuisineFilter === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => setCuisineFilter(undefined)}
            >
              Alle
            </Button>
            {CUISINE_TYPES.slice(0, 8).map((ct) => (
              <Button
                key={ct}
                variant={cuisineFilter === ct ? "default" : "outline"}
                size="sm"
                onClick={() => setCuisineFilter(cuisineFilter === ct ? undefined : ct)}
              >
                {ct}
              </Button>
            ))}
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
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                {restaurants?.length || 0} Restaurant{(restaurants?.length || 0) !== 1 ? "s" : ""} gefunden
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(restaurants || []).map((rest) => {
                  const todayStatus = getTodayStatus(rest.openingHours as OpeningHours | null);
                  return (
                    <Link key={rest.id} href={`/restaurants/${rest.slug}`}>
                      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer h-full">
                        <div className="h-48 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center relative">
                          {rest.mainImage ? (
                            <img src={rest.mainImage} alt={rest.name} className="w-full h-full object-cover" />
                          ) : (
                            <UtensilsCrossed className="h-12 w-12 text-amber-300" />
                          )}
                          {rest.vegetarianOptions && (
                            <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-1.5">
                              <Leaf className="h-3.5 w-3.5" />
                            </div>
                          )}
                        </div>
                        <CardContent className="p-5">
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors mb-1">
                            {rest.name}
                          </h3>
                          {rest.address && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                              <MapPin className="h-3.5 w-3.5 shrink-0" /> {rest.address}, {rest.city}
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
                          {todayStatus && (
                            <p className={`text-sm flex items-center gap-1 ${
                              todayStatus.includes("geschlossen") ? "text-red-500" : "text-green-600"
                            }`}>
                              <Clock className="h-3.5 w-3.5" /> {todayStatus}
                            </p>
                          )}
                          {rest.shortDescDe && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{rest.shortDescDe}</p>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
              {restaurants && restaurants.length === 0 && (
                <p className="text-center text-muted-foreground py-12">
                  Keine Restaurants gefunden. Versuchen Sie eine andere Suche.
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
