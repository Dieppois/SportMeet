export function GroupsPage() {
  return (
    <main className="min-h-screen bg-(--color-bg) text-(--color-text-main) px-(--space-4) py-(--space-5)">
      <div className="mx-auto max-w-6xl space-y-(--space-4)">
        <header className="space-y-(--space-1)">
          <h1 className="text-(length:--font-size-2xl) font-semibold">
            Groupes sportifs
          </h1>
          <p className="text-(length:--font-size-xs) text-(--color-text-muted)">
            US-011 à US-014 · Rejoindre, quitter, rechercher et consulter les
            groupes et leurs membres.
          </p>
        </header>

        <section className="rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-3) space-y-(--space-3)">
          <div className="grid gap-(--space-3) md:grid-cols-3">
            <div className="space-y-1">
              <label className="text-(length:--font-size-xs) text-(--color-text-muted)">
                Sport
              </label>
              <input
                className="w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
                placeholder="Foot, tennis, paddle…"
              />
            </div>
            <div className="space-y-1">
              <label className="text-(length:--font-size-xs) text-(--color-text-muted)">
                Ville / zone
              </label>
              <input
                className="w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
                placeholder="Paris, Lyon…"
              />
            </div>
            <div className="space-y-1">
              <label className="text-(length:--font-size-xs) text-(--color-text-muted)">
                Niveau moyen
              </label>
              <input
                className="w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
                placeholder="Débutant, Inter, Confirmé…"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button className="btn btn-primary">Rechercher un groupe</button>
          </div>

          <div className="grid gap-(--space-3) md:grid-cols-2">
            <article className="rounded-2xl border border-(--color-border-subtle) bg-(--color-surface-dark) p-(--space-2) space-y-(--space-1)">
              <header className="flex items-center justify-between">
                <h2 className="text-(length:--font-size-sm) font-semibold">
                  Foot 5 · Paris Nord
                </h2>
                <span className="text-(length:--font-size-xs) text-(--color-text-muted)">
                  24 membres
                </span>
              </header>
              <p className="text-(length:--font-size-xs) text-(--color-text-soft)">
                Groupe régulier de foot à 5, matchs tous les mardis et jeudis
                soir. Niveau intermédiaire.
              </p>
              <div className="flex justify-between items-center">
                <button className="btn btn-primary btn-sm">
                  Rejoindre le groupe
                </button>
                <a
                  href="/groups/1"
                  className="btn btn-ghost btn-sm"
                >
                  Voir le détail
                </a>
              </div>
            </article>

            <article className="rounded-2xl border border-(--color-border-subtle) bg-(--color-surface-dark) p-(--space-2) space-y-(--space-1)">
              <header className="flex items-center justify-between">
                <h2 className="text-(length:--font-size-sm) font-semibold">
                  Tennis loisirs · Lyon
                </h2>
                <span className="text-(length:--font-size-xs) text-(--color-text-muted)">
                  12 membres
                </span>
              </header>
              <p className="text-(length:--font-size-xs) text-(--color-text-soft)">
                Groupe de joueurs et joueuses loisirs, idéal pour organiser des
                matchs 1v1 ou 2v2 après le travail.
              </p>
              <div className="flex justify-between items-center">
                <button className="btn btn-primary btn-sm">
                  Rejoindre le groupe
                </button>
                <a
                  href="/groups/2"
                  className="btn btn-ghost btn-sm"
                >
                  Voir le détail
                </a>
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}


