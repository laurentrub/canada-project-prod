import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cgu")({
  head: () => ({
    meta: [
      { title: "Conditions générales d'utilisation — Expat Boost" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CGU,
});

function CGU() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-bold">Conditions générales d'utilisation</h1>
      <p className="mt-2 text-sm text-muted-foreground">Dernière mise à jour : juin 2026</p>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold">1. Objet</h2>
        <p className="text-muted-foreground">
          Les présentes conditions générales d'utilisation (CGU) ont pour objet de définir les modalités d'accès et d'utilisation du site <strong>expatboost.com</strong> et des services proposés par Expat Boost. En accédant au site, l'utilisateur accepte sans réserve les présentes CGU.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold">2. Description des services</h2>
        <p className="text-muted-foreground">Expat Boost propose les services suivants :</p>
        <ul className="ml-4 list-disc space-y-1 text-muted-foreground">
          <li><strong>Évaluation gratuite d'admissibilité :</strong> analyse du profil du candidat au regard des programmes d'immigration canadiens, fournie exclusivement par email sous 24 à 72 heures ouvrées.</li>
          <li><strong>Consultation individuelle payante :</strong> rendez-vous de 60 minutes en visioconférence avec un conseiller, au tarif de 150 $ CAD, destiné à définir une stratégie migratoire personnalisée.</li>
          <li><strong>Informations générales :</strong> contenu éditorial sur les programmes d'immigration fédéraux et provinciaux canadiens.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold">3. Accès au site</h2>
        <p className="text-muted-foreground">
          L'accès au site est gratuit et ouvert à tout utilisateur disposant d'une connexion Internet. Expat Boost se réserve le droit de suspendre, modifier ou interrompre l'accès au site à tout moment, notamment pour des raisons de maintenance, sans que cela ne puisse engager sa responsabilité.
        </p>
        <p className="text-muted-foreground">
          Les services de conseil sont destinés exclusivement à des candidats résidant <strong>hors du Canada</strong> au moment de la demande.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold">4. Nature des conseils fournis</h2>
        <p className="text-muted-foreground">
          Les évaluations et consultations fournies par Expat Boost constituent des avis professionnels à caractère informatif et stratégique. Ils ne constituent pas un avis juridique au sens du droit applicable et ne sauraient se substituer à une procédure formelle devant les autorités canadiennes (IRCC, MIFI, AAPR).
        </p>
        <p className="text-muted-foreground">
          Les décisions finales en matière d'immigration appartiennent exclusivement aux autorités compétentes. Expat Boost ne garantit pas l'issue favorable d'une demande d'immigration.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold">5. Obligations de l'utilisateur</h2>
        <p className="text-muted-foreground">L'utilisateur s'engage à :</p>
        <ul className="ml-4 list-disc space-y-1 text-muted-foreground">
          <li>Fournir des informations exactes, complètes et sincères lors de la soumission de tout formulaire.</li>
          <li>Ne pas utiliser le site à des fins frauduleuses, illicites ou contraires à l'ordre public.</li>
          <li>Ne pas tenter d'accéder sans autorisation aux systèmes ou données du site.</li>
          <li>Respecter la propriété intellectuelle d'Expat Boost.</li>
        </ul>
        <p className="text-muted-foreground">
          Expat Boost se réserve le droit de refuser ou d'interrompre un service en cas de manquement à ces obligations.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold">6. Tarifs et paiement</h2>
        <p className="text-muted-foreground">
          L'évaluation d'admissibilité est proposée sans frais. La consultation individuelle est facturée <strong>150 $ CAD</strong>. Les modalités de paiement sont communiquées par email après confirmation du rendez-vous. Aucun paiement n'est collecté directement via le site.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold">7. Responsabilité</h2>
        <p className="text-muted-foreground">
          Expat Boost s'engage à fournir ses services avec le soin et la diligence professionnelle appropriés. Sa responsabilité ne saurait être engagée en cas de refus d'une demande d'immigration par les autorités canadiennes, de modification réglementaire postérieure à la consultation, ou de fourniture d'informations inexactes par l'utilisateur.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold">8. Modification des CGU</h2>
        <p className="text-muted-foreground">
          Expat Boost se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs sont invités à les consulter régulièrement. La date de dernière mise à jour figure en haut de cette page.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold">9. Droit applicable et juridiction</h2>
        <p className="text-muted-foreground">
          Les présentes CGU sont régies par le droit français. Tout litige relatif à leur interprétation ou à leur exécution sera soumis aux tribunaux compétents, après tentative de résolution amiable.
        </p>
      </section>
    </div>
  );
}
