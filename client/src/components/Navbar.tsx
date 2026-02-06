import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/hotels", label: "Hotels" },
  { href: "/restaurants", label: "Restaurants" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <Mountain className="h-6 w-6 text-primary" />
          <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-primary">
            SmartStayChur
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/admin">
            <Button variant="outline" size="sm">
              Anbieter-Login
            </Button>
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white p-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block text-sm font-medium py-2 ${
                location === link.href ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/admin" onClick={() => setMobileOpen(false)}>
            <Button variant="outline" size="sm" className="w-full">
              Anbieter-Login
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
