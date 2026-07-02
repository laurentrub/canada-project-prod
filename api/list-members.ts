import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const { data: members, error } = await supabase
    .from("team_members")
    .select("*")
    .order("created_at");

  if (error) {
    console.error("List members error:", error);
    return res.status(500).json({ error: "Échec du chargement des membres" });
  }

  const enriched = await Promise.all(
    (members ?? []).map(async (m) => {
      const { data } = await supabase.auth.admin.getUserById(m.user_id);
      return { ...m, email: data?.user?.email ?? null };
    })
  );

  return res.status(200).json({ members: enriched });
}
