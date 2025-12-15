import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth, useUpdateProfile } from "../context/AuthContext";

export function ProfilePage() {
  const { user, logout } = useAuth();
  const updateProfile = useUpdateProfile();
  const navigate = useNavigate();

  const [pseudo, setPseudo] = useState(user?.pseudo ?? "");
  const [city, setCity] = useState(user?.city ?? "");
  const [availability, setAvailability] = useState(user?.availability ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!user) {
    return (
      <main className="min-h-screen bg-(--color-bg) text-(--color-text-main) flex items-center justify-center px-(--space-4)">
        <div className="rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-4) text-center space-y-(--space-2)">
          <p className="text-(length:--font-size-sm)">
            Tu dois être connecté pour accéder à ton profil.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("/login")}
          >
            Aller à la connexion
          </button>
        </div>
      </main>
    );
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSaving(true);

    const result = await updateProfile({
      pseudo,
      city,
      availability,
    });

    setIsSaving(false);

    if (!result.ok) {
      setError(result.error ?? "Erreur lors de la mise à jour du profil.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-(--color-bg) text-(--color-text-main) px-(--space-4) py-(--space-5)">
      <div className="mx-auto flex max-w-5xl flex-col gap-(--space-4)">
        <header className="flex flex-col gap-(--space-1) md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-(length:--font-size-2xl) font-semibold">
              Mon profil
            </h1>
            <p className="text-(length:--font-size-xs) text-(--color-text-muted)">
              Informations stockées en local pour simuler la future API (US-001
              à 006).
            </p>
          </div>
          <div className="flex gap-(--space-2)">
            <Link to="/" className="btn btn-secondary btn-sm">
              Retour à l&apos;accueil
            </Link>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleLogout}
            >
              Se déconnecter
            </button>
          </div>
        </header>

        <section className="grid gap-(--space-3) md:grid-cols-[2fr,1.2fr]">
          <form
            className="rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-3) space-y-(--space-3)"
            onSubmit={handleSubmit}
          >
            <div className="flex items-center gap-(--space-3)">
              <div className="h-16 w-16 rounded-full bg-(--gray-800) text-center text-(length:--font-size-lg) font-semibold leading-[4rem]">
                {user.pseudo.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-(length:--font-size-lg) font-semibold">
                  {user.pseudo}
                </p>
                <p className="text-(length:--font-size-xs) text-(--color-text-muted)">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="space-y-(--space-2) text-(length:--font-size-xs)">
              <div>
                <label className="block text-(--color-text-soft)">
                  Pseudo
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
                  value={pseudo}
                  onChange={(event) => setPseudo(event.target.value)}
                />
              </div>
              <div>
                <label className="block text-(--color-text-soft)">Ville</label>
                <input
                  className="mt-1 w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                />
              </div>
              <div>
                <label className="block text-(--color-text-soft)">
                  Disponibilités
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
                  placeholder="Ex : Soirs de semaine, week-end matin…"
                  value={availability}
                  onChange={(event) => setAvailability(event.target.value)}
                />
              </div>
            </div>

            {error ? (
              <p className="text-(length:--font-size-xs) text-red-400">
                {error}
              </p>
            ) : null}

            <button type="submit" className="btn btn-primary">
              {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </form>

          <aside className="space-y-(--space-3)">
            <div className="rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-3) space-y-(--space-2)">
              <h2 className="text-(length:--font-size-sm) font-semibold">
                Sports enregistrés
              </h2>
              {user.sports.length === 0 ? (
                <p className="text-(length:--font-size-xs) text-(--color-text-muted)">
                  Aucun sport renseigné pour le moment. Tu pourras les gérer
                  plus tard dans les préférences.
                </p>
              ) : (
                <ul className="space-y-1 text-(length:--font-size-xs)">
                  {user.sports.map((sport) => (
                    <li key={sport.id}>
                      {sport.name} · {sport.level}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}


