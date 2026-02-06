import { useProviderAuth } from "@/hooks/useProviderAuth";
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, KeyRound, Loader2, AlertCircle, CheckCircle } from "lucide-react";

export default function AdminChangePassword() {
  const { provider } = useProviderAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("Passwörter stimmen nicht überein");
      return;
    }
    if (newPassword.length < 6) {
      setError("Neues Passwort muss mindestens 6 Zeichen lang sein");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/provider-auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
      } else {
        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setError("Netzwerkfehler");
    } finally {
      setLoading(false);
    }
  };

  if (!provider) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="container flex items-center gap-3 h-14">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" /> Dashboard
            </Button>
          </Link>
          <h1 className="font-semibold flex items-center gap-2">
            <KeyRound className="h-5 w-5" /> Passwort ändern
          </h1>
        </div>
      </header>

      <div className="container py-8 max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Passwort ändern</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="h-4 w-4 shrink-0" /> Passwort erfolgreich geändert
                </div>
              )}
              <div className="space-y-2">
                <Label>Aktuelles Passwort</Label>
                <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Neues Passwort</Label>
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
              </div>
              <div className="space-y-2">
                <Label>Neues Passwort bestätigen</Label>
                <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Passwort ändern
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
