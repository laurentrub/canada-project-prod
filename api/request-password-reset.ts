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

  const { email } = req.body ?? {};
  if (!email) return res.status(400).json({ error: "email requis" });

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "recovery",
    email,
    options: {
      redirectTo: "https://expatboost.com/reinitialiser-mot-de-passe",
    },
  });

  // Ne jamais révéler si l'email existe ou non — toujours répondre 200
  if (error || !data?.properties?.action_link) {
    return res.status(200).json({ ok: true });
  }

  const { error: emailError } = await resend.emails.send({
    from: "Expat Boost <hello@expatboost.com>",
    to: email,
    subject: "Réinitialisation de votre mot de passe — Expat Boost",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
        <h1 style="font-size:22px;font-weight:bold">Réinitialisation de mot de passe</h1>
        <p>Une demande de réinitialisation de mot de passe a été effectuée pour votre compte sur l'espace admin d'Expat Boost.</p>
        <p style="margin:24px 0">
          <a href="${data.properties.action_link}" style="display:inline-block;background:#c0392b;color:#fff;text-decoration:none;padding:12px 24px;border-radius:999px;font-weight:600">
            Choisir un nouveau mot de passe
          </a>
        </p>
        <p style="font-size:13px;color:#6b7280">Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
        <p style="font-size:13px;color:#6b7280">Expat Boost — Cabinet conseil en immigration canadienne<br/><a href="https://expatboost.com">expatboost.com</a></p>
      </div>
    `,
  });

  if (emailError) {
    console.error("Resend error:", emailError);
  }

  return res.status(200).json({ ok: true });
}
