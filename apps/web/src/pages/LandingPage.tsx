import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { groupsApi, type Group } from "../services/api";

const LEVEL_LABELS: Record<string, string> = {
  debutant: "Debutant",
  intermediaire: "Intermediaire",
  expert: "Expert",
};

export function LandingPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sportFilter, setSportFilter] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoadingGroups(true);
      groupsApi
        .search({})
        .then(setGroups)
        .catch(() => setGroups([]))
        .finally(() => setIsLoadingGroups(false));
    }
  }, [isAuthenticated]);

  const filteredGroups = groups.filter((group) => {
    if (!sportFilter.trim()) return true;
    const sportName = group.sport_name || "";
    return sportName.toLowerCase().includes(sportFilter.toLowerCase());
  });

  const visibleGroups = filteredGroups.slice(0, visibleCount);
  const canShowMore = visibleCount < filteredGroups.length;

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
    <main className="min-h-screen bg-(--color-bg) text-(--color-text-main)">
      <header className="border-b border-(--color-border-subtle) bg-(--color-bg)">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-(--space-2)">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-(--color-primary) shadow-(--shadow-primary-soft)">
              <span className="text-lg font-semibold text-(--color-bg)">
                SM
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">Sport Matcher</p>
              <p className="text-xs text-(--color-text-muted)">
                Trouve des partenaires de jeu en quelques clics
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <Link to="/groups" className="btn btn-ghost">
              Groupes
            </Link>
            <Link to="/users" className="btn btn-ghost">
              Joueurs
            </Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="rounded-full border border-(--color-border-subtle) px-4 py-1.5 text-sm font-medium text-(--color-text-soft) hover:border-(--color-border-strong)"
                >
                  {user?.pseudo ?? "Mon compte"}
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-full border border-(--color-border-subtle) px-4 py-1.5 text-sm font-medium text-(--color-text-main) shadow-sm hover:border-(--color-border-strong) hover:bg-(--color-surface-light)"
                >
                  Deconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full border border-(--color-border-subtle) px-4 py-1.5 text-sm font-medium text-(--color-text-main) shadow-sm hover:border-(--color-border-strong) hover:bg-(--color-surface-light)"
                >
                  Connexion
                </Link>
                <Link to="/signup" className="button-primary px-6 py-2 text-sm">
                  Creer un compte
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero + preview */}
      <section className="mx-auto max-w-6xl px-(--space-4) pb-(--space-8) pt-(--space-5) sm:px-(--space-6) lg:px-(--space-8) lg:pb-(--space-10) lg:pt-(--space-6)">
        <div className="flex flex-col items-stretch gap-(--space-6) lg:flex-row lg:items-center lg:gap-(--space-8)">
          {/* Texte a gauche */}
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <h1 className="text-balance font-semibold tracking-tight text-(--color-text-main) text-3xl sm:text-4xl lg:text-5xl">
                <span>
                  Ne joue plus jamais{" "}
                  <span className="text-(--color-primary-light)">
                    en solo
                  </span>
                </span>
              </h1>
              <p className="max-w-xl text-balance text-(--color-text-soft) sm:text-(--font-size-base)">
                Sport Matcher te connecte instantanement avec des joueurs
                compatibles autour de toi selon le sport, le niveau, la
                disponibilite et meme ton style de jeu.
              </p>
              <Link to="/groups" className="btn btn-primary inline-block">
                Decouvrir les groupes
              </Link>
            </div>
          </div>

          {/* Image a droite */}
          <div className="flex-1">
            <img
              src="/hero_img.jpg"
              alt="Hero image"
              className="w-full h-full max-h-[420px] rounded-3xl object-cover shadow-(--shadow-soft)"
            />
          </div>
        </div>
      </section>

      {/* Features / sections to inspire your wireframes */}
      <section className="mx-auto max-w-6xl space-y-(--space-6) px-(--space-4) pb-(--space-10) sm:px-(--space-6) lg:px-(--space-8) lg:pb-[calc(var(--space-10)+var(--space-2))]">
        {/* 3 key pillars */}
        <div className="grid gap-(--space-3) md:grid-cols-3">
          <div className="group rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-3) shadow-sm hover:border-(--color-primary) hover:shadow-(--shadow-primary-soft)">
            <p className="mb-(--space-1) text-(--font-size-xs) font-semibold uppercase tracking-[0.18em]">
              Decouverte
            </p>
            <h2 className="mb-(--space-1) font-semibold text-(--color-text-main)">
              Trouve des partenaires en quelques secondes
            </h2>
            <p className="text-(--color-text-muted)">
              Flow de filtres simple (sport, niveau, creneaux, localisation)
              pour afficher des cards de matchs ultra lisibles avec photo,
              distance et taux de compatibilite.
            </p>
          </div>

          <div className="group rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-3) shadow-sm hover:border-(--color-accent) hover:shadow-(--shadow-accent)">
            <p className="mb-(--space-1) text-(--font-size-xs) font-semibold uppercase tracking-[0.18em]">
              Matching
            </p>
            <h2 className="mb-(--space-1) font-semibold text-(--color-text-main)">
              Algorithme par affinites sportives
            </h2>
            <p className="text-(--color-text-muted)">
              Ecrans dedies pour parametrer ton profil joueur : sports favoris,
              intensite, objectifs (perf, fun, competition) et rythme de jeu,
              afin d'affiner les suggestions.
            </p>
          </div>

          <div className="group rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-3) shadow-sm hover:border-(--gray-500)">
            <p className="mb-2 font-semibold uppercase tracking-[0.18em]">
              Conversation
            </p>
            <h2 className="mb-(--space-1) font-semibold text-(--color-text-main)">
              Chat clair et oriente organisation
            </h2>
            <p className="text-(--color-text-muted)">
              Interface de chat inspiree des messageries modernes avec
              recapitulatif du match, boutons rapides (confirmer, decaler,
              annuler) et acces direct au lieu.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-(--space-4) pb-(--space-8) sm:px-(--space-6) lg:px-(--space-8)">
        <div className="mb-(--space-3) flex items-center justify-between">
          <div>
            <h2 className="text-(--font-size-lg) font-semibold">
              Groupes disponibles
            </h2>
            <p className="text-(--color-text-muted)">
              Decouvre des groupes par sport et par niveau pour trouver rapidement
              des partenaires de jeu.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className="rounded-full border border-(--color-border-subtle) px-3 py-1 text-(--font-size-xs) text-(--color-text-soft) hover:border-(--color-border-strong)"
          >
            Filtres
          </button>
        </div>

        {!isAuthenticated ? (
          <div className="rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-4) text-center">
            <p className="text-(--color-text-muted) mb-(--space-2)">
              Connecte-toi ou cree un compte pour decouvrir les groupes proposes.
            </p>
            <div className="flex justify-center gap-(--space-2)">
              <Link to="/login" className="btn btn-secondary btn-sm">
                Connexion
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Creer un compte
              </Link>
            </div>
          </div>
        ) : isLoadingGroups ? (
          <p className="text-(--color-text-muted)">Chargement des groupes...</p>
        ) : (
          <>
            {showFilters ? (
              <div className="mb-(--space-3)">
                <label className="mb-1 block text-(--font-size-xs) text-(--color-text-soft)">
                  Filtrer par sport
                </label>
                <input
                  value={sportFilter}
                  onChange={(event) => setSportFilter(event.target.value)}
                  className="w-full max-w-xs rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(--font-size-sm) outline-none focus:border-(--color-primary)"
                  placeholder="Ex : Handball, Football, Tennis..."
                />
              </div>
            ) : null}

            {visibleGroups.length === 0 ? (
              <p className="text-(--color-text-muted)">
                Aucun groupe ne correspond a ce filtre pour le moment.
              </p>
            ) : (
              <>
                <div className="grid gap-(--space-3) md:grid-cols-3">
                  {visibleGroups.map((group) => (
                    <article
                      key={group.id}
                      className="rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-3) space-y-(--space-1)"
                    >
                      <h3 className="text-(--font-size-sm) font-semibold">
                        {group.sport_name || `Sport #${group.sport_id}`} ·{" "}
                        {LEVEL_LABELS[group.level] || group.level}
                      </h3>
                      <p className="text-(--color-text-muted)">
                        {group.city} · {group.members_count || 0} membres
                      </p>
                      <p className="text-(--color-text-soft)">
                        {group.description || "Pas de description"}
                      </p>
                      <div className="mt-(--space-2) flex justify-between gap-(--space-2)">
                        <button
                          onClick={() => handleJoinGroup(group.id)}
                          className="btn btn-primary btn-sm"
                        >
                          Rejoindre
                        </button>
                        <Link
                          to={`/groups/${group.id}`}
                          className="btn btn-secondary btn-sm"
                        >
                          Voir le detail
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                {canShowMore ? (
                  <div className="mt-(--space-3) flex justify-center">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((current) => current + 6)}
                      className="rounded-full border border-(--color-border-subtle) px-5 py-2 text-(--font-size-sm) text-(--color-text-soft) hover:border-(--color-border-strong)"
                    >
                      Afficher plus
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </>
        )}
      </section>
    </main>
  );
}
