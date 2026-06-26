import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const data = req.body;

  const { error: dbError } = await supabase.from("evaluations").insert({
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
  });

  if (dbError) {
    console.error("Supabase error:", dbError);
    return res.status(500).json({ error: "Database error" });
  }

  const programLabel = data.program || "Non précisé";
  const provinceLabel = data.province || "Non précisé";

  await Promise.allSettled([
    resend.emails.send({
      from: "Expat Boost <hello@expatboost.com>",
      to: "hello@expatboost.com",
      subject: `Nouvelle évaluation — ${data.firstName} ${data.lastName} (${data.nationality})`,
      html: `
        <h2>Nouvelle évaluation d'admissibilité</h2>
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
      `,
    }),
    resend.emails.send({
      from: "Expat Boost <hello@expatboost.com>",
      to: data.email,
      subject: "Votre évaluation d'admissibilité — Expat Boost",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
          <h1 style="font-size:24px;font-weight:bold">Merci, ${data.firstName} !</h1>
          <p>Votre dossier d'évaluation a bien été enregistré. Un conseiller analysera votre profil et vous répondra exclusivement par email à <strong>${data.email}</strong> sous <strong>24 à 72 heures ouvrées</strong>.</p>
          <div style="background:#f3f4f6;border-radius:8px;padding:16px;margin:24px 0">
            <p style="margin:0 0 8px;font-weight:bold">Récapitulatif de votre profil</p>
            <ul style="margin:0;padding-left:20px;color:#374151;line-height:1.8">
              <li>Programme visé : <strong>${programLabel}</strong></li>
              <li>Province souhaitée : <strong>${provinceLabel}</strong></li>
              <li>Délai souhaité : <strong>${data.timeline || "Non précisé"}</strong></li>
            </ul>
          </div>
          <p>Pensez à vérifier votre dossier de <strong>courriers indésirables</strong> si vous ne recevez pas de réponse dans ce délai.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />
          <p style="font-size:13px;color:#6b7280">Expat Boost — Cabinet conseil en immigration canadienne<br/><a href="https://expatboost.com">expatboost.com</a></p>
        </div>
      `,
    }),
  ]);

  return res.status(200).json({ ok: true });
}
