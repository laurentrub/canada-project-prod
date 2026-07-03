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

  const { network, phone, recipient, amount, currency, instructions } = req.body ?? {};
  if (!network || !phone) return res.status(400).json({ error: "réseau et numéro requis" });

  const { error } = await supabase
    .from("payment_settings")
    .update({
      network,
      phone,
      recipient,
      amount,
      currency,
      instructions,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) {
    console.error("Save payment settings error:", error);
    return res.status(500).json({ error: "Échec de l'enregistrement" });
  }

  return res.status(200).json({ ok: true });
}
