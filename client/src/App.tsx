import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Hotels from "./pages/Hotels";
import HotelDetail from "./pages/HotelDetail";
import Restaurants from "./pages/Restaurants";
import RestaurantDetail from "./pages/RestaurantDetail";
import Admin from "./pages/Admin";
import AdminHotels from "./pages/AdminHotels";
import AdminRestaurants from "./pages/AdminRestaurants";
import AdminProviders from "./pages/AdminProviders";
import AdminChangePassword from "./pages/AdminChangePassword";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/hotels" component={Hotels} />
      <Route path="/hotels/:slug" component={HotelDetail} />
      <Route path="/restaurants" component={Restaurants} />
      <Route path="/restaurants/:slug" component={RestaurantDetail} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/hotels" component={AdminHotels} />
      <Route path="/admin/restaurants" component={AdminRestaurants} />
      <Route path="/admin/providers" component={AdminProviders} />
      <Route path="/admin/password" component={AdminChangePassword} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
