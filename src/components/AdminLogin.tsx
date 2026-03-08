import { useState } from "react";
import { Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Email ou mot de passe incorrect");
    } else {
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="glass-card rounded-xl p-8 w-full max-w-sm space-y-6 text-center">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7 text-primary" />
        </div>
        <h1 className="font-heading font-bold text-xl text-foreground">Accès Admin</h1>
        <div className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            placeholder="Email"
            className="w-full bg-secondary text-foreground rounded-lg px-4 py-2.5 text-sm border border-border focus:border-primary focus:outline-none transition-colors"
            autoFocus
          />
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            placeholder="Mot de passe"
            className="w-full bg-secondary text-foreground rounded-lg px-4 py-2.5 text-sm border border-border focus:border-primary focus:outline-none transition-colors"
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-heading font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Vérification..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
