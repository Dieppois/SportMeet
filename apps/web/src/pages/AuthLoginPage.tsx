import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export function AuthLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await login(email, password);

    setIsSubmitting(false);
    if (!result.ok) {
      setError(result.error ?? "Impossible de se connecter.");
      return;
    }

    navigate("/profile");
  };

  return (
    <main className="min-h-screen bg-(--color-bg) text-(--color-text-main) flex items-center justify-center px-(--space-4)">
      <section className="w-full max-w-md rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-4) shadow-(--shadow-primary-soft)">
        <header className="mb-(--space-3)">
          <h1 className="text-(length:--font-size-2xl) font-semibold">
            Connexion
          </h1>
          <p className="mt-(--space-1) text-(length:--font-size-xs) text-(--color-text-muted)">
            Reprends ta session pour retrouver tes matchs, groupes et activités.
          </p>
        </header>

        <form className="space-y-(--space-3)" onSubmit={handleSubmit}>
          <div className="space-y-(--space-1)">
            <label className="block text-(length:--font-size-xs) text-(--color-text-soft)">
              Email
            </label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
              placeholder="ton.email@sport.com"
            />
          </div>

          <div className="space-y-(--space-1)">
            <label className="block text-(length:--font-size-xs) text-(--color-text-soft)">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between text-(length:--font-size-xs)">
            <div className="flex items-center gap-(--space-1)">
              <input type="checkbox" className="h-3 w-3 accent-[--color-primary]" />
              <span className="text-(--color-text-soft)">Se souvenir de moi</span>
            </div>
            <Link to="/forgot-password" className="text-(--color-primary-light)">
              Mot de passe oublié ?
            </Link>
          </div>

          {error ? (
            <p className="text-(length:--font-size-xs) text-red-400">{error}</p>
          ) : null}

          <button type="submit" className="btn btn-primary btn-full">
            {isSubmitting ? "Connexion en cours..." : "Se connecter"}
          </button>

          <p className="text-center text-(length:--font-size-xs) text-(--color-text-muted)">
            Pas encore de compte ?{" "}
            <Link to="/signup" className="text-(--color-primary-light)">
              Créer un compte
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}


