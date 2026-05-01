import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { Loader2, X } from "lucide-react";

export function LoginModal({ onClose }: { onClose: () => void }) {
  const { login, loginError, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    try {
      await login(email, password);
      onClose();
    } catch {
      setLocalError("Email ou mot de passe incorrect");
    }
  };

  const errorMsg = localError || (loginError ? "Email ou mot de passe incorrect" : "");

  return (
    <div className="pointer-events-auto fixed inset-0 z-[60] flex items-center justify-center bg-[#11061d]/55 backdrop-blur-md px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/50 bg-white/85 p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#2a1738]">Connexion</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-[#8f7da9] transition-colors hover:bg-white/70 hover:text-[#3b2751]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-[#6d5b87]">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              placeholder="ton@email.com"
              className="w-full rounded-xl border border-[#e7d8f5] bg-white/90 px-3 py-2 text-sm text-[#2b1740] outline-none transition-colors focus:border-[#d38ce6]"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-[#6d5b87]">Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full rounded-xl border border-[#e7d8f5] bg-white/90 px-3 py-2 text-sm text-[#2b1740] outline-none transition-colors focus:border-[#d38ce6]"
            />
          </label>

          {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7f4a5d] via-[#a56b7d] to-[#d8a1a8] py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-95 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
