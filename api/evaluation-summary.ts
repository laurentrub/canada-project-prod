import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const id = typeof req.query.id === "string" ? req.query.id : null;
  if (!id) return res.status(400).json({ error: "id requis" });

  const { data, error } = await supabase
    .from("evaluations")
    .select("first_name, last_name, email, score")
    .eq("id", id)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "Évaluation introuvable" });
  }

  return res.status(200).json(data);
}
