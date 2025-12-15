import { Link } from "react-router-dom";
import { getAllActivities } from "../services/localActivityService";

export function LandingPage() {
  const activities = getAllActivities();

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
            <Link
              to="/login"
              className="rounded-full border border-(--color-border-subtle) px-4 py-1.5 text-sm font-medium text-(--color-text-main) shadow-sm hover:border-(--color-border-strong) hover:bg-(--color-surface-light)"
            >
              Connexion
            </Link>
            <Link to="/signup" className="button-primary px-6 py-2 text-sm">
              Créer un compte
            </Link>
          </div>
        </div>
      </header>

      {/* Hero + preview */}
      <section className="mx-auto flex max-w-6xl flex-col gap-(--space-6) px-(--space-4) pb-(--space-8) pt-(--space-5) sm:px-(--space-6) lg:flex-row lg:items-center lg:gap-(--space-8) lg:px-(--space-8) lg:pb-(--space-10) lg:pt-(--space-6)">
        {/* Hero copy */}
        <div className="flex-1 space-y-8">

          <div className="space-y-4">
            <h1 className="text-balance font-semibold tracking-tight text-(--color-text-main) sm:text-(--font-size-4xl) lg:text-(--font-size-4xl)">
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
          </div>

          <div className="flex flex-col gap-(--space-2) sm:flex-row sm:items-center">
            <Link
              to="/signup"
              className="button-primary inline-flex items-center justify-center gap-(--space-1)"
            >
              Je veux jouer
            </Link>
          </div>

        </div>

        <div className="flex-1">
            <div className="relative mx-auto max-w-md">
            {/* Main card */}
            <div className="relative rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-4 shadow-(--shadow-primary-soft)">
              {/* Tab header */}
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-(--color-primary)" />
                  <p className="text-xs font-medium text-(--color-text-soft)">
                    Matchs suggérés près de toi
                  </p>
                </div>
                <button className="rounded-full bg-(--color-surface-light) px-3 py-1 text-[11px] font-medium text-(--color-text-main) hover:bg-(--color-surface)">
                  Voir tout
                </button>
              </div>

              {/* Match cards */}
              <div className="space-y-3">
                {/* Match 1 */}
                <div className="flex items-center gap-3 rounded-2xl border border-(--color-border-subtle) bg-(--color-surface) p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-(--color-primary) text-sm font-semibold text-(--color-bg)">
                    5v5
                  </div>
                    <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-(--color-text-main)">
                        Foot · Terrain synthé
                      </p>
                      <span className="rounded-full bg-(--color-secondary-dark) px-2 py-0.5 text-[11px] font-medium text-(--color-text-main)">
                        3 places
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-(--color-text-muted)">
                      Ce soir · 20h00 · 2,1 km · Niveau inter / avancé
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-[11px] text-(--color-text-muted)">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-(--gray-800) text-[10px]">
                        ⚽
                      </span>
                      <span>3 amis en commun · 92% de compatibilité</span>
                    </div>
                  </div>
                </div>

                {/* Match 2 */}
                <div className="flex items-center gap-3 rounded-2xl border border-(--color-border-subtle) bg-(--color-surface-light) p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-(--color-secondary) text-sm font-semibold text-(--color-bg)">
                    1v1
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-(--color-text-main)">
                        Tennis · Dur extérieur
                      </p>
                      <span className="rounded-full bg-(--color-accent) px-2 py-0.5 text-[11px] font-medium text-(--color-bg)">
                        Match rapide
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-(--color-text-muted)">
                      Demain · 18h30 · 900 m · Niveau 15/4 – 15/3
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-[11px] text-(--color-text-muted)">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-(--gray-800) text-[10px]">
                        💬
                      </span>
                      <span>Discussion déjà entamée · 4 messages échangés</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom stats pill */}
            <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-(--color-border-subtle) bg-(--color-surface) px-4 py-3 text-[11px] text-(--color-text-soft)">
              <div>
                <p className="font-semibold text-(--color-text-main)">
                  +248 matchs
                </p>
                <p className="text-(--color-text-muted)">
                  organisés cette semaine
                </p>
              </div>
              <div className="h-10 w-px bg-(--gray-800)" />
              <div>
                <p className="font-semibold text-(--color-primary-light)">
                  92% de joueurs
                </p>
                <p className="text-(--color-text-muted)">
                  veulent rejouer avec leurs matchs
                </p>
              </div>
            </div>
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
              Activités ouvertes
            </h2>
            <p className="text-(--color-text-muted)">
              Crée une activité depuis l'accueil et laisse les autres
              utilisateurs la rejoindre et discuter.
            </p>
          </div>
          <Link to="/activities/new" className="button-primary text-(--font-size-xs)">
            Créer une activité
          </Link>
        </div>

        {activities.length === 0 ? (
          <p className="text-(--color-text-muted)">
            Aucune activité pour le moment. Sois le premier à en créer une !
          </p>
        ) : (
          <div className="grid gap-(--space-3) md:grid-cols-2">
            {activities.map((activity) => (
              <article
                key={activity.id}
                className="rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-3) space-y-(--space-1)"
              >
                <h3 className="text-(--font-size-sm) font-semibold">
                  {activity.title}
                </h3>
                <p className="text-(--color-text-muted)">
                  {activity.dateTime ?? "Date à définir"} ·{" "}
                  {activity.location ?? "Lieu à définir"}
                </p>
                <p className="text-(--color-text-soft)">
                  {activity.maxParticipants
                    ? `${activity.participantIds.length} / ${activity.maxParticipants} participants`
                    : `${activity.participantIds.length} participant(s)`}
                </p>
                <div className="mt-(--space-2) flex justify-between gap-(--space-2)">
                  <Link
                    to={`/activities/${activity.id}`}
                    className="button-primary text-(--font-size-xs)"
                  >
                    Ouvrir l'activité
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
