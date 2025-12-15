import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

import { authApi } from "../services/api";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [hasSent, setHasSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await authApi.requestPasswordReset(email);
      setHasSent(true);
    } catch (e: any) {
      setError(e.message || "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-(--color-bg) text-(--color-text-main) flex items-center justify-center px-(--space-4)">
      <section className="w-full max-w-md rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-4) shadow-(--shadow-primary-soft)">
        <header className="mb-(--space-3)">
          <h1 className="text-(length:--font-size-2xl) font-semibold">
            Reinitialiser le mot de passe
          </h1>
          <p className="mt-(--space-1) text-(length:--font-size-xs) text-(--color-text-muted)">
            Saisis l'email associe a ton compte, nous t'enverrons un lien
            pour choisir un nouveau mot de passe (US-007).
          </p>
        </header>

        <form className="space-y-(--space-3)" onSubmit={handleSubmit}>
          <div className="space-y-(--space-1)">
            <label className="block text-(length:--font-size-xs) text-(--color-text-soft)">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
              placeholder="ton.email@sport.com"
              required
            />
          </div>

          {error && (
            <p className="text-(length:--font-size-xs) text-red-400">{error}</p>
          )}

          {hasSent ? (
            <p className="text-(length:--font-size-xs) text-green-400">
              Si un compte existe pour{" "}
              <span className="font-semibold">{email}</span>, un email de
              reinitialisation a ete envoye.
            </p>
          ) : null}

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer le lien de reinitialisation"}
          </button>

          <p className="text-center text-(length:--font-size-xs) text-(--color-text-muted)">
            Tu te souviens de ton mot de passe ?{" "}
            <Link to="/login" className="text-(--color-primary-light)">
              Retour a la connexion
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
