import type { VercelRequest } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getRequestUser(req: VercelRequest) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData?.user) return null;

  return userData.user;
}

export async function requireAuth(req: VercelRequest): Promise<{ userId: string } | null> {
  const user = await getRequestUser(req);
  return user ? { userId: user.id } : null;
}

export async function requireAdmin(req: VercelRequest): Promise<{ userId: string } | null> {
  const user = await getRequestUser(req);
  if (!user) return null;

  const { data: member, error: memberError } = await supabase
    .from("team_members")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (memberError || member?.role !== "admin") return null;

  return { userId: user.id };
}
