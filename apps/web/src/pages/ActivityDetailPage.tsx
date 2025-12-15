import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import {
  activitiesApi,
  type Activity,
  type ActivityParticipant,
} from "../services/api";

const LEVEL_LABELS: Record<string, string> = {
  debutant: "Debutant",
  intermediaire: "Intermediaire",
  expert: "Expert",
};

export function ActivityDetailPage() {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [activity, setActivity] = useState<Activity | null>(null);
  const [participants, setParticipants] = useState<ActivityParticipant[]>([]);
  const [remainingSpots, setRemainingSpots] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivityData = async () => {
    if (!activityId) return;
    try {
      const activityData = await activitiesApi.getById(Number(activityId));
      setActivity(activityData);

      const spotsData = await activitiesApi.getRemainingSpots(Number(activityId));
      setRemainingSpots(spotsData.remaining);

      if (isAuthenticated) {
        try {
          const participantsData = await activitiesApi.getParticipants(Number(activityId));
          setParticipants(participantsData);
        } catch {
          // User might not have access
        }
      }
    } catch (e: any) {
      setError(e.message || "Impossible de charger l'activite.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityData();
  }, [activityId, isAuthenticated]);

  const isParticipant = participants.some((p) => p.id === user?.id);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      await activitiesApi.enroll(Number(activityId));
      await fetchActivityData();
      alert("Tu es inscrit a l'activite !");
    } catch (e: any) {
      alert(e.message || "Impossible de s'inscrire.");
    }
  };

  const handleUnenroll = async () => {
    if (!isAuthenticated) return;
    try {
      await activitiesApi.unenroll(Number(activityId));
      await fetchActivityData();
      alert("Tu t'es desinscrit de l'activite.");
    } catch (e: any) {
      alert(e.message || "Impossible de se desinscrire.");
    }
  };

  const handleCancel = async () => {
    if (!isAuthenticated) return;
    if (!confirm("Es-tu sur de vouloir annuler cette activite ?")) return;
    try {
      await activitiesApi.cancel(Number(activityId));
      await fetchActivityData();
      alert("L'activite a ete annulee.");
    } catch (e: any) {
      alert(e.message || "Impossible d'annuler l'activite.");
    }
  };

  const handleDelete = async () => {
    if (!isAuthenticated) return;
    if (!confirm("Es-tu sur de vouloir supprimer cette activite ?")) return;
    try {
      await activitiesApi.delete(Number(activityId));
      navigate("/groups");
    } catch (e: any) {
      alert(e.message || "Impossible de supprimer l'activite.");
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-(--color-bg) text-(--color-text-main) flex items-center justify-center px-(--space-4)">
        <p className="text-(length:--font-size-sm) text-(--color-text-muted)">
          Chargement...
        </p>
      </main>
    );
  }

  if (error || !activity) {
    return (
      <main className="min-h-screen bg-(--color-bg) text-(--color-text-main) flex items-center justify-center px-(--space-4)">
        <div className="rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-4) text-center space-y-(--space-2)">
          <p className="text-(length:--font-size-sm)">
            {error || "Activite introuvable ou deja supprimee."}
          </p>
          <Link to="/groups" className="btn btn-primary">
            Retour aux groupes
          </Link>
        </div>
      </main>
    );
  }

  const isOrganizer = activity.created_by === user?.id;

  return (
    <main className="min-h-screen bg-(--color-bg) text-(--color-text-main) px-(--space-4) py-(--space-5)">
      <div className="mx-auto flex max-w-5xl flex-col gap-(--space-4)">
        <header className="flex flex-col gap-(--space-1) md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-(length:--font-size-xs) text-(--color-text-muted)">
              {activity.group_name || `Groupe #${activity.group_id}`} ·{" "}
              {activity.sport_name || `Sport #${activity.sport_id}`}
            </p>
            <h1 className="text-(length:--font-size-2xl) font-semibold">
              {activity.title}
            </h1>
            <p className="text-(length:--font-size-sm) text-(--color-text-soft)">
              {new Date(activity.start_at).toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
              {activity.end_at && (
                <>
                  {" - "}
                  {new Date(activity.end_at).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </>
              )}
            </p>
            {activity.status === "cancelled" && (
              <p className="text-(length:--font-size-sm) text-red-400 font-semibold">
                Cette activite a ete annulee
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-(--space-2)">
            <Link
              to={`/groups/${activity.group_id}`}
              className="btn btn-secondary btn-sm"
            >
              Voir le groupe
            </Link>
            {activity.status === "published" && !isParticipant && (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleEnroll}
              >
                S'inscrire
              </button>
            )}
            {activity.status === "published" && isParticipant && !isOrganizer && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleUnenroll}
              >
                Se desinscrire
              </button>
            )}
          </div>
        </header>

        <section className="grid gap-(--space-3) md:grid-cols-[2fr,1fr]">
          <div className="space-y-(--space-3)">
            <div className="rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-3) space-y-(--space-2)">
              <h2 className="text-(length:--font-size-sm) font-semibold">
                Details
              </h2>
              <p className="text-(length:--font-size-xs) text-(--color-text-soft)">
                {activity.description || "Aucune description detaillee pour le moment."}
              </p>
              <div className="grid grid-cols-2 gap-(--space-2) text-(length:--font-size-xs)">
                <div>
                  <span className="text-(--color-text-muted)">Lieu:</span>
                  <p>{activity.location}</p>
                </div>
                <div>
                  <span className="text-(--color-text-muted)">Niveau:</span>
                  <p>{LEVEL_LABELS[activity.level] || activity.level}</p>
                </div>
                <div>
                  <span className="text-(--color-text-muted)">Participants:</span>
                  <p>
                    {activity.registered_count || 0}
                    {activity.max_participants && ` / ${activity.max_participants}`}
                  </p>
                </div>
                <div>
                  <span className="text-(--color-text-muted)">Places restantes:</span>
                  <p>{remainingSpots !== null ? remainingSpots : "Illimite"}</p>
                </div>
              </div>
            </div>

            {isOrganizer && activity.status === "published" && (
              <div className="rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-3) space-y-(--space-2)">
                <h2 className="text-(length:--font-size-sm) font-semibold">
                  Actions organisateur
                </h2>
                <div className="flex flex-wrap gap-(--space-2)">
                  <button
                    onClick={handleCancel}
                    className="btn btn-secondary btn-sm"
                  >
                    Annuler l'activite
                  </button>
                  <button
                    onClick={handleDelete}
                    className="btn btn-secondary btn-sm text-red-400"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-(--space-3)">
            <div className="rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-3) space-y-(--space-2)">
              <h2 className="text-(length:--font-size-sm) font-semibold">
                Participants ({participants.length})
              </h2>
              {participants.length === 0 ? (
                <p className="text-(length:--font-size-xs) text-(--color-text-muted)">
                  {isAuthenticated
                    ? "Aucun participant pour le moment."
                    : "Connecte-toi pour voir les participants."}
                </p>
              ) : (
                <ul className="space-y-1 text-(length:--font-size-xs)">
                  {participants.map((participant) => (
                    <li key={participant.id} className="flex items-center gap-(--space-1)">
                      <span className="h-6 w-6 rounded-full bg-(--gray-800) text-center text-(length:--font-size-xs) leading-6">
                        {participant.pseudo.charAt(0).toUpperCase()}
                      </span>
                      <span>{participant.pseudo}</span>
                      {participant.id === activity.created_by && (
                        <span className="text-(--color-primary-light)">(Organisateur)</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-3) space-y-(--space-2)">
              <h2 className="text-(length:--font-size-sm) font-semibold">
                Informations
              </h2>
              <ul className="text-(length:--font-size-xs) text-(--color-text-muted) space-y-1">
                <li>
                  <strong>Statut:</strong>{" "}
                  {activity.status === "published" ? "Active" : activity.status}
                </li>
                <li>
                  <strong>Cree le:</strong>{" "}
                  {new Date(activity.created_at).toLocaleDateString("fr-FR")}
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
