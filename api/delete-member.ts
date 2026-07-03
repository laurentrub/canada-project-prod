import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "./lib/auth";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const admin = await requireAdmin(req);
  if (!admin) return res.status(403).json({ error: "Accès réservé aux administrateurs" });

  const { user_id } = req.body ?? {};
  if (!user_id) return res.status(400).json({ error: "user_id requis" });
  if (user_id === admin.userId) return res.status(400).json({ error: "Vous ne pouvez pas supprimer votre propre compte" });

  const { error: deleteError } = await supabase.auth.admin.deleteUser(user_id);

  if (deleteError) {
    console.error("Delete user error:", deleteError);
    return res.status(500).json({ error: "Échec de la suppression du compte" });
  }

  return res.status(200).json({ ok: true });
}
