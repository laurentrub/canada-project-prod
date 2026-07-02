import { createFileRoute, Outlet, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { LayoutDashboard, ClipboardList, CalendarCheck, Users, LogOut, Wallet } from "lucide-react";
import { useCurrentRole } from "@/hooks/use-current-role";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const nav = [
  { to: "/admin/evaluations", label: "Évaluations", icon: ClipboardList, adminOnly: false },
  { to: "/admin/contacts", label: "Contacts", icon: LayoutDashboard, adminOnly: false },
  { to: "/admin/consultations", label: "Consultations", icon: CalendarCheck, adminOnly: false },
  { to: "/admin/equipe", label: "Équipe", icon: Users, adminOnly: true },
  { to: "/admin/paiement", label: "Paiement", icon: Wallet, adminOnly: true },
];

const adminOnlyPaths = nav.filter((n) => n.adminOnly).map((n) => n.to);

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const { isAdmin, loading: roleLoading } = useCurrentRole();

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (!data.session) {
        window.location.replace("/admin-login");
      } else {
        setUser(data.session.user);
        setChecking(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (!session) window.location.replace("/admin-login");
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (roleLoading || isAdmin) return;
    if (adminOnlyPaths.some((path) => location.pathname.startsWith(path))) {
      navigate({ to: "/admin/evaluations" });
    }
  }, [roleLoading, isAdmin, location.pathname, navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin-login" });
  };

  if (checking || roleLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-secondary/30">
      {/* Sidebar */}
      <aside className="hidden w-56 flex-col border-r border-border bg-card md:flex">
        <div className="border-b border-border px-5 py-4">
          <p className="font-display text-sm font-bold">Expat Boost</p>
          <p className="text-xs text-muted-foreground">Admin</p>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {nav.filter((n) => !n.adminOnly || isAdmin).map(({ to, label, icon: Icon }) => {
            const active = location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <p className="truncate px-3 text-xs text-muted-foreground">{user?.email}</p>
          <button
            onClick={signOut}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
