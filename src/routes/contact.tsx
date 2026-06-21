import { createFileRoute } from "@tanstack/react-router";
import { Mail, Clock, Globe2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Expat Boost" },
      { name: "description", content: "Réservez votre consultation gratuite de 30 minutes avec un conseiller en immigration." },
      { property: "og:title", content: "Contact — Expat Boost" },
      { property: "og:description", content: "Réservez votre consultation gratuite de 30 minutes." },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div>
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Contact</p>
          <h1 className="mt-2 font-display text-5xl font-bold">Parlons de votre projet.</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Une consultation de 30 minutes pour évaluer votre admissibilité et tracer les premières étapes.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[1fr_1.4fr]">
        <div className="space-y-6">
          <div className="flex gap-4">
            <span className="grid h-10 w-10 flex-none place-items-center rounded-lg bg-primary/10 text-primary"><Mail className="h-4 w-4" /></span>
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-sm text-muted-foreground">contact@expatboost.com</p>
              <p className="text-xs text-muted-foreground mt-1">Notre canal de communication officiel.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <span className="grid h-10 w-10 flex-none place-items-center rounded-lg bg-primary/10 text-primary"><Globe2 className="h-4 w-4" /></span>
            <div>
              <p className="font-semibold">Consultations 100 % en ligne</p>
              <p className="text-sm text-muted-foreground">Service dédié aux candidats résidant hors du Canada — par visioconférence sécurisée.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <span className="grid h-10 w-10 flex-none place-items-center rounded-lg bg-primary/10 text-primary"><Clock className="h-4 w-4" /></span>
            <div>
              <p className="font-semibold">Délai de réponse</p>
              <p className="text-sm text-muted-foreground">Sous 24 à 72 heures ouvrées, fuseau horaire de l'Est (EST).</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="space-y-4 rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]"
        >
          {sent ? (
            <div className="py-12 text-center">
              <h3 className="font-display text-2xl font-bold">Merci !</h3>
              <p className="mt-2 text-muted-foreground">Nous vous recontactons sous 24 h.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Prénom" name="firstName" />
                <Field label="Nom" name="lastName" />
              </div>
              <Field label="Email" name="email" type="email" />
              <Field label="Pays de résidence" name="country" />
              <Field label="Nationalité" name="nationality" />
              <div>
                <label className="text-sm font-medium">Programme d'intérêt</label>
                <select className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                  <option>Je ne sais pas encore</option>
                  <option>Entrée Express</option>
                  <option>PNP</option>
                  <option>Québec (PRTQ / PEQ)</option>
                  <option>Permis d'études</option>
                  <option>Permis de travail</option>
                  <option>Parrainage familial</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Votre message</label>
                <textarea rows={4} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <p className="text-xs text-muted-foreground">
                Notre équipe vous répond uniquement par email. Aucun appel téléphonique n'est requis.
              </p>
              <button
                type="submit"
                className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform hover:scale-[1.01]"
              >
                Demander une consultation
              </button>
            </>
          )}
        </form>
      </section>
    </div>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div>
      <label className="text-sm font-medium" htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
    </div>
  );
}