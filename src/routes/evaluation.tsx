import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, ArrowRight, ArrowLeft, ClipboardCheck } from "lucide-react";

export const Route = createFileRoute("/evaluation")({
  head: () => ({
    meta: [
      { title: "Évaluation gratuite — Maple Path" },
      { name: "description", content: "Évaluez gratuitement votre admissibilité à l'immigration canadienne en quelques minutes." },
      { property: "og:title", content: "Évaluation d'immigration gratuite — Maple Path" },
      { property: "og:description", content: "Découvrez en quelques minutes les programmes d'immigration canadiens qui vous correspondent." },
    ],
    links: [{ rel: "canonical", href: "/evaluation" }],
  }),
  component: Evaluation,
});

type FormData = {
  // Step 1
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  age: string;
  maritalStatus: string;
  children: string;
  // Step 2
  education: string;
  fieldOfStudy: string;
  frenchLevel: string;
  englishLevel: string;
  // Step 3
  experienceYears: string;
  occupation: string;
  jobOffer: string;
  canadaExperience: string;
  familyInCanada: string;
  // Step 4
  program: string;
  province: string;
  timeline: string;
  budget: string;
  notes: string;
};

const initialData: FormData = {
  firstName: "", lastName: "", email: "", phone: "", country: "", age: "", maritalStatus: "", children: "",
  education: "", fieldOfStudy: "", frenchLevel: "", englishLevel: "",
  experienceYears: "", occupation: "", jobOffer: "", canadaExperience: "", familyInCanada: "",
  program: "", province: "", timeline: "", budget: "", notes: "",
};

const steps = [
  { title: "Profil personnel", desc: "Informations de base" },
  { title: "Études & langues", desc: "Diplômes et compétences linguistiques" },
  { title: "Expérience professionnelle", desc: "Parcours et liens avec le Canada" },
  { title: "Votre projet", desc: "Programme visé et calendrier" },
];

function Evaluation() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initialData);
  const [submitted, setSubmitted] = useState(false);

  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);
  const update = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setData((d) => ({ ...d, [k]: e.target.value }));

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
            <ClipboardCheck className="h-4 w-4" /> Évaluation gratuite
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Évaluez votre admissibilité en 5 minutes.</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Répondez à quelques questions pour que nos conseillers identifient les programmes d'immigration canadiens les mieux adaptés à votre profil.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        {submitted ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-[var(--shadow-card)]">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold">Merci, {data.firstName || "à bientôt"} !</h2>
            <p className="mt-3 text-muted-foreground">
              Votre dossier d'évaluation a été reçu. Un conseiller vous contactera à <span className="font-semibold text-foreground">{data.email}</span> sous 24 à 48 heures avec une analyse personnalisée.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">Étape {step + 1} / {steps.length} — {steps[step].title}</span>
                <span className="text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{steps[step].desc}</p>
            </div>

            <form onSubmit={submit} className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
              {step === 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Prénom" value={data.firstName} onChange={update("firstName")} required />
                  <Field label="Nom" value={data.lastName} onChange={update("lastName")} required />
                  <Field label="Email" type="email" value={data.email} onChange={update("email")} required />
                  <Field label="Téléphone" type="tel" value={data.phone} onChange={update("phone")} />
                  <Field label="Pays de résidence" value={data.country} onChange={update("country")} required />
                  <Select label="Âge" value={data.age} onChange={update("age")} options={["Moins de 18", "18-29", "30-39", "40-49", "50 et +"]} required />
                  <Select label="État civil" value={data.maritalStatus} onChange={update("maritalStatus")} options={["Célibataire", "En couple", "Marié(e)", "Divorcé(e)", "Veuf/Veuve"]} required />
                  <Select label="Enfants à charge" value={data.children} onChange={update("children")} options={["Aucun", "1", "2", "3 ou +"]} />
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Select label="Niveau d'études le plus élevé" value={data.education} onChange={update("education")} options={["Secondaire", "Diplôme professionnel", "Bac / Licence", "Master", "Doctorat"]} required />
                  <Field label="Domaine d'études" value={data.fieldOfStudy} onChange={update("fieldOfStudy")} placeholder="Ex. Informatique, Santé..." />
                  <Select label="Niveau de français" value={data.frenchLevel} onChange={update("frenchLevel")} options={["Aucun", "Débutant (A1-A2)", "Intermédiaire (B1-B2)", "Avancé (C1-C2)", "Langue maternelle"]} required />
                  <Select label="Niveau d'anglais" value={data.englishLevel} onChange={update("englishLevel")} options={["Aucun", "Débutant (A1-A2)", "Intermédiaire (B1-B2)", "Avancé (C1-C2)", "Langue maternelle"]} required />
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Select label="Années d'expérience professionnelle" value={data.experienceYears} onChange={update("experienceYears")} options={["Moins de 1 an", "1-3 ans", "4-6 ans", "7-10 ans", "Plus de 10 ans"]} required />
                  <Field label="Profession actuelle" value={data.occupation} onChange={update("occupation")} />
                  <Select label="Offre d'emploi au Canada ?" value={data.jobOffer} onChange={update("jobOffer")} options={["Non", "En cours de négociation", "Oui, validée"]} />
                  <Select label="Expérience de travail/études au Canada ?" value={data.canadaExperience} onChange={update("canadaExperience")} options={["Aucune", "Moins de 1 an", "1-2 ans", "Plus de 2 ans"]} />
                  <Select label="Famille proche au Canada ?" value={data.familyInCanada} onChange={update("familyInCanada")} options={["Non", "Oui — citoyen(ne) ou résident(e) permanent(e)", "Oui — temporaire"]} />
                </div>
              )}

              {step === 3 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Select label="Programme visé" value={data.program} onChange={update("program")} options={["Je ne sais pas encore", "Express Entry", "PNP", "Québec (PRTQ / PEQ)", "Permis d'études", "Permis de travail", "Parrainage familial"]} required />
                  <Select label="Province souhaitée" value={data.province} onChange={update("province")} options={["Indifférent", "Québec", "Ontario", "Colombie-Britannique", "Alberta", "Manitoba", "Saskatchewan", "Nouvelle-Écosse", "Nouveau-Brunswick", "Autre"]} />
                  <Select label="Délai souhaité" value={data.timeline} onChange={update("timeline")} options={["Moins de 6 mois", "6-12 mois", "1-2 ans", "Plus de 2 ans"]} required />
                  <Select label="Budget approximatif pour le projet" value={data.budget} onChange={update("budget")} options={["Moins de 5 000 $", "5 000-15 000 $", "15 000-30 000 $", "Plus de 30 000 $"]} />
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium">Notes complémentaires</label>
                    <textarea rows={4} value={data.notes} onChange={update("notes")} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder="Précisez votre situation ou vos questions..." />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={prev}
                  disabled={step === 0}
                  className="inline-flex items-center gap-2 rounded-full border border-input px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" /> Précédent
                </button>
                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={next}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform hover:scale-[1.02]"
                  >
                    Suivant <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform hover:scale-[1.02]"
                  >
                    Envoyer mon évaluation <CheckCircle2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </form>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Vos informations sont confidentielles et ne servent qu'à préparer votre évaluation.
            </p>
          </>
        )}
      </section>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required, placeholder }: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}{required && <span className="text-primary"> *</span>}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
    </div>
  );
}

function Select({ label, value, onChange, options, required }: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}{required && <span className="text-primary"> *</span>}</label>
      <select
        value={value}
        onChange={onChange}
        required={required}
        className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <option value="">Sélectionner...</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}