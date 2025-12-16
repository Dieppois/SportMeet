import { Link, useLocation } from "react-router-dom";

export function HomeShortcut() {
  const { pathname } = useLocation();

  if (pathname === "/") {
    return null;
  }

  return (
    <Link
      to="/"
      className="home-shortcut btn btn-primary btn-pill"
      aria-label="Revenir a l'accueil"
    >
      Accueil
    </Link>
  );
}
