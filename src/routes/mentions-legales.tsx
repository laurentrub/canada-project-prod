import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales — Expat Boost" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MentionsLegales,
});

function MentionsLegales() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-bold">Mentions légales</h1>
      <p className="mt-2 text-sm text-muted-foreground">Dernière mise à jour : juin 2026</p>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold">1. Éditeur du site</h2>
        <p className="text-muted-foreground">
          Le site <strong>expatboost.com</strong> est édité par la société <strong>Expat Boost</strong>, cabinet conseil en immigration canadienne, opérant exclusivement en ligne.
        </p>
        <p className="text-muted-foreground">
          Adresse de contact : <a href="mailto:hello@expatboost.com" className="text-primary underline-offset-2 hover:underline">hello@expatboost.com</a>
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold">2. Hébergement</h2>
        <p className="text-muted-foreground">
          Le site est hébergé par <strong>Vercel Inc.</strong>, 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis — <a href="https://vercel.com" className="text-primary underline-offset-2 hover:underline" target="_blank" rel="noopener noreferrer">vercel.com</a>.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold">3. Activité et cadre réglementaire</h2>
        <p className="text-muted-foreground">
          Expat Boost propose des services de conseil et d'accompagnement en matière d'immigration canadienne : évaluation de profil, orientation vers les programmes d'immigration fédéraux et provinciaux, préparation de dossiers et suivi des démarches.
        </p>
        <p className="text-muted-foreground">
          Nos services sont destinés exclusivement à des candidats résidant en dehors du Canada. Ils constituent des conseils à caractère informatif et d'accompagnement ; ils ne remplacent pas les obligations légales propres à chaque demandeur ni les décisions souveraines des autorités canadiennes d'immigration (IRCC, MIFI, AAPR).
        </p>
        <p className="text-muted-foreground">
          Expat Boost n'est pas un cabinet d'avocats et ne fournit pas de conseil juridique au sens du droit applicable.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold">4. Propriété intellectuelle</h2>
        <p className="text-muted-foreground">
          L'ensemble des contenus présents sur ce site (textes, graphiques, logo, structure) est la propriété exclusive d'Expat Boost et est protégé par le droit d'auteur. Toute reproduction, représentation ou diffusion, totale ou partielle, sans autorisation écrite préalable est strictement interdite.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold">5. Limitation de responsabilité</h2>
        <p className="text-muted-foreground">
          Les informations publiées sur ce site ont un caractère général et indicatif. La réglementation en matière d'immigration évolue fréquemment ; Expat Boost s'efforce de maintenir les informations à jour mais ne saurait garantir l'exactitude, l'exhaustivité ou l'actualité de l'ensemble des contenus. Expat Boost décline toute responsabilité quant aux décisions prises par les utilisateurs sur la base des informations disponibles sur le site.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold">6. Droit applicable</h2>
        <p className="text-muted-foreground">
          Les présentes mentions légales sont régies par le droit français. Tout litige relatif à l'utilisation du site sera soumis à la compétence des tribunaux compétents.
        </p>
      </section>
    </div>
  );
}
