import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "./_lib/auth";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const admin = await requireAdmin(req);
  if (!admin) return res.status(403).json({ error: "Accès réservé aux administrateurs" });

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
