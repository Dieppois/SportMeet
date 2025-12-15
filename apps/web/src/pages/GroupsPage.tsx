import { Link } from "react-router-dom";

import { getAllGroups } from "../services/localGroupService";

export function GroupsPage() {
  const groups = getAllGroups();

  return (
    <main className="min-h-screen bg-(--color-bg) text-(--color-text-main) px-(--space-4) py-(--space-5)">
      <div className="mx-auto max-w-6xl space-y-(--space-4)">
        <header className="space-y-(--space-1)">
          <h1 className="text-(length:--font-size-2xl) font-semibold">
            Groupes sportifs
          </h1>
          <p className="text-(length:--font-size-xs) text-(--color-text-muted)">
            Explore les groupes par sport et par niveau, puis rejoins celui qui
            correspond à ton profil.
          </p>
        </header>

        <section className="rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-3) space-y-(--space-3)">
          <div className="grid gap-(--space-3) md:grid-cols-3">
            {groups.map((group) => (
              <article
                key={group.id}
                className="rounded-2xl border border-(--color-border-subtle) bg-(--color-surface-dark) p-(--space-2) space-y-(--space-1)"
              >
                <header className="flex items-center justify-between">
                  <h2 className="text-(length:--font-size-sm) font-semibold">
                    {group.sport} · {group.level}
                  </h2>
                  <span className="text-(length:--font-size-xs) text-(--color-text-muted)">
                    {group.membersCount} membres
                  </span>
                </header>
                <p className="text-(length:--font-size-xs) text-(--color-text-soft)">
                  {group.description}
                </p>
                <div className="flex justify-between items-center">
                  <Link
                    to={`/groups/${group.id}`}
                    className="button-primary text-(length:--font-size-xs)"
                  >
                    Rejoindre le groupe
                  </Link>
                  <Link
                    to={`/groups/${group.id}`}
                    className="text-(length:--font-size-xs) text-(--color-text-muted)"
                  >
                    Voir le détail
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

