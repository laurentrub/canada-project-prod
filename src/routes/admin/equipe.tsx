import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Member = {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
  email?: string;
};

export const Route = createFileRoute("/admin/equipe")({
  component: AdminEquipe,
});

function AdminEquipe() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");
  const [inviting, setInviting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchMembers = async () => {
    const { data } = await supabase.from("team_members").select("*").order("created_at");
    setMembers(data ?? []);
    setLoading(false);
  };

  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    setMessage(null);

    const { error } = await supabase.auth.admin.inviteUserByEmail(inviteEmail);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: `Invitation envoyée à ${inviteEmail}.` });
      setInviteEmail("");
    }

    setInviting(false);
  };

  useEffect(() => { fetchMembers(); }, []);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Équipe</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gérez les membres de l'espace admin.</p>
      </div>

      {/* Invite form */}
      <div className="mb-8 rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <h2 className="font-semibold mb-4">Inviter un membre</h2>
        <form onSubmit={invite} className="flex flex-wrap gap-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="flex-1 min-w-[200px] rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as "admin" | "member")}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="member">Membre</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            disabled={inviting}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {inviting ? "Envoi…" : "Inviter"}
          </button>
        </form>
        {message && (
          <p className={`mt-3 text-sm ${message.type === "success" ? "text-green-600" : "text-destructive"}`}>
            {message.text}
          </p>
        )}
        <p className="mt-2 text-xs text-muted-foreground">
          L'invitation est envoyée par email. Le membre devra définir son mot de passe au premier accès.
        </p>
      </div>

      {/* Members list */}
      {loading ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : members.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun membre ajouté via l'espace admin.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">User ID</th>
                <th className="px-4 py-3">Rôle</th>
                <th className="px-4 py-3">Ajouté le</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{m.user_id}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${m.role === "admin" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                      {m.role === "admin" ? "Admin" : "Membre"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(m.created_at).toLocaleDateString("fr-CA")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
