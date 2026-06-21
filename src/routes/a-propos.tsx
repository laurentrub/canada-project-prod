import { createFileRoute } from "@tanstack/react-router";
import { Award, HeartHandshake, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — Expat Boost" },
      { name: "description", content: "Une équipe de conseillers réglementés dédiée à votre projet d'immigration canadien." },
      { property: "og:title", content: "À propos — Expat Boost" },
      { property: "og:description", content: "Une équipe de conseillers réglementés dédiée à votre projet." },
    ],
    links: [{ rel: "canonical", href: "/a-propos" }],
  }),
  component: APropos,
});

const values = [
  { icon: ShieldCheck, title: "Transparence", desc: "Honoraires clairs, évaluation honnête, aucune fausse promesse." },
  { icon: HeartHandshake, title: "Empathie", desc: "Votre projet est aussi un projet de vie. Nous l'écoutons vraiment." },
  { icon: Award, title: "Expertise", desc: "Conseillers réglementés CRIC, à jour avec IRCC et le MIFI." },
];

function APropos() {
  return (
    <div>
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">À propos</p>
          <h1 className="mt-2 font-display text-5xl font-bold">Construire des avenirs canadiens, un dossier à la fois.</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Expat Boost a été fondé pour rendre l'immigration accessible : démystifier les programmes, accompagner avec rigueur et célébrer chaque arrivée.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold">Notre mission</h2>
            <p className="mt-4 text-muted-foreground">
              Le Canada offre plus de 60 programmes d'immigration. Naviguer cette complexité demande temps, méthode et expertise. Notre mission : remplacer l'incertitude par un plan clair.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold">Notre approche</h2>
            <p className="mt-4 text-muted-foreground">
              Évaluation honnête, stratégie sur-mesure, préparation minutieuse de la demande et suivi proactif jusqu'à l'obtention du statut. Pas de raccourcis, juste du travail bien fait.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}