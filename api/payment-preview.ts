import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const { data, error } = await supabase
    .from("payment_settings")
    .select("amount, currency, xof_rate")
    .eq("id", 1)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "Paramètres de paiement introuvables" });
  }

  return res.status(200).json(data);
}
