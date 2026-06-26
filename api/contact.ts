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

  const { first_name, last_name, email, country, nationality, program, message } = req.body;

  const { error: dbError } = await supabase.from("contact_submissions").insert({
    first_name,
    last_name,
    email,
    country,
    nationality,
    program,
    message,
  });

  if (dbError) {
    console.error("Supabase error:", dbError);
    return res.status(500).json({ error: "Database error" });
  }

  await Promise.allSettled([
    resend.emails.send({
      from: "Expat Boost <hello@expatboost.com>",
      to: "hello@expatboost.com",
      subject: `Nouveau message de contact — ${first_name} ${last_name}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:6px;font-weight:bold">Nom</td><td style="padding:6px">${first_name} ${last_name}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Email</td><td style="padding:6px"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:6px;font-weight:bold">Pays de résidence</td><td style="padding:6px">${country}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Nationalité</td><td style="padding:6px">${nationality}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Programme d'intérêt</td><td style="padding:6px">${program}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Message</td><td style="padding:6px">${message || "—"}</td></tr>
        </table>
      `,
    }),
    resend.emails.send({
      from: "Expat Boost <hello@expatboost.com>",
      to: email,
      subject: "Votre demande de consultation — Expat Boost",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
          <h1 style="font-size:24px;font-weight:bold">Merci, ${first_name} !</h1>
          <p>Nous avons bien reçu votre demande de consultation. Un conseiller vous répondra exclusivement par email sous <strong>24 à 72 heures ouvrées</strong>.</p>
          <p>Si vous ne recevez pas de réponse dans ce délai, pensez à vérifier votre dossier de <strong>courriers indésirables</strong>.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />
          <p style="font-size:13px;color:#6b7280">Expat Boost — Cabinet conseil en immigration canadienne<br/><a href="https://expatboost.com">expatboost.com</a></p>
        </div>
      `,
    }),
  ]);

  return res.status(200).json({ ok: true });
}
