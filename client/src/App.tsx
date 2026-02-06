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
import Erlebnisse from "./pages/Erlebnisse";
import Admin from "./pages/Admin";
import AdminDailySpecials from "./pages/AdminDailySpecials";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/hotels" component={Hotels} />
      <Route path="/hotels/:slug" component={HotelDetail} />
      <Route path="/restaurants" component={Restaurants} />
      <Route path="/restaurants/:slug" component={RestaurantDetail} />
      <Route path="/erlebnisse" component={Erlebnisse} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/daily-specials" component={AdminDailySpecials} />
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
