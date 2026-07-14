import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY);

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  const months = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
}

function formatLocalTime(dateIso: string, slot: string, timezone: string | null) {
  if (!timezone) return null;
  try {
    const utcGuess = new Date(`${dateIso}T${slot}:00-05:00`); // créneaux affichés en heure de l'Est (EST, UTC-5)
    return new Intl.DateTimeFormat("fr-CA", {
      timeZone: timezone,
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    }).format(utcGuess);
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { date, slot, full_name, email, evaluation_id, timezone } = req.body ?? {};
  if (!date || !slot || !full_name || !email) {
    return res.status(400).json({ error: "date, slot, full_name et email requis" });
  }

  const { data: taken, error: takenError } = await supabase
    .from("consultations")
    .select("id")
    .eq("date", date)
    .eq("slot", slot)
    .neq("status", "cancelled");

  if (takenError) {
    console.error("Availability check error:", takenError);
    return res.status(500).json({ error: "Échec de la vérification de disponibilité" });
  }
  if (taken && taken.length > 0) {
    return res.status(409).json({ error: "Ce créneau vient d'être réservé. Merci d'en choisir un autre." });
  }

  const { error: dbError } = await supabase.from("consultations").insert({
    date,
    slot,
    full_name,
    email,
    evaluation_id: evaluation_id || null,
    timezone: timezone || null,
  });

  if (dbError) {
    console.error("Supabase error:", dbError);
    return res.status(500).json({ error: "Database error" });
  }

  const dateFormatted = formatDate(date);
  const localTime = formatLocalTime(date, slot, timezone);

  await Promise.allSettled([
    resend.emails.send({
      from: "Expat Boost <hello@expatboost.com>",
      to: "hello@expatboost.com",
      subject: `Nouvelle consultation — ${full_name} le ${dateFormatted} à ${slot} (EST)`,
      html: `
        <h2>Nouvelle demande de consultation</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:6px;font-weight:bold">Nom</td><td style="padding:6px">${full_name}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Email</td><td style="padding:6px"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:6px;font-weight:bold">Date</td><td style="padding:6px">${dateFormatted}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Créneau (EST)</td><td style="padding:6px">${slot}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Fuseau du client</td><td style="padding:6px">${timezone || "Non détecté"}${localTime ? ` — ${localTime}` : ""}</td></tr>
          ${evaluation_id ? `<tr><td style="padding:6px;font-weight:bold">Évaluation liée</td><td style="padding:6px">${evaluation_id}</td></tr>` : ""}
        </table>
        <p>Pensez à envoyer le lien de visioconférence au client avant le rendez-vous.</p>
      `,
    }),
    resend.emails.send({
      from: "Expat Boost <hello@expatboost.com>",
      to: email,
      subject: `Votre consultation du ${dateFormatted} — Expat Boost`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
          <h1 style="font-size:24px;font-weight:bold">Rendez-vous confirmé !</h1>
          <p>Bonjour ${full_name},</p>
          <p>Votre demande de consultation a bien été enregistrée.</p>
          <div style="background:#f3f4f6;border-radius:8px;padding:16px;margin:24px 0">
            <p style="margin:0 0 8px;font-weight:bold">Détails du rendez-vous</p>
            <ul style="margin:0;padding-left:20px;color:#374151;line-height:1.8">
              <li>Date : <strong>${dateFormatted}</strong></li>
              <li>Heure (Canada, heure de l'Est) : <strong>${slot} EST</strong></li>
              ${localTime ? `<li>Heure dans votre fuseau horaire : <strong>${localTime}</strong></li>` : ""}
              <li>Format : <strong>Visioconférence</strong></li>
              <li>Durée : <strong>60 minutes</strong></li>
              <li>Tarif : <strong>150 $ CAD</strong></li>
            </ul>
          </div>
          <p>Le lien de visioconférence et les instructions de paiement vous seront envoyés <strong>avant le rendez-vous</strong>.</p>
          <p>Pour toute question ou modification, répondez directement à cet email.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />
          <p style="font-size:13px;color:#6b7280">Expat Boost — Cabinet conseil en immigration canadienne<br/><a href="https://expatboost.com">expatboost.com</a></p>
        </div>
      `,
    }),
  ]);

  return res.status(200).json({ ok: true });
}
