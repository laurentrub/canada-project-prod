import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Save, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/admin/profil")({
  component: AdminProfil,
});

function AdminProfil() {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(true);

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session;
      if (!session) {
        setLoading(false);
        return;
      }
      setUserId(session.user.id);
      setEmail(session.user.email ?? "");

      const { data: member } = await supabase
        .from("team_members")
        .select("first_name, last_name")
        .eq("user_id", session.user.id)
        .single();

      if (member) {
        setFirstName(member.first_name ?? "");
        setLastName(member.last_name ?? "");
      }
      setLoading(false);
    });
  }, []);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setSavingProfile(true);
    const { error } = await supabase
      .from("team_members")
      .update({ first_name: firstName, last_name: lastName })
      .eq("user_id", userId);
    setSavingProfile(false);
    if (error) {
      setProfileError("Échec de la mise à jour du profil.");
      return;
    }
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    if (newPassword !== confirmPassword) {
      setPasswordError("Les deux mots de passe ne correspondent pas.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);
    if (error) {
      setPasswordError("Échec de la mise à jour du mot de passe.");
      return;
    }
    setNewPassword("");
    setConfirmPassword("");
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <p className="text-sm text-muted-foreground">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Mon profil</h1>
        <p className="mt-1 text-sm text-muted-foreground">{email}</p>
      </div>

      <form onSubmit={saveProfile} className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <h2 className="text-sm font-semibold">Informations personnelles</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1.5">Prénom</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Nom</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>

        {profileError && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{profileError}</p>
        )}

        <button
          type="submit"
          disabled={savingProfile}
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-60"
        >
          {profileSaved ? (
            <><CheckCircle2 className="h-4 w-4" /> Enregistré</>
          ) : (
            <><Save className="h-4 w-4" /> {savingProfile ? "Enregistrement…" : "Enregistrer"}</>
          )}
        </button>
      </form>

      <form onSubmit={savePassword} className="mt-6 space-y-5 rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <h2 className="text-sm font-semibold">Changer le mot de passe</h2>
        <div>
          <label className="block text-sm font-medium mb-1.5">Nouveau mot de passe</label>
          <input
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Confirmer le mot de passe</label>
          <input
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {passwordError && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{passwordError}</p>
        )}

        <button
          type="submit"
          disabled={savingPassword}
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-60"
        >
          {passwordSaved ? (
            <><CheckCircle2 className="h-4 w-4" /> Mot de passe modifié</>
          ) : (
            <><Save className="h-4 w-4" /> {savingPassword ? "Enregistrement…" : "Changer le mot de passe"}</>
          )}
        </button>
      </form>
    </div>
  );
}
