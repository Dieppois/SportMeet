import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { activitiesApi, groupsApi, type Group, type SportLevel } from "../services/api";

const LEVEL_OPTIONS: { value: SportLevel; label: string }[] = [
  { value: "debutant", label: "Debutant" },
  { value: "intermediaire", label: "Intermediaire" },
  { value: "expert", label: "Expert" },
];

export function CreateActivityPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  const [group, setGroup] = useState<Group | null>(null);
  const [title, setTitle] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [location, setLocation] = useState("");
  const [level, setLevel] = useState<SportLevel>("intermediaire");
  const [maxParticipants, setMaxParticipants] = useState<string>("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!groupId);

  useEffect(() => {
    if (groupId) {
      const fetchGroup = async () => {
        try {
          const groupData = await groupsApi.getById(Number(groupId));
          setGroup(groupData);
          setLevel(groupData.level);
        } catch (e: any) {
          setError("Impossible de charger le groupe.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchGroup();
    }
  }, [groupId]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!isAuthenticated || !user) {
      setError("Tu dois etre connecte pour creer une activite.");
      return;
    }

    if (!title.trim()) {
      setError("Le titre de l'activite est obligatoire.");
      return;
    }

    if (!startAt) {
      setError("La date de debut est obligatoire.");
      return;
    }

    if (!location.trim()) {
      setError("Le lieu est obligatoire.");
      return;
    }

    if (!group) {
      setError("Tu dois selectionner un groupe.");
      return;
    }

    setIsSubmitting(true);

    try {
      const activity = await activitiesApi.create({
        group_id: group.id,
        sport_id: group.sport_id,
        title: title.trim(),
        description: description.trim() || null,
        start_at: new Date(startAt).toISOString(),
        end_at: endAt ? new Date(endAt).toISOString() : null,
        location: location.trim(),
        level,
        max_participants: maxParticipants ? Number.parseInt(maxParticipants, 10) : null,
      });

      navigate(`/activities/${activity.id}`);
    } catch (e: any) {
      setError(e.message || "Impossible de creer l'activite.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <main className="min-h-screen bg-(--color-bg) text-(--color-text-main) px-(--space-4) py-(--space-6)">
        <div className="mx-auto max-w-4xl">
          <p className="text-(length:--font-size-sm) text-(--color-text-muted)">
            Chargement...
          </p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-(--color-bg) text-(--color-text-main) px-(--space-4) py-(--space-6)">
        <div className="mx-auto max-w-4xl rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-4)">
          <h1 className="text-(length:--font-size-2xl) font-semibold">
            Connexion requise
          </h1>
          <p className="mt-(--space-2) text-(length:--font-size-sm) text-(--color-text-muted)">
            Tu dois etre connecte pour creer une activite.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-(--space-3) btn btn-primary"
          >
            Se connecter
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-(--color-bg) text-(--color-text-main) px-(--space-4) py-(--space-6)">
      <section className="mx-auto max-w-4xl rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-4) shadow-(--shadow-primary-soft)">
        <header className="mb-(--space-3)">
          <h1 className="text-(length:--font-size-2xl) font-semibold">
            Creer une activite
          </h1>
          <p className="mt-(--space-1) text-(length:--font-size-xs) text-(--color-text-muted)">
            Cree un match ou une session d'entrainement et laisse les autres
            utilisateurs interesses te rejoindre (US-015 a US-023).
          </p>
          {group && (
            <p className="mt-(--space-1) text-(length:--font-size-sm) text-(--color-primary-light)">
              Groupe: {group.name}
            </p>
          )}
        </header>

        <form className="grid gap-(--space-3) md:grid-cols-2" onSubmit={handleSubmit}>
          <div className="space-y-(--space-1) md:col-span-2">
            <label className="block text-(length:--font-size-xs) text-(--color-text-soft)">
              Titre de l'activite *
            </label>
            <input
              className="w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
              placeholder="Match amical du jeudi soir"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>

          <div className="space-y-(--space-1)">
            <label className="block text-(length:--font-size-xs) text-(--color-text-soft)">
              Date & heure de debut *
            </label>
            <input
              type="datetime-local"
              className="w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
              value={startAt}
              onChange={(event) => setStartAt(event.target.value)}
              required
            />
          </div>

          <div className="space-y-(--space-1)">
            <label className="block text-(length:--font-size-xs) text-(--color-text-soft)">
              Date & heure de fin
            </label>
            <input
              type="datetime-local"
              className="w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
              value={endAt}
              onChange={(event) => setEndAt(event.target.value)}
            />
          </div>

          <div className="space-y-(--space-1)">
            <label className="block text-(length:--font-size-xs) text-(--color-text-soft)">
              Lieu *
            </label>
            <input
              className="w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
              placeholder="Terrain synthe, Paris 19"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              required
            />
          </div>

          <div className="space-y-(--space-1)">
            <label className="block text-(length:--font-size-xs) text-(--color-text-soft)">
              Niveau requis
            </label>
            <select
              className="w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
              value={level}
              onChange={(event) => setLevel(event.target.value as SportLevel)}
            >
              {LEVEL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-(--space-1)">
            <label className="block text-(length:--font-size-xs) text-(--color-text-soft)">
              Nombre de places max
            </label>
            <input
              type="number"
              min="2"
              className="w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
              placeholder="Ex : 10"
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
              placeholder="Donne quelques details sur le niveau attendu, l'ambiance, le materiel necessaire..."
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
              onClick={() => navigate(groupId ? `/groups/${groupId}` : "/groups")}
            >
              Annuler
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || !group}
            >
              {isSubmitting ? "Creation..." : "Creer l'activite"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
