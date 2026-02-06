import { Mountain } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Mountain className="h-5 w-5 text-primary" />
              <span className="font-semibold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                SmartStayChur
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Ihr Portal für Hotels und Restaurants in Chur und Umgebung. Entdecken Sie die Vielfalt der Alpenstadt.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-3">Entdecken</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/hotels" className="hover:text-white transition-colors">Hotels</a></li>
              <li><a href="/restaurants" className="hover:text-white transition-colors">Restaurants</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-3">Für Anbieter</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/admin" className="hover:text-white transition-colors">Anbieter-Login</a></li>
              <li className="text-slate-500 text-xs mt-2">Verwalten Sie Ihre Einträge selbst</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 mt-8 pt-6 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} SmartStayChur. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
}
