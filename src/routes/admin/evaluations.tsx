import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Evaluation = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  nationality: string;
  country: string;
  education: string;
  occupation: string;
  program: string;
  status: string;
};

export const Route = createFileRoute("/admin/evaluations")({
  component: AdminEvaluations,
});

const STATUS_LABELS: Record<string, string> = {
  new: "Nouveau",
  in_progress: "En cours",
  done: "Traité",
  rejected: "Rejeté",
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  done: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

function AdminEvaluations() {
  const [rows, setRows] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRows = async () => {
    const { data } = await supabase
      .from("evaluations")
      .select("id, created_at, first_name, last_name, email, nationality, country, education, occupation, program, status")
      .order("created_at", { ascending: false });
    setRows(data ?? []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("evaluations").update({ status }).eq("id", id);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  useEffect(() => { fetchRows(); }, []);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Évaluations</h1>
        <p className="mt-1 text-sm text-muted-foreground">{rows.length} soumission(s)</p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucune évaluation pour le moment.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Nationalité</th>
                <th className="px-4 py-3">Occupation</th>
                <th className="px-4 py-3">Programme visé</th>
                <th className="px-4 py-3">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {new Date(r.created_at).toLocaleDateString("fr-CA")}
                  </td>
                  <td className="px-4 py-3 font-medium whitespace-nowrap">
                    {r.first_name} {r.last_name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r.email}</td>
                  <td className="px-4 py-3">{r.nationality}</td>
                  <td className="px-4 py-3">{r.occupation}</td>
                  <td className="px-4 py-3 max-w-[180px] truncate">{r.program}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
