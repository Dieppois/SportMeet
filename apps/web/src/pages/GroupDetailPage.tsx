import { Link, useParams } from "react-router-dom";

import { getGroupById } from "../services/localGroupService";

export function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const group = groupId ? getGroupById(groupId) : undefined;

  if (!group) {
    return (
      <main className="min-h-screen bg-(--color-bg) text-(--color-text-main) px-(--space-4) py-(--space-5)">
        <div className="mx-auto max-w-3xl space-y-(--space-3)">
          <h1 className="text-(length:--font-size-2xl) font-semibold">
            Groupe introuvable
          </h1>
          <p className="text-(length:--font-size-sm) text-(--color-text-muted)">
            Le groupe que tu recherches n&apos;existe pas ou n&apos;est plus
            disponible.
          </p>
          <Link to="/groups" className="button-primary">
            Retour aux groupes
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-(--color-bg) text-(--color-text-main) px-(--space-4) py-(--space-5)">
      <div className="mx-auto max-w-4xl space-y-(--space-4)">
        <header className="space-y-(--space-1)">
          <p className="text-(length:--font-size-xs) text-(--color-text-muted)">
            Groupe · {group.sport}
          </p>
          <h1 className="text-(length:--font-size-2xl) font-semibold">
            {group.sport} · {group.level}
          </h1>
          <p className="text-(length:--font-size-sm) text-(--color-text-soft)">
            {group.description}
          </p>
          <p className="text-(length:--font-size-xs) text-(--color-text-muted)">
            {group.city ? `${group.city} · ` : null}
            {group.membersCount} membres
          </p>
          <div className="mt-(--space-2) flex gap-(--space-2)">
            <Link
              to="/activities/new"
              className="button-primary text-(length:--font-size-sm)"
            >
              Créer une activité
            </Link>
          </div>
        </header>

        <section className="space-y-(--space-2)">
          <h2 className="text-(length:--font-size-lg) font-semibold">
            Activités en cours
          </h2>
          <p className="text-(length:--font-size-sm) text-(--color-text-muted)">
            Ici, tu retrouveras les activités proposées par les membres de ce
            groupe : matchs, entraînements, sorties…
          </p>

          <div className="rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-3)">
            <p className="text-(length:--font-size-sm) text-(--color-text-soft)">
              Aucune activité en cours pour le moment. Sois le premier à en
              créer une depuis ce groupe !
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}


