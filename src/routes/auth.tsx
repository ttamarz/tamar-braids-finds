import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { toast } from "sonner";

const searchSchema = z.object({
  next: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: searchSchema,
  component: AuthPage,
  head: () => ({ meta: [{ title: "Inloggen — Tamar Finds" }] }),
});

async function resolveDestination(explicit?: string): Promise<string> {
  if (explicit && explicit.startsWith("/")) return explicit;
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return "/";
  const { data: isAdmin } = await supabase.rpc("has_role", {
    _user_id: userData.user.id,
    _role: "admin",
  });
  return isAdmin ? "/admin/stylists" : "/my-listing";
}

function AuthPage() {
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        const to = await resolveDestination(next);
        navigate({ to });
      }
    });
  }, [navigate, next]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
  if (password !== confirmPassword) {
    toast.error("Wachtwoorden komen niet overeen");
    setLoading(false);
    return;
  }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + (next || "/my-listing") },
        });
        if (error) throw error;
        toast.success("Account aangemaakt! Controleer je e-mail om je account te bevestigen.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welkom terug!");
      }
      const to = await resolveDestination(next);
      navigate({ to });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Er ging iets mis");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-md px-4 sm:px-6 pt-12">
        <div className="rounded-[1.5rem] bg-card border border-border/60 p-8">
          <h1 className="font-display text-3xl">{mode === "signin" ? "Inloggen" : "Account aanmaken"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Log in om je eigen stylist-listing te beheren of toegang te krijgen tot het admin-paneel.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-medium">E-mail</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-[color:var(--rose)]"
              />
            <label className="block">
              <span className="text-sm font-medium">Wachtwoord</span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-[color:var(--rose)]"
              />
            </label>
              </label>
            {mode === "signup" && (
  <label className="block">
    <span className="text-sm font-medium">Herhaal wachtwoord</span>
    <input
      type="password"
      required
      minLength={6}
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-[color:var(--rose)]"
    />
  </label>
)}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-foreground text-background py-3 text-sm font-semibold disabled:opacity-60"
            >
              {loading ? "Even geduld…" : mode === "signin" ? "Inloggen" : "Account aanmaken"}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>
                Nog geen account?{" "}
                <button onClick={() => setMode("signup")} className="font-semibold text-foreground underline">
                  Maak er een aan
                </button>
              </>
            ) : (
              <>
                Heb je al een account?{" "}
                <button onClick={() => setMode("signin")} className="font-semibold text-foreground underline">
                  Inloggen
                </button>
              </>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
              ← Terug naar de site
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
