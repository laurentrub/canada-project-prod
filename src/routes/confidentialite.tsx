import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité — Expat Boost" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Confidentialite,
});

function Confidentialite() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-bold">Politique de confidentialité</h1>
      <p className="mt-2 text-sm text-muted-foreground">Dernière mise à jour : juin 2026</p>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold">1. Responsable du traitement</h2>
        <p className="text-muted-foreground">
          Le responsable du traitement de vos données personnelles est <strong>Expat Boost</strong>, joignable à l'adresse <a href="mailto:hello@expatboost.com" className="text-primary underline-offset-2 hover:underline">hello@expatboost.com</a>.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold">2. Données collectées</h2>
        <p className="text-muted-foreground">Nous collectons les données suivantes, uniquement lorsque vous les fournissez volontairement via nos formulaires :</p>
        <ul className="ml-4 list-disc space-y-1 text-muted-foreground">
          <li><strong>Formulaire de contact :</strong> prénom, nom, email, pays de résidence, nationalité, programme d'intérêt, message.</li>
          <li><strong>Formulaire d'évaluation :</strong> informations d'identité, situation familiale, parcours académique, compétences linguistiques, expérience professionnelle, liens avec le Canada, projet migratoire.</li>
          <li><strong>Formulaire de consultation :</strong> nom complet, adresse email, date et créneau choisi.</li>
        </ul>
        <p className="text-muted-foreground">Nous ne collectons aucune donnée de navigation (cookies de traçage, identifiants publicitaires).</p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold">3. Finalités et base légale</h2>
        <ul className="ml-4 list-disc space-y-2 text-muted-foreground">
          <li><strong>Répondre à vos demandes de contact</strong> — base légale : exécution d'un contrat / intérêt légitime.</li>
          <li><strong>Analyser votre profil d'immigration et vous adresser une évaluation personnalisée</strong> — base légale : consentement explicite recueilli via le formulaire.</li>
          <li><strong>Planifier et confirmer un rendez-vous de consultation</strong> — base légale : exécution d'un contrat.</li>
          <li><strong>Vous adresser les emails de confirmation et de suivi</strong> — base légale : exécution d'un contrat.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold">4. Destinataires des données</h2>
        <p className="text-muted-foreground">Vos données sont traitées par les sous-traitants suivants, dans le strict cadre de la fourniture du service :</p>
        <ul className="ml-4 list-disc space-y-1 text-muted-foreground">
          <li><strong>Supabase</strong> (base de données sécurisée, hébergée en Union Européenne) — stockage des soumissions.</li>
          <li><strong>Resend</strong> (service d'envoi d'emails transactionnels) — envoi des emails de confirmation et de notification.</li>
          <li><strong>Vercel</strong> (hébergement du site et des fonctions serveur).</li>
        </ul>
        <p className="text-muted-foreground">Aucune donnée n'est vendue, louée ou partagée avec des tiers à des fins commerciales ou publicitaires.</p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold">5. Durée de conservation</h2>
        <p className="text-muted-foreground">
          Vos données sont conservées pendant la durée nécessaire au traitement de votre demande, puis archivées pour une durée maximale de <strong>3 ans</strong> à compter du dernier contact, conformément aux durées de prescription applicables.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold">6. Vos droits</h2>
        <p className="text-muted-foreground">Conformément au RGPD, vous disposez des droits suivants :</p>
        <ul className="ml-4 list-disc space-y-1 text-muted-foreground">
          <li>Droit d'accès à vos données personnelles</li>
          <li>Droit de rectification</li>
          <li>Droit à l'effacement (« droit à l'oubli »)</li>
          <li>Droit à la limitation du traitement</li>
          <li>Droit à la portabilité</li>
          <li>Droit d'opposition</li>
          <li>Droit de retirer votre consentement à tout moment</li>
        </ul>
        <p className="text-muted-foreground">
          Pour exercer ces droits, contactez-nous à <a href="mailto:hello@expatboost.com" className="text-primary underline-offset-2 hover:underline">hello@expatboost.com</a>. Vous pouvez également introduire une réclamation auprès de la CNIL (<a href="https://www.cnil.fr" className="text-primary underline-offset-2 hover:underline" target="_blank" rel="noopener noreferrer">cnil.fr</a>).
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold">7. Sécurité</h2>
        <p className="text-muted-foreground">
          Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou divulgation : connexions chiffrées (HTTPS/TLS), accès restreint aux données via des politiques de contrôle d'accès (RLS Supabase), et gestion des accès par authentification sécurisée.
        </p>
      </section>
    </div>
  );
}
