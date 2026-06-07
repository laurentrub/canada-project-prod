import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, ArrowRight, ArrowLeft, ClipboardCheck, ShieldCheck } from "lucide-react";

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
  // Step 1 — Identité
  firstName: string;
  lastName: string;
  email: string;
  emailConfirm: string;
  birthYear: string;
  gender: string;
  nationality: string;
  country: string;
  city: string;
  maritalStatus: string;
  spouseAccompanies: string;
  children: string;
  childrenAccompany: string;
  // Step 2 — Études
  education: string;
  fieldOfStudy: string;
  diplomaCountry: string;
  yearsOfStudy: string;
  ecaDone: string;
  // Step 3 — Langues
  frenchLevel: string;
  frenchTest: string;
  frenchScore: string;
  englishLevel: string;
  englishTest: string;
  englishScore: string;
  // Step 4 — Expérience pro
  experienceYears: string;
  occupation: string;
  nocCategory: string;
  selfEmployed: string;
  managementExperience: string;
  // Step 5 — Liens Canada
  jobOffer: string;
  canadaStudy: string;
  canadaWork: string;
  canadaVisits: string;
  familyInCanada: string;
  familyRelation: string;
  previousApplication: string;
  refusalHistory: string;
  // Step 6 — Projet
  program: string;
  province: string;
  timeline: string;
  budget: string;
  netWorth: string;
  notes: string;
  hearAbout: string;
  consent: boolean;
};

const initialData: FormData = {
  firstName: "", lastName: "", email: "", emailConfirm: "",
  birthYear: "", gender: "", nationality: "", country: "", city: "",
  maritalStatus: "", spouseAccompanies: "", children: "", childrenAccompany: "",
  education: "", fieldOfStudy: "", diplomaCountry: "", yearsOfStudy: "", ecaDone: "",
  frenchLevel: "", frenchTest: "", frenchScore: "",
  englishLevel: "", englishTest: "", englishScore: "",
  experienceYears: "", occupation: "", nocCategory: "", selfEmployed: "", managementExperience: "",
  jobOffer: "", canadaStudy: "", canadaWork: "", canadaVisits: "",
  familyInCanada: "", familyRelation: "", previousApplication: "", refusalHistory: "",
  program: "", province: "", timeline: "", budget: "", netWorth: "",
  notes: "", hearAbout: "", consent: false,
};

const steps = [
  { title: "Identité & famille", desc: "Vos informations personnelles et votre situation familiale" },
  { title: "Études", desc: "Diplômes, domaine d'études et évaluation des diplômes" },
  { title: "Langues officielles", desc: "Vos niveaux de français et d'anglais" },
  { title: "Expérience professionnelle", desc: "Parcours professionnel et compétences" },
  { title: "Liens avec le Canada", desc: "Offre d'emploi, séjours, famille et historique" },
  { title: "Votre projet", desc: "Programme visé, budget et calendrier" },
];

