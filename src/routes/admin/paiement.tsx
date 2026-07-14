import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { authFetch } from "@/lib/auth-fetch";
import { Save, CheckCircle2 } from "lucide-react";

type PaymentSettings = {
  network: string;
  phone: string;
  recipient: string;
  amount: number;
  currency: string;
  instructions: string;
  xof_rate: number;
};

function formatXof(amount: number, rate: number) {
  return Math.round(amount * rate).toLocaleString("fr-FR");
}

export const Route = createFileRoute("/admin/paiement")({
  component: AdminPaiement,
});

function AdminPaiement() {
  const [form, setForm] = useState<PaymentSettings>({
    network: "",
    phone: "",
    recipient: "",
    amount: 150,
    currency: "CAD",
    instructions: "",
    xof_rate: 460,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase
      .from("payment_settings")
      .select("*")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (data) {
          setForm({
            network: data.network ?? "",
            phone: data.phone ?? "",
            recipient: data.recipient ?? "",
            amount: data.amount ?? 150,
            currency: data.currency ?? "CAD",
            instructions: data.instructions ?? "",
            xof_rate: data.xof_rate ?? 460,
          });
        }
        setLoading(false);
      });
  }, []);

  const save = async () => {
    setSaving(true);
    const res = await authFetch("/api/save-payment-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <p className="text-sm text-muted-foreground">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Paramètres de paiement</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ces informations sont envoyées aux clients par email depuis la page Consultations.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 md:items-start">
      <div className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        {/* Réseau */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Réseau Mobile Money</label>
          <input
            type="text"
            value={form.network}
            onChange={(e) => setForm({ ...form, network: e.target.value })}
            placeholder="ex: Orange Money, Wave, MTN MoMo…"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Numéro */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Numéro de téléphone</label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="ex: +221 77 000 00 00"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Destinataire */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Nom du destinataire</label>
          <input
            type="text"
            value={form.recipient}
            onChange={(e) => setForm({ ...form, recipient: e.target.value })}
            placeholder="ex: Expat Boost SARL"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Montant + Devise */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1.5">Montant</label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="w-28">
            <label className="block text-sm font-medium mb-1.5">Devise</label>
            <select
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="CAD">CAD</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="XOF">XOF</option>
              <option value="XAF">XAF</option>
              <option value="MAD">MAD</option>
            </select>
          </div>
        </div>

        {/* Taux de conversion XOF */}
        {form.currency === "CAD" && (
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Taux de conversion 1 CAD → XOF (F CFA)
            </label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={form.xof_rate}
              onChange={(e) => setForm({ ...form, xof_rate: parseFloat(e.target.value) || 0 })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Affiché en équivalent F CFA aux clients, en complément du montant en CAD. À mettre à jour selon le taux du marché.
            </p>
          </div>
        )}

        {/* Instructions */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Instructions supplémentaires
            <span className="ml-1 font-normal text-muted-foreground">(optionnel)</span>
          </label>
          <textarea
            rows={4}
            value={form.instructions}
            onChange={(e) => setForm({ ...form, instructions: e.target.value })}
            placeholder="ex: Indiquez votre nom complet en référence du virement…"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
          />
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-60"
        >
          {saved ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Enregistré
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {saving ? "Enregistrement…" : "Enregistrer"}
            </>
          )}
        </button>
      </div>

      {/* Aperçu */}
      {form.network && form.phone && (
        <div className="rounded-xl border border-border bg-secondary/40 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Aperçu de l'email client</p>
          <p className="text-sm font-semibold mb-2">Paiement par {form.network}</p>
          <div className="space-y-1 text-sm">
            <p><span className="text-muted-foreground w-24 inline-block">Réseau</span> {form.network}</p>
            <p><span className="text-muted-foreground w-24 inline-block">Numéro</span> <strong>{form.phone}</strong></p>
            {form.recipient && <p><span className="text-muted-foreground w-24 inline-block">Destinataire</span> {form.recipient}</p>}
            <p>
              <span className="text-muted-foreground w-24 inline-block">Montant</span>{" "}
              <strong className="text-primary">{form.amount} {form.currency}</strong>
              {form.currency === "CAD" && (
                <span className="text-muted-foreground"> (≈ {formatXof(form.amount, form.xof_rate)} F CFA)</span>
              )}
            </p>
          </div>
          {form.instructions && (
            <p className="mt-3 text-sm text-muted-foreground whitespace-pre-line">{form.instructions}</p>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
