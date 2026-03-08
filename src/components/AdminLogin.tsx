import { useState, useEffect } from "react";
import { Lock } from "lucide-react";

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

const _a = [80,105,110,103,111,117,105,110,48,49,42];
const _k = () => String.fromCharCode(..._a);

export default function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expectedHash, setExpectedHash] = useState("");

  useEffect(() => {
    sha256(_k()).then(setExpectedHash);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const hash = await sha256(password);
    if (hash === expectedHash) {
      sessionStorage.setItem("admin_auth", "1");
      onSuccess();
    } else {
      setError(true);
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
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            placeholder="Mot de passe"
            className="w-full bg-secondary text-foreground rounded-lg px-4 py-2.5 text-sm border border-border focus:border-primary focus:outline-none transition-colors"
            autoFocus
          />
          {error && <p className="text-destructive text-sm mt-2">Mot de passe incorrect</p>}
        </div>
        <button
          type="submit"
          disabled={loading || !expectedHash}
          className="w-full bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-heading font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Vérification..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
