import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Contact = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  country: string;
  nationality: string;
  program: string;
  message: string;
  status: string;
};

export const Route = createFileRoute("/admin/contacts")({
  component: AdminContacts,
});

const STATUS_LABELS: Record<string, string> = {
  new: "Nouveau",
  in_progress: "En cours",
  done: "Traité",
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  done: "bg-green-100 text-green-700",
};

function AdminContacts() {
  const [rows, setRows] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchRows = async () => {
    const { data } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    setRows(data ?? []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("contact_submissions").update({ status }).eq("id", id);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  useEffect(() => { fetchRows(); }, []);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Contacts</h1>
        <p className="mt-1 text-sm text-muted-foreground">{rows.length} message(s)</p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun message pour le moment.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
              <button
                onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">{r.first_name} {r.last_name}</p>
                    <p className="text-xs text-muted-foreground">{r.email} · {new Date(r.created_at).toLocaleDateString("fr-CA")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={r.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateStatus(r.id, e.target.value)}
                    className={`rounded-full px-2 py-1 text-xs font-semibold border-0 cursor-pointer ${STATUS_COLORS[r.status]}`}
                  >
                    {Object.entries(STATUS_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                  <span className="text-xs text-muted-foreground">{expanded === r.id ? "▲" : "▼"}</span>
                </div>
              </button>

              {expanded === r.id && (
                <div className="border-t border-border px-5 py-4 text-sm space-y-2 text-muted-foreground">
                  <p><span className="font-medium text-foreground">Pays :</span> {r.country}</p>
                  <p><span className="font-medium text-foreground">Nationalité :</span> {r.nationality}</p>
                  <p><span className="font-medium text-foreground">Programme :</span> {r.program}</p>
                  <p><span className="font-medium text-foreground">Message :</span> {r.message}</p>
                  <a href={`mailto:${r.email}`} className="inline-block mt-2 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">
                    Répondre par email
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
