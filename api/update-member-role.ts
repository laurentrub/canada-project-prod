import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { user_id, role } = req.body ?? {};
  if (!user_id) return res.status(400).json({ error: "user_id requis" });
  if (role !== "admin" && role !== "member") {
    return res.status(400).json({ error: "role invalide" });
  }

  const { error } = await supabase
    .from("team_members")
    .update({ role })
    .eq("user_id", user_id);

  if (error) {
    console.error("Update role error:", error);
    return res.status(500).json({ error: "Échec de la mise à jour du rôle" });
  }

  return res.status(200).json({ ok: true });
}