function Evaluation() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initialData);
  const [submitted, setSubmitted] = useState(false);

  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);
  const update = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setData((d) => ({ ...d, [k]: e.target.value } as FormData));

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.email !== data.emailConfirm) {
      alert("Les deux adresses email ne correspondent pas.");
      return;
    }
    if (!data.consent) {
      alert("Veuillez accepter le traitement de vos informations.");
      return;
    }
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6 sm:py-16">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary sm:text-sm">
            <ClipboardCheck className="h-4 w-4" /> Évaluation gratuite
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-5xl">Évaluez votre admissibilité en 5 minutes.</h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Répondez à quelques questions pour que nos conseillers identifient les programmes d'immigration canadiens les mieux adaptés à votre profil.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        {submitted ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-[var(--shadow-card)]">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold">Merci, {data.firstName || "à bientôt"} !</h2>
            <p className="mt-3 text-muted-foreground">
              Votre dossier d'évaluation a bien été enregistré. Un conseiller vous répondra exclusivement par email à <span className="font-semibold text-foreground">{data.email}</span> sous 24 à 72 heures avec une analyse personnalisée de votre admissibilité aux programmes canadiens.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Pensez à vérifier votre dossier de courriers indésirables.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold leading-snug">Étape {step + 1} / {steps.length} — {steps[step].title}</span>
                <span className="shrink-0 text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">{steps[step].desc}</p>
            </div>

            <form onSubmit={submit} className="space-y-6 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-8">
              {step === 0 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Prénom" value={data.firstName} onChange={update("firstName")} required />
                  <Field label="Nom" value={data.lastName} onChange={update("lastName")} required />
                  <Field label="Email" type="email" value={data.email} onChange={update("email")} required placeholder="vous@exemple.com" />
                  <Field label="Confirmez votre email" type="email" value={data.emailConfirm} onChange={update("emailConfirm")} required placeholder="vous@exemple.com" />
                  <Field label="Année de naissance" type="number" value={data.birthYear} onChange={update("birthYear")} required placeholder="1990" />
                  <Select label="Genre" value={data.gender} onChange={update("gender")} options={["Femme", "Homme", "Autre", "Préfère ne pas répondre"]} />
                  <Field label="Nationalité" value={data.nationality} onChange={update("nationality")} required placeholder="Ex. Française, Marocaine..." />
                  <Field label="Pays de résidence actuel" value={data.country} onChange={update("country")} required />
                  <Field label="Ville de résidence" value={data.city} onChange={update("city")} />
                  <Select label="État civil" value={data.maritalStatus} onChange={update("maritalStatus")} options={["Célibataire", "En couple / conjoint de fait", "Marié(e)", "Divorcé(e) / séparé(e)", "Veuf / Veuve"]} required />
                  <Select label="Conjoint vous accompagne ?" value={data.spouseAccompanies} onChange={update("spouseAccompanies")} options={["Sans objet", "Oui", "Non", "À déterminer"]} />
                  <Select label="Nombre d'enfants à charge" value={data.children} onChange={update("children")} options={["Aucun", "1", "2", "3", "4 ou +"]} />
                  <Select label="Enfants vous accompagnent ?" value={data.childrenAccompany} onChange={update("childrenAccompany")} options={["Sans objet", "Tous", "Une partie", "Aucun"]} />
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Select label="Niveau d'études le plus élevé" value={data.education} onChange={update("education")} options={["Aucun diplôme", "Secondaire (lycée)", "Diplôme professionnel / DEP", "Diplôme post-secondaire (1-2 ans)", "Bac / Licence (3-4 ans)", "Maîtrise / Master", "Doctorat / PhD"]} required />
                  <Field label="Domaine d'études" value={data.fieldOfStudy} onChange={update("fieldOfStudy")} placeholder="Ex. Informatique, Santé, Génie..." required />
                  <Field label="Pays d'obtention du diplôme" value={data.diplomaCountry} onChange={update("diplomaCountry")} required />
                  <Select label="Durée totale des études supérieures" value={data.yearsOfStudy} onChange={update("yearsOfStudy")} options={["Moins de 1 an", "1 an", "2 ans", "3 ans", "4 ans", "5 ans ou +"]} />
                  <Select label="Évaluation des diplômes (EDE/ECA) déjà effectuée ?" value={data.ecaDone} onChange={update("ecaDone")} options={["Non", "En cours", "Oui — WES", "Oui — ICAS", "Oui — IQAS", "Oui — autre organisme"]} required />
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Select label="Niveau de français" value={data.frenchLevel} onChange={update("frenchLevel")} options={["Aucun", "Débutant (A1-A2)", "Intermédiaire (B1-B2)", "Avancé (C1-C2)", "Langue maternelle"]} required />
                  <Select label="Test de français passé" value={data.frenchTest} onChange={update("frenchTest")} options={["Aucun", "TEF Canada", "TCF Canada", "DELF / DALF", "Prévu prochainement"]} />
                  <Field label="Score ou date prévue (français)" value={data.frenchScore} onChange={update("frenchScore")} placeholder="Ex. NCLC 7 ou prévu en 2026" />
                  <Select label="Niveau d'anglais" value={data.englishLevel} onChange={update("englishLevel")} options={["Aucun", "Débutant (A1-A2)", "Intermédiaire (B1-B2)", "Avancé (C1-C2)", "Langue maternelle"]} required />
                  <Select label="Test d'anglais passé" value={data.englishTest} onChange={update("englishTest")} options={["Aucun", "IELTS General", "CELPIP General", "PTE Core", "Prévu prochainement"]} />
                  <Field label="Score ou date prévue (anglais)" value={data.englishScore} onChange={update("englishScore")} placeholder="Ex. CLB 9 ou IELTS 7.5" />
                </div>
              )}

              {step === 3 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Select label="Années d'expérience professionnelle qualifiée" value={data.experienceYears} onChange={update("experienceYears")} options={["Aucune", "Moins de 1 an", "1-3 ans", "4-6 ans", "7-10 ans", "Plus de 10 ans"]} required />
                  <Field label="Profession / poste actuel" value={data.occupation} onChange={update("occupation")} required placeholder="Ex. Développeur web, Infirmier..." />
                  <Select label="Catégorie CNP estimée" value={data.nocCategory} onChange={update("nocCategory")} options={["Je ne sais pas", "TEER 0 — gestion", "TEER 1 — professionnel", "TEER 2 — technique / supervision", "TEER 3 — métiers spécialisés", "TEER 4 — intermédiaire", "TEER 5 — élémentaire"]} />
                  <Select label="Expérience en gestion / encadrement" value={data.managementExperience} onChange={update("managementExperience")} options={["Aucune", "Moins de 2 ans", "2-5 ans", "Plus de 5 ans"]} />
                  <Select label="Êtes-vous travailleur autonome / entrepreneur ?" value={data.selfEmployed} onChange={update("selfEmployed")} options={["Non", "Oui, à temps partiel", "Oui, à temps plein", "Propriétaire d'entreprise"]} />
                </div>
              )}

              {step === 4 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Select label="Avez-vous une offre d'emploi au Canada ?" value={data.jobOffer} onChange={update("jobOffer")} options={["Non", "En discussion", "Oui, sans EIMT", "Oui, avec EIMT validée"]} required />
                  <Select label="Avez-vous étudié au Canada ?" value={data.canadaStudy} onChange={update("canadaStudy")} options={["Non", "Moins de 1 an", "1-2 ans", "Plus de 2 ans"]} />
                  <Select label="Avez-vous travaillé au Canada ?" value={data.canadaWork} onChange={update("canadaWork")} options={["Non", "Moins de 1 an", "1-2 ans", "Plus de 2 ans"]} />
                  <Select label="Séjours touristiques au Canada" value={data.canadaVisits} onChange={update("canadaVisits")} options={["Jamais", "1 séjour", "2-3 séjours", "Plus de 3 séjours"]} />
                  <Select label="Famille proche au Canada" value={data.familyInCanada} onChange={update("familyInCanada")} options={["Non", "Oui — citoyen(ne) / résident(e) permanent(e)", "Oui — résident(e) temporaire"]} required />
                  <Field label="Lien de parenté (si applicable)" value={data.familyRelation} onChange={update("familyRelation")} placeholder="Ex. frère, tante, conjoint..." />
                  <Select label="Avez-vous déjà déposé une demande d'immigration canadienne ?" value={data.previousApplication} onChange={update("previousApplication")} options={["Non", "Oui — en cours", "Oui — acceptée", "Oui — abandonnée"]} required />
                  <Select label="Avez-vous déjà eu un refus de visa (tout pays) ?" value={data.refusalHistory} onChange={update("refusalHistory")} options={["Non", "Oui — Canada", "Oui — autre pays", "Oui — plusieurs pays"]} required />
                </div>
              )}

              {step === 5 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Select label="Programme d'immigration visé" value={data.program} onChange={update("program")} options={["Je ne sais pas encore", "Entrée Express — FSW", "Entrée Express — CEC", "Entrée Express — métiers spécialisés", "Programmes provinciaux (PCP / PNP)", "Québec — PRTQ", "Québec — PEQ", "Permis d'études", "Permis de travail (PTET / MIT)", "Parrainage familial", "Immigration des gens d'affaires / investisseurs", "Programme Atlantique / rural / nordique"]} required />
                  <Select label="Province souhaitée" value={data.province} onChange={update("province")} options={["Indifférent", "Québec", "Ontario", "Colombie-Britannique", "Alberta", "Manitoba", "Saskatchewan", "Nouvelle-Écosse", "Nouveau-Brunswick", "Île-du-Prince-Édouard", "Terre-Neuve-et-Labrador", "Yukon / TNO / Nunavut"]} required />
                  <Select label="Délai souhaité pour l'arrivée" value={data.timeline} onChange={update("timeline")} options={["Moins de 6 mois", "6-12 mois", "1-2 ans", "Plus de 2 ans", "Pas encore décidé"]} required />
                  <Select label="Budget pour les démarches" value={data.budget} onChange={update("budget")} options={["Moins de 5 000 $ CAD", "5 000-15 000 $ CAD", "15 000-30 000 $ CAD", "Plus de 30 000 $ CAD"]} required />
                  <Select label="Fonds disponibles pour l'installation" value={data.netWorth} onChange={update("netWorth")} options={["Moins de 10 000 $ CAD", "10 000-25 000 $ CAD", "25 000-50 000 $ CAD", "50 000-100 000 $ CAD", "Plus de 100 000 $ CAD"]} required />
                  <Select label="Comment avez-vous connu Maple Path ?" value={data.hearAbout} onChange={update("hearAbout")} options={["Recherche Google", "Réseaux sociaux", "Recommandation", "Article / blog", "Autre"]} />
                  <div className="sm:col-span-2">
                    <label className="text-base font-medium">Notes complémentaires</label>
                    <textarea rows={4} value={data.notes} onChange={update("notes")} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-base" placeholder="Précisez votre situation, vos motivations ou vos questions..." />
                  </div>
                  <label className="sm:col-span-2 flex items-start gap-3 rounded-lg border border-border bg-secondary/40 p-4 text-base">
                    <input
                      type="checkbox"
                      checked={data.consent}
                      onChange={(e) => setData((d) => ({ ...d, consent: e.target.checked }))}
                      className="mt-1 h-4 w-4 accent-[hsl(var(--primary))]"
                      required
                    />
                    <span className="text-muted-foreground">
                      J'accepte que Maple Path utilise les informations ci-dessus pour évaluer mon admissibilité et me répondre par email. Aucune donnée n'est partagée avec des tiers.
                    </span>
                  </label>
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

            <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" /> Données confidentielles. Réponse uniquement par email — service dédié aux candidats résidant hors du Canada.
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
      <label className="text-sm font-medium sm:text-base">{label}{required && <span className="text-primary"> *</span>}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-input bg-background px-3.5 py-3 text-base focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
      <label className="text-sm font-medium sm:text-base">{label}{required && <span className="text-primary"> *</span>}</label>
      <select
        value={value}
        onChange={onChange}
        required={required}
        className="mt-1.5 w-full rounded-lg border border-input bg-background px-3.5 py-3 text-base focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <option value="">Sélectionner...</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}