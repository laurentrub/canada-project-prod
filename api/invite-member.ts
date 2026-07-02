import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, role } = req.body ?? {};
  if (!email) return res.status(400).json({ error: "email requis" });
  if (role && role !== "admin" && role !== "member") {
    return res.status(400).json({ error: "role invalide" });
  }

  const { data, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email);

  if (inviteError || !data?.user) {
    console.error("Invite error:", inviteError);
    return res.status(400).json({ error: inviteError?.message ?? "Échec de l'invitation" });
  }

  const { error: insertError } = await supabase
    .from("team_members")
    .insert({ user_id: data.user.id, role: role ?? "member" });

  if (insertError) {
    console.error("team_members insert error:", insertError);
    return res.status(500).json({ error: "Invitation envoyée mais échec de l'ajout à l'équipe" });
  }

  return res.status(200).json({ ok: true });
}
