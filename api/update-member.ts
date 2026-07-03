import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const adminId = await requireAdmin(req);
  if (!adminId) return res.status(403).json({ error: "Accès réservé aux administrateurs" });

  const { user_id, role, first_name, last_name } = req.body ?? {};
  if (!user_id) return res.status(400).json({ error: "user_id requis" });
  if (role !== undefined && role !== "admin" && role !== "member") {
    return res.status(400).json({ error: "role invalide" });
  }
  if (!first_name || !last_name) return res.status(400).json({ error: "nom et prénom requis" });

  const { error } = await supabase
    .from("team_members")
    .update({ role, first_name, last_name })
    .eq("user_id", user_id);

  if (error) {
    console.error("Update member error:", error);
    return res.status(500).json({ error: "Échec de la mise à jour du membre" });
  }

  return res.status(200).json({ ok: true });
}
