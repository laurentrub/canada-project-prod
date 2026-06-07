import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/programmes")({
  head: () => ({
    meta: [
      { title: "Programmes d'immigration — Maple Path" },
      { name: "description", content: "Explorez les principales voies d'immigration vers le Canada : Express Entry, PNP, études, travail, famille." },
      { property: "og:title", content: "Programmes d'immigration — Maple Path" },
      { property: "og:description", content: "Explorez les principales voies d'immigration vers le Canada." },
    ],
    links: [{ rel: "canonical", href: "/programmes" }],
  }),
  component: Programmes,
});

const categories = [
  {
    title: "Résidence permanente",
    items: [
      { name: "Express Entry — FSWP", desc: "Travailleurs qualifiés fédéraux." },
      { name: "Express Entry — CEC", desc: "Catégorie de l'expérience canadienne." },
      { name: "Express Entry — FSTP", desc: "Métiers spécialisés." },
      { name: "Programme des candidats des provinces (PNP)", desc: "13 provinces et territoires." },
      { name: "Programme des travailleurs qualifiés du Québec (PRTQ)", desc: "Sélection québécoise." },
      { name: "Programme de l'expérience québécoise (PEQ)", desc: "Diplômés et travailleurs au Québec." },
    ],
  },
  {
    title: "Études",
    items: [
      { name: "Permis d'études", desc: "Préparation complète du dossier." },
      { name: "Certificat d'acceptation du Québec (CAQ)", desc: "Étape obligatoire pour le Québec." },
      { name: "Permis de travail post-diplôme (PGWP)", desc: "Jusqu'à 3 ans d'expérience canadienne." },
    ],
  },
  {
    title: "Travail",
    items: [
      { name: "EIMT — Étude d'impact sur le marché du travail", desc: "Embauche internationale." },
      { name: "Mobilité internationale (PMI)", desc: "Dispensés d'EIMT." },
      { name: "Permis vacances-travail (EIC)", desc: "Jeunes professionnels." },
      { name: "Transferts intra-entreprise", desc: "Personnel clé et spécialistes." },
    ],
  },
  {
    title: "Famille & citoyenneté",
    items: [
      { name: "Parrainage de conjoint", desc: "Intérieur et extérieur du Canada." },
      { name: "Parrainage parents & grands-parents", desc: "Programme PGP & super visa." },
      { name: "Demande de citoyenneté", desc: "Préparation et examen." },
      { name: "Renouvellement de carte RP", desc: "Conformité aux obligations de résidence." },
    ],
  },
];

function Programmes() {
  return (
    <div>
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Programmes</p>
          <h1 className="mt-2 font-display text-5xl font-bold">60+ voies vers le Canada</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Voici les programmes principaux que nous accompagnons. Une consultation permet d'identifier ceux pour lesquels vous êtes admissible.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-16 px-6 py-20">
        {categories.map((cat) => (
          <div key={cat.title}>
            <h2 className="font-display text-3xl font-bold">{cat.title}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cat.items.map((it) => (
                <div key={it.name} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                  <h3 className="font-display text-lg font-semibold">{it.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{it.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="rounded-2xl border border-primary/20 bg-accent p-8 text-center">
          <h3 className="font-display text-2xl font-bold">Vous ne savez pas par où commencer ?</h3>
          <p className="mt-2 text-muted-foreground">Notre consultation identifie les voies les plus prometteuses pour votre profil.</p>
          <Link to="/contact" className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
            Réserver une consultation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}