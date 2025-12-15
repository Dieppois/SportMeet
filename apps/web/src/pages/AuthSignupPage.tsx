import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import type { SportLevel } from "../services/localUserService";

export function AuthSignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sportName, setSportName] = useState("Football");
  const [sportLevel, setSportLevel] = useState<SportLevel>("Débutant");
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
      sportName,
      sportLevel,
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
            Décris ton profil sportif pour que Sport Matcher puisse te proposer
            des partenaires adaptés.
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

          <div className="grid grid-cols-2 gap-(--space-2)">
            <div className="space-y-(--space-1)">
              <label className="block text-(length:--font-size-xs) text-(--color-text-soft)">
                Sport principal
              </label>
              <select
                className="w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
                value={sportName}
                onChange={(event) => setSportName(event.target.value)}
              >
                <option value="Football">Football</option>
                <option value="Tennis">Tennis</option>
                <option value="Basketball">Basketball</option>
                <option value="Running">Running</option>
              </select>
            </div>
            <div className="space-y-(--space-1)">
              <label className="block text-(length:--font-size-xs) text-(--color-text-soft)">
                Niveau estimé
              </label>
              <select
                className="w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
                value={sportLevel}
                onChange={(event) =>
                  setSportLevel(event.target.value as SportLevel)
                }
              >
                <option value="Débutant">Débutant</option>
                <option value="Intermédiaire">Intermédiaire</option>
                <option value="Avancé">Avancé</option>
                <option value="Compétition">Compétition</option>
              </select>
            </div>
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


