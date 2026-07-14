import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY);

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

function resultLabel(score: number): { label: string; color: string } {
  if (score >= 70) return { label: "Profil solide, plusieurs voies possibles", color: "#15803d" };
  if (score >= 45) return { label: "Profil intéressant, quelques points à renforcer", color: "#b45309" };
  return { label: "Profil à consolider avant une demande", color: "#b91c1c" };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const adminId = await requireAdmin(req);
  if (!adminId) return res.status(403).json({ error: "Accès réservé aux administrateurs" });

  const { data: rows, error } = await supabase
    .from("evaluations")
    .select("id, first_name, email, score")
    .is("result_email_sent_at", null)
    .not("email", "eq", "test@test.com")
    .not("score", "is", null);

  if (error) {
    console.error("Fetch error:", error);
    return res.status(500).json({ error: "Échec de la lecture des évaluations" });
  }

  let sent = 0;
  let failed = 0;

  for (const row of rows ?? []) {
    const score = row.score as number;
    const { label: resultText, color: resultColor } = resultLabel(score);
    const bookingUrl = `https://expatboost.com/consultation?evaluation=${row.id}`;

    const { error: emailError } = await resend.emails.send({
      from: "Expat Boost <hello@expatboost.com>",
      to: row.email,
      subject: "Votre résultat d'évaluation — Expat Boost",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
          <h1 style="font-size:24px;font-weight:bold">Merci, ${row.first_name} !</h1>
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
    });

    if (emailError) {
      console.error(`Send error for ${row.email}:`, emailError);
      failed++;
      continue;
    }

    await supabase
      .from("evaluations")
      .update({ result_email_sent_at: new Date().toISOString() })
      .eq("id", row.id);
    sent++;
  }

  return res.status(200).json({ ok: true, total: rows?.length ?? 0, sent, failed });
}
