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
  const [filterSport, setFilterSport] = useState("");
  const [filterLevels, setFilterLevels] = useState<string[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await groupsApi.search({});
        setGroups(data);
      } catch (e: any) {
        setError(e.message || "Impossible de charger les groupes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const filteredGroups = groups.filter((group) => {
    const matchesSport = (() => {
      if (!filterSport.trim()) return true;
      const sportName = group.sport_name || "";
      return sportName.toLowerCase().includes(filterSport.toLowerCase());
    })();

    const matchesLevel =
      filterLevels.length === 0 || filterLevels.includes(group.level);

    return matchesSport && matchesLevel;
  });

  const toggleLevel = (level: string) => {
    setFilterLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

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
              placeholder="Filtrer par sport..."
              value={filterSport}
              onChange={(e) => setFilterSport(e.target.value)}
              className="rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
            />
            <div className="flex items-center gap-(--space-1)">
              {([
                ["debutant", "Debutant"],
                ["intermediaire", "Intermediaire"],
                ["expert", "Expert"],
              ] as const).map(([value, label]) => (
                <label
                  key={value}
                  className="flex items-center gap-1 rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-[6px] text-(length:--font-size-xs) cursor-pointer select-none hover:border-(--color-primary)"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-(--color-primary)"
                    checked={filterLevels.includes(value)}
                    onChange={() => toggleLevel(value)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {isLoading ? (
            <p className="text-(length:--font-size-sm) text-(--color-text-muted)">
              Chargement des groupes...
            </p>
          ) : error ? (
            <p className="text-(length:--font-size-sm) text-red-400">{error}</p>
          ) : filteredGroups.length === 0 ? (
            <p className="text-(length:--font-size-sm) text-(--color-text-muted)">
              Aucun groupe trouve. Essaie de modifier tes filtres.
            </p>
          ) : (
            <div className="grid gap-(--space-3) md:grid-cols-3">
              {filteredGroups.map((group) => (
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
