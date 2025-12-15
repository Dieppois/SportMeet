import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [hasSent, setHasSent] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // Pas d'envoi réel d'email dans la version mock.
    setHasSent(true);
  };

  return (
    <main className="min-h-screen bg-(--color-bg) text-(--color-text-main) flex items-center justify-center px-(--space-4)">
      <section className="w-full max-w-md rounded-3xl border border-(--color-border-subtle) bg-(--color-surface) p-(--space-4) shadow-(--shadow-primary-soft)">
        <header className="mb-(--space-3)">
          <h1 className="text-(length:--font-size-2xl) font-semibold">
            Réinitialiser le mot de passe
          </h1>
          <p className="mt-(--space-1) text-(length:--font-size-xs) text-(--color-text-muted)">
            Saisis l&apos;email associé à ton compte, nous t&apos;enverrons un lien
            pour choisir un nouveau mot de passe.
          </p>
        </header>

        <form className="space-y-(--space-3)" onSubmit={handleSubmit}>
          <div className="space-y-(--space-1)">
            <label className="block text-(length:--font-size-xs) text-(--color-text-soft)">
              Email
            </label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-(--color-border-subtle) bg-(--color-bg) px-(--space-2) py-(--space-1) text-(length:--font-size-sm) outline-none focus:border-(--color-primary)"
              placeholder="ton.email@sport.com"
            />
          </div>

          {hasSent ? (
            <p className="text-(length:--font-size-xs) text-(--color-text-muted)">
              Si un compte existe pour{" "}
              <span className="font-semibold">{email}</span>, un mail de
              réinitialisation a été simulé.
            </p>
          ) : null}

          <button type="submit" className="btn btn-primary btn-full">
            Envoyer le lien de réinitialisation
          </button>

          <p className="text-center text-(length:--font-size-xs) text-(--color-text-muted)">
            Tu te souviens de ton mot de passe ?{" "}
            <Link to="/login" className="text-(--color-primary-light)">
              Retour à la connexion
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}


