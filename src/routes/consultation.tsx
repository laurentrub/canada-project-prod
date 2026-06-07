import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Clock, User, Video, CreditCard, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/consultation")({
  head: () => ({
    meta: [
      { title: "Prendre rendez-vous — Maple Path" },
      { name: "description", content: "Réservez votre consultation en immigration de 60 minutes en visioconférence." },
      { property: "og:title", content: "Prendre rendez-vous — Maple Path" },
      { property: "og:description", content: "Réservez votre consultation en immigration de 60 minutes en visioconférence." },
    ],
    links: [{ rel: "canonical", href: "/consultation" }],
  }),
  component: Consultation,
});

const SLOTS = ["09:00", "10:30", "13:00", "14:30", "16:00"];

function Consultation() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [slot, setSlot] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed && date && slot) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
        <h1 className="mt-6 font-display text-4xl font-bold">Rendez-vous confirmé</h1>
        <p className="mt-4 text-muted-foreground">
          Un email de confirmation et le lien de visioconférence ont été envoyés à <strong>{email}</strong>.
        </p>
        <p className="mt-2 text-muted-foreground">
          {date.toLocaleDateString("fr-CA", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} à {slot} (EST)
        </p>
      </section>
    );
  }

  return (
    <div>
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Consultation</p>
          <h1 className="mt-2 font-display text-5xl font-bold">Réservez votre créneau</h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1fr_1.1fr]">
        <div className="space-y-8">
          <div>
            <h2 className="font-display text-2xl font-bold">Consultation en immigration</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Nous sommes heureux que vous ayez choisi notre cabinet pour une consultation
              en matière d'immigration. Nous mettons à votre disposition ce calendrier pour
              vous permettre de choisir un créneau adapté pour la tenue de cette consultation
              en visioconférence.
            </p>
          </div>

          <ul className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <Detail icon={<Clock className="h-4 w-4" />} label="Durée" value="60 minutes" />
            <Detail icon={<User className="h-4 w-4" />} label="Host" value="Maple Path — IMMIGRATION" />
            <Detail icon={<Video className="h-4 w-4" />} label="Lieu" value="Lien de connexion fourni à la confirmation" />
            <Detail icon={<CreditCard className="h-4 w-4" />} label="Paiement" value="150 $ CAD" />
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <h3 className="font-display text-lg font-bold">Choisissez une date</h3>
          <div className="mt-4 flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => { setDate(d); setSlot(null); }}
              disabled={(d) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return d < today || d.getDay() === 0 || d.getDay() === 6;
              }}
              className="pointer-events-auto"
            />
          </div>

          {date && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold">Créneaux disponibles (EST)</h4>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {SLOTS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSlot(s)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      slot === s
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:border-primary/60"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {date && slot && (
            <form
              onSubmit={(e) => { e.preventDefault(); setConfirmed(true); }}
              className="mt-6 space-y-3 border-t border-border pt-6"
            >
              <div>
                <label className="text-sm font-medium">Nom complet</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform hover:scale-[1.01]"
              >
                Confirmer le rendez-vous — 150 $
              </button>
              <p className="text-xs text-muted-foreground text-center">
                Le paiement sera traité après confirmation par email.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 grid h-8 w-8 flex-none place-items-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </span>
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </li>
  );
}