import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Evaluation = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  birth_year: string;
  gender: string;
  nationality: string;
  country: string;
  city: string;
  marital_status: string;
  spouse_accompanies: string;
  children: string;
  children_accompany: string;
  education: string;
  field_of_study: string;
  diploma_country: string;
  years_of_study: string;
  eca_done: string;
  french_level: string;
  french_test: string;
  french_score: string;
  english_level: string;
  english_test: string;
  english_score: string;
  experience_years: string;
  occupation: string;
  noc_category: string;
  self_employed: string;
  management_experience: string;
  job_offer: string;
  canada_study: string;
  canada_work: string;
  canada_visits: string;
  family_in_canada: string;
  family_relation: string;
  previous_application: string;
  refusal_history: string;
  program: string;
  province: string;
  timeline: string;
  budget: string;
  net_worth: string;
  hear_about: string;
  notes: string;
  consent: boolean;
  status: string;
};

export const Route = createFileRoute("/admin/evaluations")({
  component: AdminEvaluations,
});

const STATUS_LABELS: Record<string, string> = {
  new: "Nouveau",
  in_progress: "En cours",
  done: "Traité",
  rejected: "Rejeté",
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  done: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

function Field({ label, value }: { label: string; value?: string | boolean | null }) {
  if (!value && value !== false) return null;
  return (
    <div>
      <span className="font-medium text-foreground">{label} : </span>
      <span>{String(value)}</span>
    </div>
  );
}

function AdminEvaluations() {
  const [rows, setRows] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchRows = async () => {
    const { data } = await supabase
      .from("evaluations")
      .select("*")
      .order("created_at", { ascending: false });
    setRows(data ?? []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("evaluations").update({ status }).eq("id", id);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  useEffect(() => { fetchRows(); }, []);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Évaluations</h1>
        <p className="mt-1 text-sm text-muted-foreground">{rows.length} soumission(s)</p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucune évaluation pour le moment.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
              <button
                onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <div>
                  <p className="font-medium">{r.first_name} {r.last_name}</p>
                  <p className="text-xs text-muted-foreground">{r.email} · {new Date(r.created_at).toLocaleDateString("fr-CA")} · {r.nationality}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <select
                    value={r.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateStatus(r.id, e.target.value)}
                    className={`rounded-full px-2 py-1 text-xs font-semibold border-0 cursor-pointer ${STATUS_COLORS[r.status]}`}
                  >
                    {Object.entries(STATUS_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                  <span className="text-xs text-muted-foreground">{expanded === r.id ? "▲" : "▼"}</span>
                </div>
              </button>

              {expanded === r.id && (
                <div className="border-t border-border px-5 py-4 text-sm text-muted-foreground space-y-4">
                  <section>
                    <p className="mb-2 font-semibold text-foreground text-xs uppercase tracking-wider">Identité & famille</p>
                    <div className="grid gap-1 sm:grid-cols-2">
                      <Field label="Année de naissance" value={r.birth_year} />
                      <Field label="Genre" value={r.gender} />
                      <Field label="Nationalité" value={r.nationality} />
                      <Field label="Pays de résidence" value={r.country} />
                      <Field label="Ville" value={r.city} />
                      <Field label="État civil" value={r.marital_status} />
                      <Field label="Conjoint accompagne" value={r.spouse_accompanies} />
                      <Field label="Enfants" value={r.children} />
                      <Field label="Enfants accompagnent" value={r.children_accompany} />
                    </div>
                  </section>
                  <section>
                    <p className="mb-2 font-semibold text-foreground text-xs uppercase tracking-wider">Études</p>
                    <div className="grid gap-1 sm:grid-cols-2">
                      <Field label="Niveau" value={r.education} />
                      <Field label="Domaine" value={r.field_of_study} />
                      <Field label="Pays du diplôme" value={r.diploma_country} />
                      <Field label="Durée études" value={r.years_of_study} />
                      <Field label="ECA/EDE" value={r.eca_done} />
                    </div>
                  </section>
                  <section>
                    <p className="mb-2 font-semibold text-foreground text-xs uppercase tracking-wider">Langues</p>
                    <div className="grid gap-1 sm:grid-cols-2">
                      <Field label="Français" value={r.french_level} />
                      <Field label="Test français" value={r.french_test} />
                      <Field label="Score français" value={r.french_score} />
                      <Field label="Anglais" value={r.english_level} />
                      <Field label="Test anglais" value={r.english_test} />
                      <Field label="Score anglais" value={r.english_score} />
                    </div>
                  </section>
                  <section>
                    <p className="mb-2 font-semibold text-foreground text-xs uppercase tracking-wider">Expérience pro</p>
                    <div className="grid gap-1 sm:grid-cols-2">
                      <Field label="Années d'expérience" value={r.experience_years} />
                      <Field label="Occupation" value={r.occupation} />
                      <Field label="Catégorie CNP" value={r.noc_category} />
                      <Field label="Travailleur autonome" value={r.self_employed} />
                      <Field label="Gestion" value={r.management_experience} />
                    </div>
                  </section>
                  <section>
                    <p className="mb-2 font-semibold text-foreground text-xs uppercase tracking-wider">Liens avec le Canada</p>
                    <div className="grid gap-1 sm:grid-cols-2">
                      <Field label="Offre d'emploi" value={r.job_offer} />
                      <Field label="Études au Canada" value={r.canada_study} />
                      <Field label="Travail au Canada" value={r.canada_work} />
                      <Field label="Séjours touristiques" value={r.canada_visits} />
                      <Field label="Famille au Canada" value={r.family_in_canada} />
                      <Field label="Lien de parenté" value={r.family_relation} />
                      <Field label="Demande précédente" value={r.previous_application} />
                      <Field label="Refus de visa" value={r.refusal_history} />
                    </div>
                  </section>
                  <section>
                    <p className="mb-2 font-semibold text-foreground text-xs uppercase tracking-wider">Projet</p>
                    <div className="grid gap-1 sm:grid-cols-2">
                      <Field label="Programme visé" value={r.program} />
                      <Field label="Province" value={r.province} />
                      <Field label="Délai" value={r.timeline} />
                      <Field label="Budget démarches" value={r.budget} />
                      <Field label="Fonds disponibles" value={r.net_worth} />
                      <Field label="Comment connu" value={r.hear_about} />
                    </div>
                  </section>
                  {r.notes && (
                    <section>
                      <p className="mb-1 font-semibold text-foreground text-xs uppercase tracking-wider">Notes</p>
                      <p>{r.notes}</p>
                    </section>
                  )}
                  <a href={`mailto:${r.email}`} className="inline-block mt-2 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">
                    Répondre par email
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
