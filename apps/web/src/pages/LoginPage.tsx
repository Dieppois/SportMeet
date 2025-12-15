export function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-(--color-bg) text-(--color-text-main) px-(--space-4)">
      <div className="w-full max-w-md rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-4) space-y-(--space-3)">
        <header className="space-y-(--space-1)">
          <h1 className="text-(length:--font-size-2xl) font-semibold">
            Connexion
          </h1>
          <p className="text-(length:--font-size-xs) text-(--color-text-muted)">
            Accède à ton compte pour retrouver tes matchs, groupes et activités
            sportives.
          </p>
        </header>

        <form className="space-y-(--space-3)">
          <div className="space-y-1">
            <label className="text-(length:--font-size-xs) text-(--color-text-muted)">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
              placeholder="ton@email.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-(length:--font-size-xs) text-(--color-text-muted)">
              Mot de passe
            </label>
            <input
              type="password"
              className="w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between text-(length:--font-size-xs)">
            <a href="/forgot-password" className="text-(--color-text-muted)">
              Mot de passe oublié ?
            </a>
          </div>

          <button type="submit" className="btn btn-primary btn-full">
            Se connecter
          </button>
        </form>

        <p className="text-center text-(length:--font-size-xs) text-(--color-text-muted)">
          Pas encore de compte ?{" "}
          <a href="/signup" className="text-(--color-primary-light)">
            Créer un compte
          </a>
        </p>
      </div>
    </main>
  );
}


