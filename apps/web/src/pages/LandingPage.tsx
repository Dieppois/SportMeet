import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getAllGroups } from "../services/localGroupService";

const ALL_GROUPS = getAllGroups();

export function LandingPage() {
  const { user, isAuthenticated, logout } = useAuth();

  const [showFilters, setShowFilters] = useState(false);
  const [sportFilter, setSportFilter] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredGroups = ALL_GROUPS.filter((group) => {
    if (!sportFilter.trim()) return true;
    return group.sport.toLowerCase().includes(sportFilter.toLowerCase());
  });

  const visibleGroups = filteredGroups.slice(0, visibleCount);
  const canShowMore = visibleCount < filteredGroups.length;

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

          <nav className="hidden items-center gap-8 text-sm text-(--color-text-soft) md:flex">
            <button type="button" className="hover:text-(--color-text-main)">
              Fonctionnalités
            </button>
            <button type="button" className="hover:text-(--color-text-main)">
              Comment ça marche
            </button>
            <button type="button" className="hover:text-(--color-text-main)">
              Tarifs
            </button>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <>
                <span className="rounded-full border border-(--color-border-subtle) px-4 py-1.5 text-sm font-medium text-(--color-text-soft)">
                  {user?.pseudo ?? "Mon compte"}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-full border border-(--color-border-subtle) px-4 py-1.5 text-sm font-medium text-(--color-text-main) shadow-sm hover:border-(--color-border-strong) hover:bg-(--color-surface-light)"
                >
                  Déconnexion
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
                  Créer un compte
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero + preview */}
      <section className="mx-auto max-w-6xl px-(--space-4) pb-(--space-8) pt-(--space-5) sm:px-(--space-6) lg:px-(--space-8) lg:pb-(--space-10) lg:pt-(--space-6)">
        <div className="flex flex-col items-stretch gap-(--space-6) lg:flex-row lg:items-center lg:gap-(--space-8)">
          {/* Texte à gauche */}
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
                Sport Matcher te connecte instantanément avec des joueurs
                compatibles autour de toi selon le sport, le niveau, la
                disponibilité et même ton style de jeu. Idéal pour imaginer un
                parcours fluide entre découverte, matching et chat en temps réel.
              </p>
              <button className="button-primary">Je cherche un match</button>
            </div>
          </div>

          {/* Image à droite */}
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
              Découverte
            </p>
            <h2 className="mb-(--space-1) font-semibold text-(--color-text-main)">
              Trouve des partenaires en quelques secondes
            </h2>
            <p className="text-(--color-text-muted)">
              Flow de filtres simple (sport, niveau, créneaux, localisation)
              pour afficher des cards de matchs ultra lisibles avec photo,
              distance et taux de compatibilité.
            </p>
          </div>

          <div className="group rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-3) shadow-sm hover:border-(--color-accent) hover:shadow-(--shadow-accent)">
            <p className="mb-(--space-1) text-(--font-size-xs) font-semibold uppercase tracking-[0.18em]">
              Matching
            </p>
            <h2 className="mb-(--space-1) font-semibold text-(--color-text-main)">
              Algorithme par affinités sportives
            </h2>
            <p className="text-(--color-text-muted)">
              Écrans dédiés pour paramétrer ton profil joueur : sports favoris,
              intensité, objectifs (perf, fun, compétition) et rythme de jeu,
              afin d'affiner les suggestions.
            </p>
          </div>

          <div className="group rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-3) shadow-sm hover:border-(--gray-500)">
            <p className="mb-2 font-semibold uppercase tracking-[0.18em]">
              Conversation
            </p>
            <h2 className="mb-(--space-1) font-semibold text-(--color-text-main)">
              Chat clair et orienté organisation
            </h2>
            <p className="text-(--color-text-muted)">
              Interface de chat inspirée des messageries modernes avec
              récapitulatif du match, boutons rapides (confirmer, décaler,
              annuler) et accès direct au lieu.
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-(--space-4) pb-(--space-8) sm:px-(--space-6) lg:px-(--space-8)">
        <div className="mb-(--space-3) flex items-center justify-between">
          <div>
            <h2 className="text-(--font-size-lg) font-semibold">
              Vos groupes
            </h2>
            <p className="text-(--color-text-muted)">
              Découvre des groupes par sport et par niveau pour trouver rapidement
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
          <p className="text-(--color-text-muted)">
            Connecte-toi ou crée un compte pour découvrir les groupes proposés.
          </p>
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
                  placeholder="Ex : Handball, Football, Tennis…"
                />
              </div>
            ) : null}

            {visibleGroups.length === 0 ? (
              <p className="text-(--color-text-muted)">
                Aucun groupe ne correspond à ce filtre pour le moment.
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
                        {group.sport} · {group.level}
                      </h3>
                      <p className="text-(--color-text-muted)">
                        {group.city
                          ? `${group.city} · ${group.membersCount} membres`
                          : `${group.membersCount} membres`}
                      </p>
                      <p className="text-(--color-text-soft)">{group.description}</p>
                      <div className="mt-(--space-2) flex justify-between gap-(--space-2)">
                        <Link
                          to={`/groups/${group.id}`}
                          className="button-primary text-(--font-size-xs) px-4"
                        >
                          Rejoindre le groupe
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
