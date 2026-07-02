import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import crypto from "node:crypto";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY);

function generatePassword() {
  return crypto.randomBytes(12).toString("base64url");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, role } = req.body ?? {};
  if (!email) return res.status(400).json({ error: "email requis" });
  if (role && role !== "admin" && role !== "member") {
    return res.status(400).json({ error: "role invalide" });
  }

  const password = generatePassword();

  const { data, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError || !data?.user) {
    console.error("Create user error:", createError);
    return res.status(400).json({ error: createError?.message ?? "Échec de la création du compte" });
  }

  const { error: insertError } = await supabase
    .from("team_members")
    .insert({ user_id: data.user.id, role: role ?? "member" });

  if (insertError) {
    console.error("team_members insert error:", insertError);
    await supabase.auth.admin.deleteUser(data.user.id);
    return res.status(500).json({ error: "Échec de l'ajout à l'équipe" });
  }

  const { error: emailError } = await resend.emails.send({
    from: "Expat Boost <hello@expatboost.com>",
    to: email,
    subject: "Votre accès à l'espace admin Expat Boost",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
        <h1 style="font-size:22px;font-weight:bold">Bienvenue sur l'espace admin</h1>
        <p>Bonjour,</p>
        <p>Un compte a été créé pour vous sur l'espace admin d'Expat Boost. Voici vos identifiants de connexion :</p>
        <div style="background:#f3f4f6;border-radius:8px;padding:20px;margin:24px 0">
          <table style="border-collapse:collapse;width:100%">
            <tr>
              <td style="padding:6px 10px 6px 0;color:#6b7280;white-space:nowrap">Email</td>
              <td style="padding:6px 0;font-weight:600">${email}</td>
            </tr>
            <tr>
              <td style="padding:6px 10px 6px 0;color:#6b7280;white-space:nowrap">Mot de passe</td>
              <td style="padding:6px 0;font-weight:700;font-family:monospace;font-size:16px">${password}</td>
            </tr>
          </table>
        </div>
        <p style="margin:24px 0">
          <a href="https://expatboost.com/admin-login" style="display:inline-block;background:#c0392b;color:#fff;text-decoration:none;padding:12px 24px;border-radius:999px;font-weight:600">
            Se connecter
          </a>
        </p>
        <p style="font-size:13px;color:#6b7280">Nous vous recommandons de changer ce mot de passe après votre première connexion.</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
        <p style="font-size:13px;color:#6b7280">Expat Boost — Cabinet conseil en immigration canadienne<br/><a href="https://expatboost.com">expatboost.com</a></p>
      </div>
    `,
  });

  if (emailError) {
    console.error("Resend error:", emailError);
    return res.status(500).json({ error: "Membre créé mais échec de l'envoi de l'email" });
  }

  return res.status(200).json({ ok: true });
}
