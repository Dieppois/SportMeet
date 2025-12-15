import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

import { usersApi, type User } from "../services/api";

export function UserSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (event: FormEvent) => {
    event.preventDefault();
    if (!query.trim()) {
      setError("Veuillez entrer un pseudo a rechercher.");
      return;
    }

    setError(null);
    setIsSearching(true);
    setHasSearched(true);

    try {
      const users = await usersApi.search(query.trim());
      setResults(users);
    } catch (e: any) {
      setError(e.message || "Impossible de rechercher les utilisateurs.");
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <main className="min-h-screen bg-(--color-bg) text-(--color-text-main) px-(--space-4) py-(--space-5)">
      <div className="mx-auto max-w-6xl space-y-(--space-4)">
        <header className="space-y-(--space-1)">
          <div className="flex items-center justify-between">
            <h1 className="text-(length:--font-size-2xl) font-semibold">
              Rechercher des joueurs
            </h1>
            <Link to="/" className="btn btn-secondary btn-sm">
              Retour
            </Link>
          </div>
          <p className="text-(length:--font-size-xs) text-(--color-text-muted)">
            Recherche de profils par pseudo pour trouver facilement des partenaires (US-009, US-010).
          </p>
        </header>

        <section className="rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-3) space-y-(--space-3)">
          <form onSubmit={handleSearch} className="space-y-(--space-3)">
            <div className="space-y-1">
              <label className="text-(length:--font-size-xs) text-(--color-text-muted)">
                Pseudo
              </label>
              <input
                className="w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
                placeholder="Rechercher par pseudo..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-(length:--font-size-xs) text-red-400">{error}</p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSearching}
              >
                {isSearching ? "Recherche..." : "Rechercher"}
              </button>
            </div>
          </form>

          <div className="space-y-(--space-2)">
            {!hasSearched ? (
              <p className="text-(length:--font-size-xs) text-(--color-text-soft)">
                Entre un pseudo pour rechercher des utilisateurs.
              </p>
            ) : isSearching ? (
              <p className="text-(length:--font-size-xs) text-(--color-text-soft)">
                Recherche en cours...
              </p>
            ) : results.length === 0 ? (
              <p className="text-(length:--font-size-xs) text-(--color-text-soft)">
                Aucun utilisateur trouve pour "{query}".
              </p>
            ) : (
              <>
                <p className="text-(length:--font-size-xs) text-(--color-text-muted)">
                  {results.length} resultat(s) pour "{query}"
                </p>
                <div className="grid gap-(--space-2) md:grid-cols-2">
                  {results.map((user) => (
                    <article
                      key={user.id}
                      className="rounded-2xl border border-(--color-border-subtle) bg-(--color-surface-dark) p-(--space-2) space-y-(--space-1)"
                    >
                      <div className="flex items-center gap-(--space-2)">
                        <div className="h-10 w-10 rounded-full bg-(--gray-800) text-center text-(length:--font-size-sm) font-semibold leading-10">
                          {user.pseudo.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h2 className="text-(length:--font-size-sm) font-semibold">
                            {user.pseudo}
                          </h2>
                          {user.city && (
                            <p className="text-(length:--font-size-xs) text-(--color-text-muted)">
                              {user.city}
                            </p>
                          )}
                        </div>
                      </div>
                      {user.bio && (
                        <p className="text-(length:--font-size-xs) text-(--color-text-soft)">
                          {user.bio.length > 100 ? `${user.bio.substring(0, 100)}...` : user.bio}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
