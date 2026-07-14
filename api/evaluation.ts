import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY);

function computeScore(data: Record<string, string>): number {
  let score = 0;

  // Âge (max 15)
  const age = new Date().getFullYear() - parseInt(data.birthYear || "0", 10);
  if (age >= 18 && age <= 35) score += 15;
  else if (age <= 45) score += 10;
  else if (age <= 50) score += 5;

  // Études (max 20)
  const educationPoints: Record<string, number> = {
    "Doctorat / PhD": 20,
    "Maîtrise / Master": 18,
    "Bac / Licence (3-4 ans)": 15,
    "Diplôme post-secondaire (1-2 ans)": 10,
    "Diplôme professionnel / DEP": 8,
    "Secondaire (lycée)": 4,
    "Aucun diplôme": 0,
  };
  score += educationPoints[data.education] ?? 0;

  // Langues (français + anglais, max 15 chacun, planchers remontés pour ne pas
  // pénaliser lourdement l'absence d'une langue officielle)
  const languagePoints: Record<string, number> = {
    "Langue maternelle": 15,
    "Avancé (C1-C2)": 15,
    "Intermédiaire (B1-B2)": 12,
    "Débutant (A1-A2)": 8,
    "Aucun": 3,
  };
  score += languagePoints[data.frenchLevel] ?? 0;
  score += languagePoints[data.englishLevel] ?? 0;

  // Expérience professionnelle (max 15)
  const experiencePoints: Record<string, number> = {
    "Plus de 10 ans": 15,
    "7-10 ans": 13,
    "4-6 ans": 10,
    "1-3 ans": 6,
    "Moins de 1 an": 2,
    "Aucune": 0,
  };
  score += experiencePoints[data.experienceYears] ?? 0;

  // Offre d'emploi au Canada (max 10)
  const jobOfferPoints: Record<string, number> = {
    "Oui, avec EIMT validée": 10,
    "Oui, sans EIMT": 7,
    "En discussion": 3,
    "Non": 0,
  };
  score += jobOfferPoints[data.jobOffer] ?? 0;

  // Liens avec le Canada (max 10, cumulable)
  if (data.canadaStudy && data.canadaStudy !== "Non") score += 3;
  if (data.canadaWork && data.canadaWork !== "Non") score += 4;
  if (data.familyInCanada && data.familyInCanada.startsWith("Oui")) score += 3;

  return Math.min(score, 100);
}

function resultLabel(score: number): { label: string; color: string } {
  if (score >= 70) return { label: "Profil solide, plusieurs voies possibles", color: "#15803d" };
  if (score >= 45) return { label: "Profil intéressant, quelques points à renforcer", color: "#b45309" };
  return { label: "Profil à consolider avant une demande", color: "#b91c1c" };
}

