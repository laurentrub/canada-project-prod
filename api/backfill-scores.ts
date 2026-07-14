import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function requireAdmin(req: VercelRequest): Promise<string | null> {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData?.user) return null;

  const { data: member, error: memberError } = await supabase
    .from("team_members")
    .select("role")
    .eq("user_id", userData.user.id)
    .single();

  if (memberError || member?.role !== "admin") return null;

  return userData.user.id;
}

function computeScore(row: Record<string, string>): number {
  let score = 0;

  const age = new Date().getFullYear() - parseInt(row.birth_year || "0", 10);
  if (age >= 18 && age <= 35) score += 15;
  else if (age <= 45) score += 10;
  else if (age <= 50) score += 5;

  const educationPoints: Record<string, number> = {
    "Doctorat / PhD": 20,
    "Maîtrise / Master": 18,
    "Bac / Licence (3-4 ans)": 15,
    "Diplôme post-secondaire (1-2 ans)": 10,
    "Diplôme professionnel / DEP": 8,
    "Secondaire (lycée)": 4,
    "Aucun diplôme": 0,
  };
  score += educationPoints[row.education] ?? 0;

  const languagePoints: Record<string, number> = {
    "Langue maternelle": 15,
    "Avancé (C1-C2)": 15,
    "Intermédiaire (B1-B2)": 12,
    "Débutant (A1-A2)": 8,
    "Aucun": 3,
  };
  score += languagePoints[row.french_level] ?? 0;
  score += languagePoints[row.english_level] ?? 0;

  const experiencePoints: Record<string, number> = {
    "Plus de 10 ans": 15,
    "7-10 ans": 13,
    "4-6 ans": 10,
    "1-3 ans": 6,
    "Moins de 1 an": 2,
    "Aucune": 0,
  };
  score += experiencePoints[row.experience_years] ?? 0;

  const jobOfferPoints: Record<string, number> = {
    "Oui, avec EIMT validée": 10,
    "Oui, sans EIMT": 7,
    "En discussion": 3,
    "Non": 0,
  };
  score += jobOfferPoints[row.job_offer] ?? 0;

  if (row.canada_study && row.canada_study !== "Non") score += 3;
  if (row.canada_work && row.canada_work !== "Non") score += 4;
  if (row.family_in_canada && row.family_in_canada.startsWith("Oui")) score += 3;

  return Math.min(score, 100);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const adminId = await requireAdmin(req);
  if (!adminId) return res.status(403).json({ error: "Accès réservé aux administrateurs" });

  const { data: rows, error } = await supabase
    .from("evaluations")
    .select("id, birth_year, education, french_level, english_level, experience_years, job_offer, canada_study, canada_work, family_in_canada");

  if (error) {
    console.error("Backfill fetch error:", error);
    return res.status(500).json({ error: "Échec de la lecture des évaluations" });
  }

  let updated = 0;
  for (const row of rows ?? []) {
    const score = computeScore(row as Record<string, string>);
    const { error: updateError } = await supabase
      .from("evaluations")
      .update({ score })
      .eq("id", row.id);
    if (!updateError) updated++;
  }

  return res.status(200).json({ ok: true, total: rows?.length ?? 0, updated });
}
