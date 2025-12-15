import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { groupsApi, type Group } from "../services/api";
import { useAuth } from "../context/AuthContext";

const LEVEL_LABELS: Record<string, string> = {
  debutant: "Debutant",
  intermediaire: "Intermediaire",
  expert: "Expert",
};

export function GroupsPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filterCity, setFilterCity] = useState("");
  const [filterLevel, setFilterLevel] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params: { city?: string; level?: string } = {};
        if (filterCity) params.city = filterCity;
        if (filterLevel) params.level = filterLevel;
        const data = await groupsApi.search(params);
        setGroups(data);
      } catch (e: any) {
        setError(e.message || "Impossible de charger les groupes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [filterCity, filterLevel]);

  const handleJoinGroup = async (groupId: number) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      await groupsApi.join(groupId);
      navigate(`/groups/${groupId}`);
    } catch (e: any) {
      alert(e.message || "Impossible de rejoindre le groupe.");
    }
  };

  return (
    <main className="min-h-screen bg-(--color-bg) text-(--color-text-main) px-(--space-4) py-(--space-5)">
      <div className="mx-auto max-w-6xl space-y-(--space-4)">
        <header className="space-y-(--space-1)">
          <div className="flex items-center justify-between">
            <h1 className="text-(length:--font-size-2xl) font-semibold">
              Groupes sportifs
            </h1>
            <Link to="/" className="btn btn-secondary btn-sm">
              Retour
            </Link>
          </div>
          <p className="text-(length:--font-size-xs) text-(--color-text-muted)">
            Explore les groupes par sport et par niveau, puis rejoins celui qui
            correspond a ton profil (US-011 a US-014).
          </p>
        </header>

        <section className="rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-3) space-y-(--space-3)">
          <div className="flex flex-wrap gap-(--space-2)">
            <input
              type="text"
              placeholder="Filtrer par ville..."
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
            />
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
            >
              <option value="">Tous les niveaux</option>
              <option value="debutant">Debutant</option>
              <option value="intermediaire">Intermediaire</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          {isLoading ? (
            <p className="text-(length:--font-size-sm) text-(--color-text-muted)">
              Chargement des groupes...
            </p>
          ) : error ? (
            <p className="text-(length:--font-size-sm) text-red-400">{error}</p>
          ) : groups.length === 0 ? (
            <p className="text-(length:--font-size-sm) text-(--color-text-muted)">
              Aucun groupe trouve. Essaie de modifier tes filtres.
            </p>
          ) : (
            <div className="grid gap-(--space-3) md:grid-cols-3">
              {groups.map((group) => (
                <article
                  key={group.id}
                  className="rounded-2xl border border-(--color-border-subtle) bg-(--color-surface-dark) p-(--space-2) space-y-(--space-1)"
                >
                  <header className="flex items-center justify-between">
                    <h2 className="text-(length:--font-size-sm) font-semibold">
                      {group.sport_name || `Sport #${group.sport_id}`} ·{" "}
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
                  </p>
                  <div className="flex justify-between items-center pt-(--space-1)">
                    <button
                      onClick={() => handleJoinGroup(group.id)}
                      className="btn btn-primary btn-sm"
                    >
                      Rejoindre
                    </button>
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
