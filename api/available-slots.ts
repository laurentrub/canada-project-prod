import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SLOTS = ["09:00", "10:30", "13:00", "14:30", "16:00"];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const date = typeof req.query.date === "string" ? req.query.date : null;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: "date invalide (format YYYY-MM-DD requis)" });
  }

  const { data: taken, error } = await supabase
    .from("consultations")
    .select("slot")
    .eq("date", date)
    .neq("status", "cancelled");

  if (error) {
    console.error("Available slots error:", error);
    return res.status(500).json({ error: "Échec du chargement des créneaux" });
  }

  const takenSlots = new Set((taken ?? []).map((t) => t.slot));
  const available = SLOTS.filter((s) => !takenSlots.has(s));

  return res.status(200).json({ slots: available });
}
