import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export function AuthSignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await signup({
      pseudo,
      email,
      password,
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error ?? "Impossible de créer le compte.");
      return;
    }

    navigate("/profile");
  };

  return (
    <main className="min-h-screen bg-(--color-bg) text-(--color-text-main) flex items-center justify-center px-(--space-4)">
      <section className="w-full max-w-md rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-4) shadow-(--shadow-primary-soft)">
        <header className="mb-(--space-3)">
          <h1 className="text-(length:--font-size-2xl) font-semibold">
            Créer un compte
          </h1>
          <p className="mt-(--space-1) text-(length:--font-size-xs) text-(--color-text-muted)">
            Crée ton profil en quelques secondes pour accéder aux groupes et
            activités autour de toi.
          </p>
        </header>

        <form className="space-y-(--space-3)" onSubmit={handleSubmit}>
          <div className="space-y-(--space-1)">
            <label className="block text-(length:--font-size-xs) text-(--color-text-soft)">
              Pseudo
            </label>
            <input
              value={pseudo}
              onChange={(event) => setPseudo(event.target.value)}
              className="w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
              placeholder="Ex : NicoFoot10"
            />
          </div>

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

          {error ? (
            <p className="text-(length:--font-size-xs) text-red-400">{error}</p>
          ) : null}

          <button type="submit" className="btn btn-primary btn-full">
            {isSubmitting ? "Création en cours..." : "Créer mon compte"}
          </button>

          <p className="text-center text-(length:--font-size-xs) text-(--color-text-muted)">
            Tu as déjà un compte ?{" "}
            <a href="/login" className="text-(--color-primary-light)">
              Se connecter
            </a>
          </p>
        </form>
      </section>
    </main>
  );
}


