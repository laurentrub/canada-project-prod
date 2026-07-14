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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { consultation_id } = req.body ?? {};
  if (!consultation_id) return res.status(400).json({ error: "consultation_id requis" });

  // Fetch consultation
  const { data: consultation, error: cError } = await supabase
    .from("consultations")
    .select("*")
    .eq("id", consultation_id)
    .single();

  if (cError || !consultation) {
    return res.status(404).json({ error: "Consultation introuvable" });
  }

  // Fetch payment settings
  const { data: settings, error: sError } = await supabase
    .from("payment_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (sError || !settings) {
    return res.status(500).json({ error: "Paramètres de paiement non configurés" });
  }

  const dateFormatted = formatDate(consultation.date);
  const xofAmount = settings.currency === "CAD" && settings.xof_rate
    ? Math.round(settings.amount * settings.xof_rate).toLocaleString("fr-FR")
    : null;
  const amount = `${settings.amount} ${settings.currency}${xofAmount ? ` (≈ ${xofAmount} F CFA)` : ""}`;

  const instructionsHtml = settings.instructions
    ? `<p style="margin:12px 0 0">${settings.instructions.replace(/\n/g, "<br/>")}</p>`
    : "";

  const { error: emailError } = await resend.emails.send({
    from: "Expat Boost <hello@expatboost.com>",
    to: consultation.email,
    subject: `Informations de paiement — Consultation du ${dateFormatted} — Expat Boost`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
        <h1 style="font-size:22px;font-weight:bold">Informations de paiement</h1>
        <p>Bonjour ${consultation.full_name},</p>
        <p>Pour vous éviter les délais et frais d'un virement international vers le Canada, le règlement de votre consultation du <strong>${dateFormatted} à ${consultation.slot} EST</strong> se fait localement, auprès de notre partenaire <strong>${settings.recipient}</strong>, qui transmet ensuite le paiement à Expat Boost.</p>

        <div style="background:#f3f4f6;border-radius:8px;padding:20px;margin:24px 0">
          <p style="margin:0 0 12px;font-weight:bold;font-size:15px">Paiement via notre partenaire local — ${settings.network}</p>
          <table style="border-collapse:collapse;width:100%">
            <tr>
              <td style="padding:6px 10px 6px 0;color:#6b7280;white-space:nowrap">Partenaire</td>
              <td style="padding:6px 0;font-weight:600">${settings.recipient}</td>
            </tr>
            <tr>
              <td style="padding:6px 10px 6px 0;color:#6b7280;white-space:nowrap">Réseau</td>
              <td style="padding:6px 0;font-weight:600">${settings.network}</td>
            </tr>
            <tr>
              <td style="padding:6px 10px 6px 0;color:#6b7280;white-space:nowrap">Numéro</td>
              <td style="padding:6px 0;font-weight:600;font-size:18px;letter-spacing:0.05em">${settings.phone}</td>
            </tr>
            <tr>
              <td style="padding:6px 10px 6px 0;color:#6b7280;white-space:nowrap">Montant</td>
              <td style="padding:6px 0;font-weight:700;font-size:20px;color:#c0392b">${amount}</td>
            </tr>
          </table>
          ${instructionsHtml}
        </div>

        <p>Une fois le paiement effectué, envoyez-nous une capture d'écran de confirmation en répondant à cet email.</p>
        <p>Le lien de visioconférence vous sera transmis dès réception du paiement.</p>

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
        <p style="font-size:13px;color:#6b7280">Expat Boost — Cabinet conseil en immigration canadienne<br/><a href="https://expatboost.com">expatboost.com</a></p>
      </div>
    `,
  });

  if (emailError) {
    console.error("Resend error:", emailError);
    return res.status(500).json({ error: "Échec de l'envoi de l'email" });
  }

  // Log payment email sent
  await supabase
    .from("consultations")
    .update({ payment_email_sent_at: new Date().toISOString() })
    .eq("id", consultation_id);

  return res.status(200).json({ ok: true });
}
