import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import { groupsApi, activitiesApi, type Group, type Activity, type GroupMember } from "../services/api";
import { useAuth } from "../context/AuthContext";

const LEVEL_LABELS: Record<string, string> = {
  debutant: "Debutant",
  intermediaire: "Intermediaire",
  expert: "Expert",
};

export function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [group, setGroup] = useState<Group | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroupData = async () => {
      if (!groupId) return;
      setIsLoading(true);
      setError(null);
      try {
        const groupData = await groupsApi.getById(Number(groupId));
        setGroup(groupData);

        const activitiesData = await activitiesApi.listByGroup(Number(groupId));
        setActivities(activitiesData);

        if (isAuthenticated) {
          try {
            const membersData = await groupsApi.getMembers(Number(groupId));
            setMembers(membersData);
          } catch {
            // User might not be a member, ignore error
          }
        }
      } catch (e: any) {
        setError(e.message || "Impossible de charger le groupe.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupData();
  }, [groupId, isAuthenticated]);

  const handleJoinGroup = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      await groupsApi.join(Number(groupId));
      alert("Tu as rejoint le groupe !");
      // Refresh members
      const membersData = await groupsApi.getMembers(Number(groupId));
      setMembers(membersData);
    } catch (e: any) {
      alert(e.message || "Impossible de rejoindre le groupe.");
    }
  };

  const handleLeaveGroup = async () => {
    if (!isAuthenticated) return;
    try {
      await groupsApi.leave(Number(groupId));
      alert("Tu as quitte le groupe.");
      setMembers([]);
    } catch (e: any) {
      alert(e.message || "Impossible de quitter le groupe.");
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-(--color-bg) text-(--color-text-main) px-(--space-4) py-(--space-5)">
        <div className="mx-auto max-w-3xl">
          <p className="text-(length:--font-size-sm) text-(--color-text-muted)">
            Chargement...
          </p>
        </div>
      </main>
    );
  }

  if (error || !group) {
    return (
      <main className="min-h-screen bg-(--color-bg) text-(--color-text-main) px-(--space-4) py-(--space-5)">
        <div className="mx-auto max-w-3xl space-y-(--space-3)">
          <h1 className="text-(length:--font-size-2xl) font-semibold">
            Groupe introuvable
          </h1>
          <p className="text-(length:--font-size-sm) text-(--color-text-muted)">
            {error || "Le groupe que tu recherches n'existe pas ou n'est plus disponible."}
          </p>
          <Link to="/groups" className="btn btn-primary">
            Retour aux groupes
          </Link>
        </div>
      </main>
    );
  }

  const isMember = members.some((m) => m.id === user?.id);

  return (
    <main className="min-h-screen bg-(--color-bg) text-(--color-text-main) px-(--space-4) py-(--space-5)">
      <div className="mx-auto max-w-4xl space-y-(--space-4)">
        <header className="space-y-(--space-1)">
          <div className="flex items-center justify-between">
            <p className="text-(length:--font-size-xs) text-(--color-text-muted)">
              Groupe · {group.sport_name || `Sport #${group.sport_id}`}
            </p>
            <Link to="/groups" className="btn btn-secondary btn-sm">
              Retour aux groupes
            </Link>
          </div>
          <h1 className="text-(length:--font-size-2xl) font-semibold">
            {group.name}
          </h1>
          <p className="text-(length:--font-size-sm) text-(--color-text-soft)">
            {group.description || "Pas de description"}
          </p>
          <p className="text-(length:--font-size-xs) text-(--color-text-muted)">
            {group.city} · {LEVEL_LABELS[group.level] || group.level} · {group.members_count || 0} membres
          </p>
          <div className="mt-(--space-2) flex gap-(--space-2)">
            {isMember ? (
              <>
                <Link
                  to={`/groups/${groupId}/activities/new`}
                  className="btn btn-primary btn-sm"
                >
                  Creer une activite
                </Link>
                <button onClick={handleLeaveGroup} className="btn btn-secondary btn-sm">
                  Quitter le groupe
                </button>
              </>
            ) : (
              <button onClick={handleJoinGroup} className="btn btn-primary btn-sm">
                Rejoindre le groupe
              </button>
            )}
          </div>
        </header>

        <section className="grid gap-(--space-4) md:grid-cols-[2fr,1fr]">
          <div className="space-y-(--space-3)">
            <h2 className="text-(length:--font-size-lg) font-semibold">
              Activites en cours
            </h2>
            {activities.length === 0 ? (
              <div className="rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-3)">
                <p className="text-(length:--font-size-sm) text-(--color-text-soft)">
                  Aucune activite en cours pour le moment. Sois le premier a en
                  creer une depuis ce groupe !
                </p>
              </div>
            ) : (
              <div className="space-y-(--space-2)">
                {activities.map((activity) => (
                  <article
                    key={activity.id}
                    className="rounded-2xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-2) space-y-(--space-1)"
                  >
                    <h3 className="text-(length:--font-size-sm) font-semibold">
                      {activity.title}
                    </h3>
                    <p className="text-(length:--font-size-xs) text-(--color-text-muted)">
                      {new Date(activity.start_at).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-(length:--font-size-xs) text-(--color-text-soft)">
                      {activity.location} · {activity.registered_count || 0}
                      {activity.max_participants ? `/${activity.max_participants}` : ""} participants
                    </p>
                    <Link
                      to={`/activities/${activity.id}`}
                      className="inline-block text-(length:--font-size-xs) text-(--color-primary-light)"
                    >
                      Voir les details
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-(--space-3)">
            <div className="rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-3) space-y-(--space-2)">
              <h2 className="text-(length:--font-size-sm) font-semibold">
                Membres ({members.length})
              </h2>
              {members.length === 0 ? (
                <p className="text-(length:--font-size-xs) text-(--color-text-muted)">
                  {isAuthenticated ? "Rejoins le groupe pour voir les membres." : "Connecte-toi pour voir les membres."}
                </p>
              ) : (
                <ul className="space-y-1 text-(length:--font-size-xs)">
                  {members.slice(0, 10).map((member) => (
                    <li key={member.id} className="flex items-center gap-(--space-1)">
                      <span className="h-6 w-6 rounded-full bg-(--gray-800) text-center text-(length:--font-size-xs) leading-6">
                        {member.pseudo.charAt(0).toUpperCase()}
                      </span>
                      <span>{member.pseudo}</span>
                      {member.role === "owner" && (
                        <span className="text-(--color-primary-light)">(Admin)</span>
                      )}
                    </li>
                  ))}
                  {members.length > 10 && (
                    <li className="text-(--color-text-muted)">
                      +{members.length - 10} autres membres
                    </li>
                  )}
                </ul>
              )}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
