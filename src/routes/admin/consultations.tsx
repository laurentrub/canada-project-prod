import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Consultation = {
  id: string;
  created_at: string;
  date: string;
  slot: string;
  full_name: string;
  email: string;
  status: string;
};

export const Route = createFileRoute("/admin/consultations")({
  component: AdminConsultations,
});

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmé",
  cancelled: "Annulé",
  done: "Terminé",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
  done: "bg-green-100 text-green-700",
};

function AdminConsultations() {
  const [rows, setRows] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRows = async () => {
    const { data } = await supabase
      .from("consultations")
      .select("*")
      .order("date", { ascending: true });
    setRows(data ?? []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("consultations").update({ status }).eq("id", id);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  useEffect(() => { fetchRows(); }, []);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Consultations</h1>
        <p className="mt-1 text-sm text-muted-foreground">{rows.length} rendez-vous</p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucune consultation pour le moment.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Créneau</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(r.date).toLocaleDateString("fr-CA", { weekday: "short", day: "numeric", month: "short" })}
                  </td>
                  <td className="px-4 py-3 font-medium">{r.slot} EST</td>
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{r.full_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={r.status}
                      onChange={(e) => updateStatus(r.id, e.target.value)}
                      className={`rounded-full px-2 py-1 text-xs font-semibold border-0 cursor-pointer ${STATUS_COLORS[r.status]}`}
                    >
                      {Object.entries(STATUS_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${r.email}`} className="text-xs text-primary underline-offset-2 hover:underline">
                      Email
                    </a>
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
