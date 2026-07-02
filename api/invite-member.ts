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

  const { email, role } = req.body ?? {};
  if (!email) return res.status(400).json({ error: "email requis" });
  if (role && role !== "admin" && role !== "member") {
    return res.status(400).json({ error: "role invalide" });
  }

  const { data, error: linkError } = await supabase.auth.admin.generateLink({
    type: "invite",
    email,
    options: {
      redirectTo: "https://expatboost.com/admin-set-password",
    },
  });

  if (linkError || !data?.user) {
    console.error("Generate link error:", linkError);
    return res.status(400).json({ error: linkError?.message ?? "Échec de l'invitation" });
  }

  const { error: insertError } = await supabase
    .from("team_members")
    .insert({ user_id: data.user.id, role: role ?? "member" });

  if (insertError) {
    console.error("team_members insert error:", insertError);
    return res.status(500).json({ error: "Invitation envoyée mais échec de l'ajout à l'équipe" });
  }

  const { error: emailError } = await resend.emails.send({
    from: "Expat Boost <hello@expatboost.com>",
    to: email,
    subject: "Invitation à rejoindre l'espace admin Expat Boost",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
        <h1 style="font-size:22px;font-weight:bold">Invitation à l'espace admin</h1>
        <p>Bonjour,</p>
        <p>Vous avez été invité(e) à rejoindre l'espace admin d'Expat Boost.</p>
        <p style="margin:24px 0">
          <a href="${data.properties.action_link}" style="display:inline-block;background:#c0392b;color:#fff;text-decoration:none;padding:12px 24px;border-radius:999px;font-weight:600">
            Accepter l'invitation
          </a>
        </p>
        <p style="font-size:13px;color:#6b7280">Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br/>${data.properties.action_link}</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
        <p style="font-size:13px;color:#6b7280">Expat Boost — Cabinet conseil en immigration canadienne<br/><a href="https://expatboost.com">expatboost.com</a></p>
      </div>
    `,
  });

  if (emailError) {
    console.error("Resend error:", emailError);
    return res.status(500).json({ error: "Membre ajouté mais échec de l'envoi de l'email" });
  }

  return res.status(200).json({ ok: true });
}
