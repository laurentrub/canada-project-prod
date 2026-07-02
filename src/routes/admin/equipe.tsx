import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2 } from "lucide-react";

type Member = {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
};

export const Route = createFileRoute("/admin/equipe")({
  component: AdminEquipe,
});

function AdminEquipe() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "member">("member");
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/list-members");
      const data = await res.json();
      setMembers(res.ok ? data.members ?? [] : []);
    } catch {
      setMembers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
    supabase.auth.getSession().then(({ data }) => {
      setCurrentUserId(data.session?.user.id ?? null);
    });
  }, []);

  const createMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setMessage(null);

    try {
      const res = await fetch("/api/create-member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail,
          role: newRole,
          first_name: newFirstName,
          last_name: newLastName,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error ?? "Échec de la création du membre" });
      } else {
        setMessage({ type: "success", text: `Membre créé, identifiants envoyés à ${newEmail}.` });
        setNewFirstName("");
        setNewLastName("");
        setNewEmail("");
        setNewRole("member");
        fetchMembers();
      }
    } catch {
      setMessage({ type: "error", text: "Échec de la création du membre" });
    }

    setCreating(false);
  };

  const updateRole = async (userId: string, role: "admin" | "member") => {
    setUpdatingId(userId);
    setMessage(null);

    try {
      const res = await fetch("/api/update-member-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, role }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error ?? "Échec de la mise à jour du rôle" });
      } else {
        fetchMembers();
      }
    } catch {
      setMessage({ type: "error", text: "Échec de la mise à jour du rôle" });
    }

    setUpdatingId(null);
  };

  const deleteMember = async (userId: string) => {
    if (!confirm("Supprimer ce membre ? Il perdra définitivement l'accès à l'espace admin.")) return;

    setDeletingId(userId);
    setMessage(null);

    try {
      const res = await fetch("/api/delete-member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error ?? "Échec de la suppression" });
      } else {
        fetchMembers();
      }
    } catch {
      setMessage({ type: "error", text: "Échec de la suppression" });
    }

    setDeletingId(null);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Équipe</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gérez les membres de l'espace admin.</p>
      </div>

      {/* Create form */}
      <div className="mb-8 rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <h2 className="font-semibold mb-4">Créer un membre</h2>
        <form onSubmit={createMember} className="flex flex-wrap gap-3">
          <input
            type="text"
            required
            placeholder="Prénom"
            value={newFirstName}
            onChange={(e) => setNewFirstName(e.target.value)}
            className="min-w-[140px] flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <input
            type="text"
            required
            placeholder="Nom"
            value={newLastName}
            onChange={(e) => setNewLastName(e.target.value)}
            className="min-w-[140px] flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <input
            type="email"
            required
            placeholder="Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="flex-1 min-w-[200px] rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value as "admin" | "member")}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="member">Membre</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            disabled={creating}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {creating ? "Création…" : "Créer"}
          </button>
        </form>
        {message && (
          <p className={`mt-3 text-sm ${message.type === "success" ? "text-green-600" : "text-destructive"}`}>
            {message.text}
          </p>
        )}
        <p className="mt-2 text-xs text-muted-foreground">
          Un mot de passe est généré automatiquement et envoyé par email au membre, qui peut se connecter immédiatement.
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
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Rôle</th>
                <th className="px-4 py-3">Ajouté le</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <span className="font-medium">
                      {m.first_name || m.last_name ? `${m.first_name ?? ""} ${m.last_name ?? ""}`.trim() : <span className="italic text-muted-foreground">inconnu</span>}
                    </span>
                    {m.user_id === currentUserId && (
                      <span className="ml-2 text-[10px] uppercase text-muted-foreground/70">(vous)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {m.email ?? <span className="italic">inconnu</span>}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={m.role}
                      disabled={updatingId === m.user_id || m.user_id === currentUserId}
                      onChange={(e) => updateRole(m.user_id, e.target.value as "admin" | "member")}
                      className={`rounded-full border-0 px-2 py-1 text-xs font-semibold disabled:opacity-60 ${m.role === "admin" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}
                    >
                      <option value="member">Membre</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(m.created_at).toLocaleDateString("fr-CA")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteMember(m.user_id)}
                      disabled={deletingId === m.user_id || m.user_id === currentUserId}
                      title={m.user_id === currentUserId ? "Vous ne pouvez pas supprimer votre propre compte" : "Supprimer"}
                      className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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
