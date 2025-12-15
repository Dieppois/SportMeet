export function UserSearchPage() {
  return (
    <main className="min-h-screen bg-(--color-bg) text-(--color-text-main) px-(--space-4) py-(--space-5)">
      <div className="mx-auto max-w-6xl space-y-(--space-4)">
        <header className="space-y-(--space-1)">
          <h1 className="text-(length:--font-size-2xl) font-semibold">
            Rechercher des joueurs
          </h1>
          <p className="text-(length:--font-size-xs) text-(--color-text-muted)">
            US-009 / US-010 · Recherche de profils par sport, niveau, pseudo,
            pour trouver facilement des partenaires.
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
                Niveau
              </label>
              <input
                className="w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
                placeholder="Débutant, Inter, Confirmé…"
              />
            </div>
            <div className="space-y-1">
              <label className="text-(length:--font-size-xs) text-(--color-text-muted)">
                Pseudo
              </label>
              <input
                className="w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
                placeholder="@joueur"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button className="button-primary">Rechercher</button>
          </div>

          <div className="space-y-(--space-2)">
            <p className="text-(length:--font-size-xs) text-(--color-text-soft)">
              Résultats simulés · chaque card représentera un utilisateur
              correspondant aux critères.
            </p>
            <div className="grid gap-(--space-2) md:grid-cols-2">
              <article className="rounded-2xl border border-(--color-border-subtle) bg-(--color-surface-dark) p-(--space-2)">
                <h2 className="text-(length:--font-size-sm) font-semibold">
                  Joueur intermédiaire · Foot à 5
                </h2>
                <p className="text-(length:--font-size-xs) text-(--color-text-muted)">
                  Paris 19 · dispo soirées semaine · aime les matchs compétitifs
                  mais fair-play.
                </p>
              </article>
              <article className="rounded-2xl border border-(--color-border-subtle) bg-(--color-surface-dark) p-(--space-2)">
                <h2 className="text-(length:--font-size-sm) font-semibold">
                  Joueuse débutante · Tennis
                </h2>
                <p className="text-(length:--font-size-xs) text-(--color-text-muted)">
                  Lyon · recherche partenaires réguliers pour progresser dans la
                  bonne humeur.
                </p>
              </article>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}


