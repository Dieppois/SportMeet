import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth, useUpdateProfile } from "../context/AuthContext";

export function ProfilePage() {
  const { user, logout, isLoading } = useAuth();
  const updateProfile = useUpdateProfile();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");
  const [city, setCity] = useState(user?.city ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-(--color-bg) text-(--color-text-main) flex items-center justify-center px-(--space-4)">
        <div className="rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-4) text-center">
          <p className="text-(length:--font-size-sm)">Chargement...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-(--color-bg) text-(--color-text-main) flex items-center justify-center px-(--space-4)">
        <div className="rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-4) text-center space-y-(--space-2)">
          <p className="text-(length:--font-size-sm)">
            Tu dois etre connecte pour acceder a ton profil.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("/login")}
          >
            Aller a la connexion
          </button>
        </div>
      </main>
    );
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    const result = await updateProfile({
      first_name: firstName || null,
      last_name: lastName || null,
      city: city || null,
      bio: bio || null,
    });

    setIsSaving(false);

    if (!result.ok) {
      setError(result.error ?? "Erreur lors de la mise a jour du profil.");
    } else {
      setSuccess("Profil mis a jour avec succes !");
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
              Gere tes informations personnelles (US-001 a US-006).
            </p>
          </div>
          <div className="flex gap-(--space-2)">
            <Link to="/" className="btn btn-secondary btn-sm">
              Retour a l&apos;accueil
            </Link>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleLogout}
            >
              Se deconnecter
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
              <div className="grid gap-(--space-2) md:grid-cols-2">
                <div>
                  <label className="block text-(--color-text-soft)">
                    Prenom
                  </label>
                  <input
                    className="mt-1 w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    placeholder="Ton prenom"
                  />
                </div>
                <div>
                  <label className="block text-(--color-text-soft)">Nom</label>
                  <input
                    className="mt-1 w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    placeholder="Ton nom"
                  />
                </div>
              </div>
              <div>
                <label className="block text-(--color-text-soft)">Ville</label>
                <input
                  className="mt-1 w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  placeholder="Ta ville"
                />
              </div>
              <div>
                <label className="block text-(--color-text-soft)">Bio</label>
                <textarea
                  className="mt-1 w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary) min-h-[80px]"
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  placeholder="Parle-nous de toi..."
                />
              </div>
            </div>

            {error ? (
              <p className="text-(length:--font-size-xs) text-red-400">
                {error}
              </p>
            ) : null}

            {success ? (
              <p className="text-(length:--font-size-xs) text-green-400">
                {success}
              </p>
            ) : null}

            <button type="submit" className="btn btn-primary">
              {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </form>

          <aside className="space-y-(--space-3)">
            <div className="rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-3) space-y-(--space-2)">
              <h2 className="text-(length:--font-size-sm) font-semibold">
                Informations du compte
              </h2>
              <ul className="space-y-1 text-(length:--font-size-xs) text-(--color-text-muted)">
                <li>
                  <strong>ID:</strong> {user.id}
                </li>
                <li>
                  <strong>Pseudo:</strong> {user.pseudo}
                </li>
                <li>
                  <strong>Visibilite:</strong> {user.profile_visibility || "public"}
                </li>
                {user.created_at && (
                  <li>
                    <strong>Membre depuis:</strong>{" "}
                    {new Date(user.created_at).toLocaleDateString("fr-FR")}
                  </li>
                )}
              </ul>
            </div>

            <div className="rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-3) space-y-(--space-2)">
              <h2 className="text-(length:--font-size-sm) font-semibold">
                Actions rapides
              </h2>
              <div className="space-y-2">
                <Link
                  to="/my-groups"
                  className="btn btn-secondary btn-sm w-full text-center"
                >
                  Voir mes groupes
                </Link>
                <Link
                  to="/users"
                  className="btn btn-secondary btn-sm w-full text-center"
                >
                  Rechercher des joueurs
                </Link>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
