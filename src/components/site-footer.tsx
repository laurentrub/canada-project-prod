import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-3">
        <div>
          <h3 className="font-display text-lg font-bold">Expat Boost</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Conseillers en immigration canadienne. Un accompagnement humain, rigoureux et transparent.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Navigation</p>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li><Link to="/programmes" className="hover:text-foreground">Programmes</Link></li>
            <li><Link to="/a-propos" className="hover:text-foreground">À propos</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Contact</p>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>contact@expatboost.com</li>
            <li>Service 100 % en ligne</li>
            <li>Réponse sous 24-72 h</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Expat Boost. Tous droits réservés.
      </div>
    </footer>
  );
}