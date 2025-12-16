import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { groupsApi, type Group } from "../services/api";
import { useAuth } from "../context/AuthContext";

const LEVEL_LABELS: Record<string, string> = {
  debutant: "Debutant",
  intermediaire: "Intermediaire",
  expert: "Expert",
};

export function MyGroupsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetch = async () => {
      setIsFetching(true);
      setError(null);
      try {
        const data = await groupsApi.mine();
        setGroups(data);
      } catch (e: any) {
        setError(e.message || "Impossible de charger tes groupes.");
      } finally {
        setIsFetching(false);
      }
    };

    fetch();
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <main className="min-h-screen bg-(--color-bg) text-(--color-text-main) px-(--space-4) py-(--space-5)">
      <div className="mx-auto max-w-6xl space-y-(--space-4)">
        <header className="flex flex-col gap-(--space-1) md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-(length:--font-size-2xl) font-semibold">
              Mes groupes
            </h1>
            <p className="text-(length:--font-size-xs) text-(--color-text-muted)">
              Accede rapidement aux groupes que tu as rejoints.
            </p>
          </div>
          <div className="flex gap-(--space-2)">
            <Link to="/groups" className="btn btn-secondary btn-sm">
              Explorer les groupes
            </Link>
            <Link to="/" className="btn btn-secondary btn-sm">
              Accueil
            </Link>
          </div>
        </header>

        <section className="rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-3) space-y-(--space-3)">
          {isFetching ? (
            <p className="text-(length:--font-size-sm) text-(--color-text-muted)">
              Chargement de tes groupes...
            </p>
          ) : error ? (
            <p className="text-(length:--font-size-sm) text-red-400">{error}</p>
          ) : groups.length === 0 ? (
            <div className="space-y-(--space-2)">
              <p className="text-(length:--font-size-sm) text-(--color-text-muted)">
                Tu n&apos;as pas encore rejoint de groupe.
              </p>
              <Link to="/groups" className="btn btn-primary btn-sm w-fit">
                Trouver un groupe
              </Link>
            </div>
          ) : (
            <div className="grid gap-(--space-3) md:grid-cols-3">
              {groups.map((group) => (
                <article
                  key={group.id}
                  className="rounded-2xl border border-(--color-border-subtle) bg-(--color-surface-dark) p-(--space-2) space-y-(--space-1)"
                >
                  <header className="flex items-center justify-between">
                    <h2 className="text-(length:--font-size-sm) font-semibold">
                      {group.sport_name || `Sport #${group.sport_id}`} -{" "}
                      {LEVEL_LABELS[group.level] || group.level}
                    </h2>
                    <span className="text-(length:--font-size-xs) text-(--color-text-muted)">
                      {group.members_count || 0} membres
                    </span>
                  </header>
                  <h3 className="text-(length:--font-size-xs) text-(--color-primary-light)">
                    {group.name}
                  </h3>
                  <p className="text-(length:--font-size-xs) text-(--color-text-soft)">
                    {group.description || "Pas de description"}
                  </p>
                  <p className="text-(length:--font-size-xs) text-(--color-text-muted)">
                    Ville: {group.city}
                    {group.role ? ` - ${group.role}` : ""}
                  </p>
                  <div className="flex justify-between items-center pt-(--space-1)">
                    <Link
                      to={`/groups/${group.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      Ouvrir
                    </Link>
                    <Link
                      to={`/groups/${group.id}`}
                      className="text-(length:--font-size-xs) text-(--color-text-muted) hover:text-(--color-primary-light)"
                    >
                      Voir le detail
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
