import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useCurrentRole() {
  const [role, setRole] = useState<"admin" | "member" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      const userId = data.session?.user.id;
      if (!userId) {
        if (mounted) {
          setRole(null);
          setLoading(false);
        }
        return;
      }

      const { data: member } = await supabase
        .from("team_members")
        .select("role")
        .eq("user_id", userId)
        .single();

      if (mounted) {
        setRole((member?.role as "admin" | "member") ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return { role, isAdmin: role === "admin", loading };
}
