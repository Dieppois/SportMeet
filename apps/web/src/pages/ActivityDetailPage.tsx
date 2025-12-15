import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import {
  addMessageToActivity,
  getActivityById,
  joinActivity,
  type Activity,
} from "../services/localActivityService";

export function ActivityDetailPage() {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activity, setActivity] = useState<Activity | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!activityId) return;
    const current = getActivityById(activityId);
    if (!current) {
      return;
    }
    setActivity(current);

    const interval = window.setInterval(() => {
      const latest = getActivityById(activityId);
      if (latest) {
        setActivity(latest);
      }
    }, 2000);

    return () => window.clearInterval(interval);
  }, [activityId]);

  if (!activityId) {
    return null;
  }

  if (!activity) {
    return (
      <main className="min-h-screen bg-(--color-bg) text-(--color-text-main) flex items-center justify-center px-(--space-4)">
        <div className="rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-4) text-center space-y-(--space-2)">
          <p className="text-(length:--font-size-sm)">
            Activité introuvable ou déjà supprimée.
          </p>
          <Link to="/" className="btn btn-primary">
            Retour à l&apos;accueil
          </Link>
        </div>
      </main>
    );
  }

  const isParticipant = user ? activity.participantIds.includes(user.id) : false;

  const handleJoin = () => {
    const result = joinActivity(activity.id, user ?? null);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    setActivity(result.activity);
  };

  const handleSendMessage = (event: FormEvent) => {
    event.preventDefault();
    const result = addMessageToActivity(activity.id, user ?? null, message);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    setMessage("");
    setActivity(result.activity);
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-(--color-bg) text-(--color-text-main) px-(--space-4) py-(--space-5)">
      <div className="mx-auto flex max-w-5xl flex-col gap-(--space-4)">
        <header className="flex flex-col gap-(--space-1) md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-(length:--font-size-2xl) font-semibold">
              {activity.title}
            </h1>
            <p className="text-(length:--font-size-xs) text-(--color-text-muted)">
              {activity.dateTime ?? "Date à préciser"} ·{" "}
              {activity.location ?? "Lieu à préciser"}
            </p>
          </div>
          <div className="flex gap-(--space-2)">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleBack}
            >
              Retour à l&apos;accueil
            </button>
            {!isParticipant ? (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleJoin}
              >
                Rejoindre l&apos;activité
              </button>
            ) : null}
          </div>
        </header>

        <section className="grid gap-(--space-3) md:grid-cols-[1.5fr,1.2fr]">
          {/* Chat */}
          <div className="flex h-[380px] flex-col rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-3)">
            <h2 className="mb-(--space-2) text-(length:--font-size-sm) font-semibold">
              Chat de l&apos;activité
            </h2>
            <div className="flex-1 space-y-2 overflow-y-auto rounded-2xl bg-(--color-bg-light) p-(--space-2) text-(length:--font-size-xs)">
              {activity.messages.length === 0 ? (
                <p className="text-(--color-text-muted)">
                  Aucun message pour le moment. Laisse un mot pour organiser
                  l&apos;activité.
                </p>
              ) : (
                activity.messages.map((msg) => {
                  const isMine = user && msg.userId === user.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${
                        isMine ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-(--space-2) py-(--space-1) ${
                          isMine
                            ? "bg-(--color-primary) text-(--color-bg) rounded-br-sm"
                            : "bg-(--gray-800) text-(--color-text-main) rounded-bl-sm"
                        }`}
                      >
                        <p>{msg.content}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <form
              className="mt-(--space-2) flex gap-(--space-2)"
              onSubmit={handleSendMessage}
            >
              <input
                className="flex-1 rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
                placeholder={
                  isParticipant
                    ? "Écrire un message..."
                    : "Rejoins l'activité pour participer au chat"
                }
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                disabled={!isParticipant}
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={!isParticipant}
              >
                Envoyer
              </button>
            </form>

            {error ? (
              <p className="mt-(--space-1) text-(length:--font-size-xs) text-red-400">
                {error}
              </p>
            ) : null}
          </div>

          {/* Infos / participants */}
          <aside className="space-y-(--space-3)">
            <div className="rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-3) space-y-(--space-1)">
              <h2 className="text-(length:--font-size-sm) font-semibold">
                Détails
              </h2>
              <p className="text-(length:--font-size-xs) text-(--color-text-soft)">
                {activity.description ??
                  "Aucune description détaillée pour le moment."}
              </p>
              <p className="text-(length:--font-size-xs) text-(--color-text-muted)">
                Places :
                {" "}
                {activity.maxParticipants
                  ? `${activity.participantIds.length} / ${activity.maxParticipants}`
                  : `${activity.participantIds.length} participants`}
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}


