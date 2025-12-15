import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { createActivity } from "../services/localActivityService";

export function CreateActivityPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState("");
  const [maxParticipants, setMaxParticipants] = useState<string>("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!user) {
      setError("Tu dois être connecté pour créer une activité.");
      return;
    }

    if (!title.trim()) {
      setError("Le titre de l'activité est obligatoire.");
      return;
    }

    setIsSubmitting(true);

    const result = createActivity(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        dateTime: dateTime.trim() || undefined,
        location: location.trim() || undefined,
        maxParticipants: maxParticipants
          ? Number.parseInt(maxParticipants, 10)
          : undefined,
      },
      user,
    );

    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    navigate(`/activities/${result.activity.id}`);
  };

  return (
    <main className="min-h-screen bg-(--color-bg) text-(--color-text-main) px-(--space-4) py-(--space-6)">
      <section className="mx-auto max-w-4xl rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-4) shadow-(--shadow-primary-soft)">
        <header className="mb-(--space-3)">
          <h1 className="text-(length:--font-size-2xl) font-semibold">
            Créer une activité
          </h1>
          <p className="mt-(--space-1) text-(length:--font-size-xs) text-(--color-text-muted)">
            Crée un match ou une session d&apos;entraînement et laisse les autres
            utilisateurs intéressés te rejoindre.
          </p>
        </header>

        <form className="grid gap-(--space-3) md:grid-cols-2" onSubmit={handleSubmit}>
          <div className="space-y-(--space-1) md:col-span-2">
            <label className="block text-(length:--font-size-xs) text-(--color-text-soft)">
              Titre de l&apos;activité
            </label>
            <input
              className="w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
              placeholder="Match amical du jeudi soir"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="space-y-(--space-1)">
            <label className="block text-(length:--font-size-xs) text-(--color-text-soft)">
              Date & heure
            </label>
            <input
              className="w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
              placeholder="Jeudi · 20h00"
              value={dateTime}
              onChange={(event) => setDateTime(event.target.value)}
            />
          </div>

          <div className="space-y-(--space-1)">
            <label className="block text-(length:--font-size-xs) text-(--color-text-soft)">
              Lieu
            </label>
            <input
              className="w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
              placeholder="Terrain synthé, Paris 19"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
          </div>

          <div className="space-y-(--space-1)">
            <label className="block text-(length:--font-size-xs) text-(--color-text-soft)">
              Nombre de places
            </label>
            <input
              className="w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
              placeholder="Ex : 10 joueurs"
              value={maxParticipants}
              onChange={(event) => setMaxParticipants(event.target.value)}
            />
          </div>

          <div className="space-y-(--space-1) md:col-span-2">
            <label className="block text-(length:--font-size-xs) text-(--color-text-soft)">
              Description
            </label>
            <textarea
              className="min-h-[120px] w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
              placeholder="Donne quelques détails sur le niveau attendu, l'ambiance, le matériel nécessaire..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          {error ? (
            <p className="md:col-span-2 text-(length:--font-size-xs) text-red-400">
              {error}
            </p>
          ) : null}

          <div className="md:col-span-2 flex justify-end gap-(--space-2)">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => navigate("/")}
            >
              Annuler
            </button>

            <button type="submit" className="button-primary px-(--space-4) text-(length:--font-size-sm)">

              {isSubmitting ? "Création..." : "Créer l'activité"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}