function buildSuggestions(data: Record<string, string>): string[] {
  const suggestions: string[] = [];

  const languagePoints: Record<string, number> = {
    "Langue maternelle": 15,
    "Avancé (C1-C2)": 15,
    "Intermédiaire (B1-B2)": 10,
    "Débutant (A1-A2)": 4,
    "Aucun": 0,
  };
  const frenchScore = languagePoints[data.frenchLevel] ?? 0;
  const englishScore = languagePoints[data.englishLevel] ?? 0;
  if (frenchScore < 10 && englishScore < 10) {
    suggestions.push("Passer un test de langue officiel (TEF/TCF ou IELTS/CELPIP) pour faire reconnaître votre niveau et ouvrir plus de programmes.");
  } else if (Math.min(frenchScore, englishScore) < 10) {
    suggestions.push("Renforcer votre seconde langue officielle (français ou anglais) : plusieurs programmes valorisent le bilinguisme.");
  }

  if (!data.ecaDone || data.ecaDone === "Non") {
    suggestions.push("Faire évaluer votre diplôme (EDE/ECA) pour confirmer son équivalence canadienne.");
  }

  if (!data.jobOffer || data.jobOffer === "Non") {
    suggestions.push("Explorer les offres d'emploi ou les programmes provinciaux qui ne nécessitent pas d'offre d'emploi préalable.");
  }

  if ((!data.canadaWork || data.canadaWork === "Non") && (!data.canadaStudy || data.canadaStudy === "Non")) {
    suggestions.push("Envisager un permis d'études ou de travail temporaire : une première expérience au Canada renforce un dossier futur.");
  }

  if (!data.familyInCanada || data.familyInCanada === "Non") {
    suggestions.push("Vérifier les programmes provinciaux de votre région cible : certains valorisent d'autres critères que les liens familiaux.");
  }

  return suggestions.slice(0, 3);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const data = req.body;
  const score = computeScore(data);
  const suggestions = buildSuggestions(data);

  const { data: inserted, error: dbError } = await supabase
    .from("evaluations")
    .insert({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      birth_year: data.birthYear,
      gender: data.gender,
      nationality: data.nationality,
      country: data.country,
      city: data.city,
      marital_status: data.maritalStatus,
      spouse_accompanies: data.spouseAccompanies,
      children: data.children,
      children_accompany: data.childrenAccompany,
      education: data.education,
      field_of_study: data.fieldOfStudy,
      diploma_country: data.diplomaCountry,
      years_of_study: data.yearsOfStudy,
      eca_done: data.ecaDone,
      french_level: data.frenchLevel,
      french_test: data.frenchTest,
      french_score: data.frenchScore,
      english_level: data.englishLevel,
      english_test: data.englishTest,
      english_score: data.englishScore,
      experience_years: data.experienceYears,
      occupation: data.occupation,
      noc_category: data.nocCategory,
      self_employed: data.selfEmployed,
      management_experience: data.managementExperience,
      job_offer: data.jobOffer,
      canada_study: data.canadaStudy,
      canada_work: data.canadaWork,
      canada_visits: data.canadaVisits,
      family_in_canada: data.familyInCanada,
      family_relation: data.familyRelation,
      previous_application: data.previousApplication,
      refusal_history: data.refusalHistory,
      program: data.program,
      province: data.province,
      timeline: data.timeline,
      budget: data.budget,
      net_worth: data.netWorth,
      hear_about: data.hearAbout,
      notes: data.notes,
      consent: data.consent,
      score,
    })
    .select("id")
    .single();

  if (dbError || !inserted) {
    console.error("Supabase error:", dbError);
    return res.status(500).json({ error: "Database error" });
  }

  const programLabel = data.program || "Non précisé";
  const provinceLabel = data.province || "Non précisé";
  const { label: resultText, color: resultColor } = resultLabel(score);
  const bookingUrl = `https://expatboost.com/consultation?evaluation=${inserted.id}`;

  const { data: admins } = await supabase
    .from("team_members")
    .select("user_id")
    .eq("role", "admin");

  const adminEmails = (
    await Promise.all(
      (admins ?? []).map(async (a) => {
        const { data: u } = await supabase.auth.admin.getUserById(a.user_id);
        return u?.user?.email ?? null;
      })
    )
  ).filter((e): e is string => !!e);

  const emailPromises = [
    resend.emails.send({
      from: "Expat Boost <hello@expatboost.com>",
      to: adminEmails.length > 0 ? adminEmails : "hello@expatboost.com",
      subject: `Nouvelle évaluation — ${data.firstName} ${data.lastName} (score ${score}/100)`,
      html: `
        <h2>Nouvelle évaluation d'admissibilité — score ${score}/100</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:6px;font-weight:bold">Nom</td><td style="padding:6px">${data.firstName} ${data.lastName}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Email</td><td style="padding:6px"><a href="mailto:${data.email}">${data.email}</a></td></tr>
          <tr><td style="padding:6px;font-weight:bold">Nationalité</td><td style="padding:6px">${data.nationality}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Pays de résidence</td><td style="padding:6px">${data.country}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Naissance</td><td style="padding:6px">${data.birthYear}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Études</td><td style="padding:6px">${data.education} — ${data.fieldOfStudy}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Français</td><td style="padding:6px">${data.frenchLevel}${data.frenchTest ? ` (${data.frenchTest}${data.frenchScore ? ` — ${data.frenchScore}` : ""})` : ""}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Anglais</td><td style="padding:6px">${data.englishLevel}${data.englishTest ? ` (${data.englishTest}${data.englishScore ? ` — ${data.englishScore}` : ""})` : ""}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Expérience</td><td style="padding:6px">${data.experienceYears} — ${data.occupation}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Programme visé</td><td style="padding:6px">${programLabel}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Province souhaitée</td><td style="padding:6px">${provinceLabel}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Délai</td><td style="padding:6px">${data.timeline}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Budget démarches</td><td style="padding:6px">${data.budget}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Offre d'emploi</td><td style="padding:6px">${data.jobOffer}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Notes</td><td style="padding:6px">${data.notes || "—"}</td></tr>
        </table>
        ${suggestions.length > 0 ? `
          <p style="margin-top:16px;font-weight:bold">Pistes suggérées pour l'entretien</p>
          <ul>${suggestions.map((s) => `<li>${s}</li>`).join("")}</ul>
        ` : ""}
      `,
    }),
    resend.emails.send({
      from: "Expat Boost <hello@expatboost.com>",
      to: data.email,
      subject: "Votre résultat d'évaluation — Expat Boost",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
          <h1 style="font-size:24px;font-weight:bold">Merci, ${data.firstName} !</h1>
          <p>Votre dossier d'évaluation a bien été analysé. Voici un premier aperçu de votre admissibilité :</p>
          <div style="background:#f3f4f6;border-radius:8px;padding:20px;margin:24px 0;text-align:center">
            <p style="margin:0;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em">Score d'admissibilité estimé</p>
            <p style="margin:8px 0 4px;font-size:36px;font-weight:800;color:${resultColor}">${score}/100</p>
            <p style="margin:0;font-weight:600;color:${resultColor}">${resultText}</p>
          </div>
          <p>Un conseiller a identifié plusieurs pistes concrètes pour renforcer votre dossier. Réservez votre consultation personnalisée pour en discuter en détail :</p>
          <p style="margin:24px 0;text-align:center">
            <a href="${bookingUrl}" style="display:inline-block;background:#c0392b;color:#fff;text-decoration:none;padding:14px 28px;border-radius:999px;font-weight:600">
              Réserver ma consultation
            </a>
          </p>
          <p style="font-size:13px;color:#6b7280">Le créneau sera automatiquement affiché dans votre fuseau horaire local.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />
          <p style="font-size:13px;color:#6b7280">Expat Boost — Cabinet conseil en immigration canadienne<br/><a href="https://expatboost.com">expatboost.com</a></p>
        </div>
      `,
    }),
  ];

  const [, prospectResult] = await Promise.allSettled(emailPromises);

  if (prospectResult.status === "fulfilled") {
    await supabase
      .from("evaluations")
      .update({ result_email_sent_at: new Date().toISOString() })
      .eq("id", inserted.id);
  }

  return res.status(200).json({ ok: true, score });
}
