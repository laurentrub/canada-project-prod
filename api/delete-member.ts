import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { user_id } = req.body ?? {};
  if (!user_id) return res.status(400).json({ error: "user_id requis" });

  const { error: deleteError } = await supabase.auth.admin.deleteUser(user_id);

  if (deleteError) {
    console.error("Delete user error:", deleteError);
    return res.status(500).json({ error: "Échec de la suppression du compte" });
  }

  return res.status(200).json({ ok: true });
}
