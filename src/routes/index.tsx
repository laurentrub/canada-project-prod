import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  GraduationCap,
  Briefcase,
  Users,
  Plane,
  Building2,
  Stamp,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import heroImage from "@/assets/hero-canada.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maple Path — Immigration au Canada simplifiée" },
      { name: "description", content: "Conseillers experts. Découvrez les 60+ programmes d'immigration du Canada et obtenez votre consultation personnalisée." },
      { property: "og:title", content: "Maple Path — Immigration au Canada simplifiée" },
      { property: "og:description", content: "Conseillers experts. Découvrez les 60+ programmes d'immigration du Canada et obtenez votre consultation personnalisée." },
    ],
  }),
  component: Index,
});

const services = [
  { icon: Briefcase, title: "Express Entry", desc: "Travailleurs qualifiés fédéraux, CEC et FSTP." },
  { icon: Building2, title: "Programmes provinciaux (PNP)", desc: "Volets adaptés à chaque province et territoire." },
  { icon: GraduationCap, title: "Permis d'études", desc: "Sélection d'établissement, DCS, PAL et PGWP." },
  { icon: Stamp, title: "Permis de travail", desc: "EIMT, MIFI, jeunes professionnels, transferts intra." },
  { icon: Users, title: "Regroupement familial", desc: "Parrainage de conjoint, enfants et parents." },
  { icon: Plane, title: "Résidence & citoyenneté", desc: "RP, renouvellement de carte et demande de citoyenneté." },
];

const stats = [
  { value: "60+", label: "Programmes couverts" },
  { value: "12 ans", label: "D'expérience" },
  { value: "98%", label: "Clients satisfaits" },
];

function Index() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroImage}
            alt="Skyline canadien au coucher du soleil"
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        </div>
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2 md:py-32">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Consultation gratuite
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] text-foreground md:text-6xl">
              Votre chemin vers le <span className="text-primary">Canada</span>, en confiance.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Découvrez les programmes d'immigration du Canada et obtenez une consultation personnalisée. Plus de 60 voies pour étudier, travailler et vivre au Canada.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/consultation"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform hover:scale-[1.02]"
              >
                Réserver ma consultation <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/programmes"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
              >
                Explorer les programmes
              </Link>
            </div>
            <div className="mt-10 grid max-w-md grid-cols-3 gap-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-2xl font-bold text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Nos services</p>
            <h2 className="mt-2 font-display text-4xl font-bold">Un accompagnement pour chaque parcours</h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            De l'évaluation d'admissibilité au dépôt de la demande, nous gérons chaque étape avec rigueur.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Pourquoi Maple Path</p>
            <h2 className="mt-2 font-display text-4xl font-bold">Un dossier solide, un esprit tranquille.</h2>
            <p className="mt-4 text-muted-foreground">
              Chaque dossier est unique. Nous construisons une stratégie sur-mesure adaptée à votre profil, vos objectifs et la réalité du marché canadien.
            </p>
          </div>
          <ul className="space-y-4">
            {[
              "Évaluation d'admissibilité complète et honnête",
              "Stratégie alignée avec les tendances IRCC actuelles",
              "Préparation et révision de chaque document",
              "Suivi proactif jusqu'à l'obtention du statut",
            ].map((item) => (
              <li key={item} className="flex gap-3 rounded-xl border border-border bg-card p-4">
                <CheckCircle2 className="h-5 w-5 flex-none text-primary" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div
          className="overflow-hidden rounded-3xl p-10 text-center md:p-16"
          style={{ background: "var(--gradient-hero)" }}
        >
          <h2 className="font-display text-4xl font-bold text-primary-foreground md:text-5xl">
            Prêt à écrire votre chapitre canadien ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Réservez une consultation gratuite de 30 minutes avec l'un de nos conseillers réglementés.
          </p>
          <Link
            to="/evaluation"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold text-primary transition-transform hover:scale-[1.02]"
          >
            Commencer maintenant <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
