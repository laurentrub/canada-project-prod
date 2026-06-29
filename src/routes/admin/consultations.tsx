import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

type Consultation = {
  id: string;
  created_at: string;
  date: string;
  slot: string;
  full_name: string;
  email: string;
  status: string;
  payment_email_sent_at: string | null;
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
  const [expanded, setExpanded] = useState<string | null>(null);
  const [sending, setSending] = useState<string | null>(null);
  const [sendResult, setSendResult] = useState<Record<string, "ok" | "error">>({});

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

  const sendPaymentEmail = async (id: string) => {
    setSending(id);
    try {
      const res = await fetch("/api/send-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consultation_id: id }),
      });
      if (res.ok) {
        setSendResult((prev) => ({ ...prev, [id]: "ok" }));
        setRows((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, payment_email_sent_at: new Date().toISOString() } : r
          )
        );
      } else {
        setSendResult((prev) => ({ ...prev, [id]: "error" }));
      }
    } catch {
      setSendResult((prev) => ({ ...prev, [id]: "error" }));
    }
    setSending(null);
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
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
              <button
                onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <div>
                  <p className="font-medium">{r.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(r.date).toLocaleDateString("fr-CA", { weekday: "short", day: "numeric", month: "short" })} · {r.slot} EST · {r.email}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {r.payment_email_sent_at && (
                    <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                      <CheckCircle2 className="h-3 w-3" /> Paiement envoyé
                    </span>
                  )}
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
                <div className="border-t border-border px-5 py-4 text-sm text-muted-foreground space-y-2">
                  <p><span className="font-medium text-foreground">Client :</span> {r.full_name}</p>
                  <p><span className="font-medium text-foreground">Email :</span> {r.email}</p>
                  <p><span className="font-medium text-foreground">Date :</span> {new Date(r.date).toLocaleDateString("fr-CA", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
                  <p><span className="font-medium text-foreground">Créneau :</span> {r.slot} EST</p>
                  <p><span className="font-medium text-foreground">Soumis le :</span> {new Date(r.created_at).toLocaleDateString("fr-CA")}</p>

                  {r.payment_email_sent_at && (
                    <p className="text-xs text-green-700">
                      <CheckCircle2 className="inline h-3.5 w-3.5 mr-1" />
                      Infos de paiement envoyées le {new Date(r.payment_email_sent_at).toLocaleDateString("fr-CA")} à {new Date(r.payment_email_sent_at).toLocaleTimeString("fr-CA", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={`mailto:${r.email}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground"
                    >
                      Envoyer le lien de visio
                    </a>

                    <button
                      onClick={() => sendPaymentEmail(r.id)}
                      disabled={sending === r.id}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary disabled:opacity-60"
                    >
                      {sending === r.id ? (
                        <>Envoi…</>
                      ) : sendResult[r.id] === "ok" ? (
                        <><CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> Envoyé !</>
                      ) : sendResult[r.id] === "error" ? (
                        <><AlertCircle className="h-3.5 w-3.5 text-red-500" /> Échec</>
                      ) : (
                        <><Send className="h-3.5 w-3.5" /> {r.payment_email_sent_at ? "Renvoyer les infos de paiement" : "Envoyer les infos de paiement"}</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
