import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Clock, User, Video, CreditCard, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/consultation")({
  validateSearch: (search: Record<string, unknown>) => ({
    evaluation: typeof search.evaluation === "string" ? search.evaluation : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Prendre rendez-vous — Expat Boost" },
      { name: "description", content: "Réservez votre consultation en immigration de 60 minutes en visioconférence." },
      { property: "og:title", content: "Prendre rendez-vous — Expat Boost" },
      { property: "og:description", content: "Réservez votre consultation en immigration de 60 minutes en visioconférence." },
      { property: "og:url", content: "https://expatboost.com/consultation" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Expat Boost" },
      { property: "og:image", content: "https://expatboost.com/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Expat Boost — Immigration au Canada simplifiée" },
    ],
    links: [{ rel: "canonical", href: "https://expatboost.com/consultation" }],
  }),
  component: Consultation,
});

const ALL_SLOTS = ["09:00", "10:30", "13:00", "14:30", "16:00"];

function localTimeLabel(date: Date, slot: string, timezone: string) {
  const [h, m] = slot.split(":").map(Number);
  const utcGuess = new Date(`${date.toISOString().slice(0, 10)}T${slot}:00-05:00`);
  try {
    return new Intl.DateTimeFormat("fr-CA", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
    }).format(utcGuess);
  } catch {
    return `${h}:${String(m).padStart(2, "0")}`;
  }
}

function Consultation() {
  const { evaluation } = useSearch({ from: "/consultation" });
  const timezone = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return "America/Toronto";
    }
  }, []);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [slot, setSlot] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>(ALL_SLOTS);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (!evaluation) return;
    fetch(`/api/evaluation-summary?id=${evaluation}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.first_name) setName(`${data.first_name} ${data.last_name ?? ""}`.trim());
        if (data?.email) setEmail(data.email);
      })
      .catch(() => {});
  }, [evaluation]);

  useEffect(() => {
    if (!date) return;
    setSlot(null);
    setLoadingSlots(true);
    const iso = date.toISOString().slice(0, 10);
    fetch(`/api/available-slots?date=${iso}`)
      .then((r) => (r.ok ? r.json() : { slots: ALL_SLOTS }))
      .then((data) => setAvailableSlots(data.slots ?? []))
      .catch(() => setAvailableSlots(ALL_SLOTS))
      .finally(() => setLoadingSlots(false));
  }, [date]);

  if (confirmed && date && slot) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
        <h1 className="mt-6 font-display text-4xl font-bold">Rendez-vous confirmé</h1>
        <p className="mt-4 text-muted-foreground">
          Un email de confirmation et le lien de visioconférence ont été envoyés à <strong>{email}</strong>.
        </p>
        <p className="mt-2 text-muted-foreground">
          {date.toLocaleDateString("fr-CA", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} à {slot} (heure de l'Est, Canada)
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Soit {localTimeLabel(date, slot, timezone)} dans votre fuseau horaire ({timezone})
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
            <Detail icon={<User className="h-4 w-4" />} label="Host" value="Expat Boost — IMMIGRATION" />
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
              <h4 className="text-sm font-semibold">Créneaux disponibles</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Affichés dans votre fuseau horaire ({timezone}) — heure du Canada entre parenthèses
              </p>
              {loadingSlots ? (
                <p className="mt-3 text-sm text-muted-foreground">Chargement des créneaux…</p>
              ) : availableSlots.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">Aucun créneau disponible ce jour-là. Choisissez une autre date.</p>
              ) : (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {availableSlots.map((s) => (
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
                    {date ? localTimeLabel(date, s, timezone) : s}
                    <span className="block text-xs opacity-70">({s} EST)</span>
                  </button>
                ))}
              </div>
              )}
            </div>
          )}

          {date && slot && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setBookingError("");
                setBooking(true);
                const iso = date.toISOString().slice(0, 10);
                const res = await fetch("/api/consultation", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    date: iso,
                    slot,
                    full_name: name,
                    email,
                    evaluation_id: evaluation || null,
                    timezone,
                  }),
                });
                if (res.status === 409) {
                  setBookingError("Ce créneau vient d'être réservé par quelqu'un d'autre. Veuillez en choisir un autre.");
                  setSlot(null);
                  fetch(`/api/available-slots?date=${iso}`)
                    .then((r) => (r.ok ? r.json() : { slots: ALL_SLOTS }))
                    .then((data) => setAvailableSlots(data.slots ?? []))
                    .catch(() => {});
                } else if (!res.ok) {
                  setBookingError("Une erreur est survenue. Veuillez réessayer.");
                } else {
                  setConfirmed(true);
                }
                setBooking(false);
              }}
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
              {bookingError && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{bookingError}</p>
              )}
              <button
                type="submit"
                disabled={booking}
                className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform hover:scale-[1.01] disabled:opacity-50"
              >
                {booking ? "Envoi…" : "Confirmer le rendez-vous — 150 $"}
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