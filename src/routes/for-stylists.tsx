import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import { ArrowLeft, Heart, Shield, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/for-stylists")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "For Stylists — Tamar Finds" },
      {
        name: "description",
        content:
          "Word ontdekt door nieuwe klanten. Meld je vlecht- of hairstyling business gratis aan bij Tamar Finds.",
      },
      { property: "og:title", content: "For Stylists — Tamar Finds" },
      {
        property: "og:description",
        content: "Meld je business aan en bereik nieuwe klanten in Nederland.",
      },
    ],
  }),
  component: ForStylists,
});

function ForStylists() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setAuthed(!!data.user));
  }, []);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <Toaster richColors position="top-center" />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">
        <div className="rounded-[2rem] bg-gradient-to-br from-[color:var(--blush)] via-[color:var(--blush)]/70 to-[color:var(--background)] p-6 sm:p-10 lg:p-14">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-foreground/70 hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Terug
          </Link>
          <p className="mt-4 font-[family-name:var(--font-script)] text-3xl sm:text-4xl text-[color:var(--rose)]">
            For stylists
          </p>
          <h1 className="mt-1 font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] max-w-3xl">
            Word ontdekt door <em className="italic">jouw</em> droomklanten.
          </h1>
          <p className="mt-5 text-lg text-foreground/80 max-w-2xl">
            Tamar Finds is een handgekozen directory van vlechters en hairstylists in Nederland. Maak een account aan,
            vul je listing in, en zodra ons team je profiel verifieert ben je live.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {authed ? (
              <button
                onClick={() => navigate({ to: "/my-listing" })}
                className="inline-flex items-center gap-2 bg-foreground text-background text-sm font-semibold rounded-full px-6 py-3.5"
              >
                Beheer mijn listing <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <>
                <Link
                  to="/auth"
                  search={{ next: "/my-listing" }}
                  className="inline-flex items-center gap-2 bg-foreground text-background text-sm font-semibold rounded-full px-6 py-3.5"
                >
                  Maak gratis account <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/auth"
                  search={{ next: "/my-listing" }}
                  className="inline-flex items-center gap-2 bg-card border border-border text-sm font-semibold rounded-full px-6 py-3.5"
                >
                  Inloggen
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-10 grid sm:grid-cols-3 gap-6">
        {[
          { icon: Sparkles, title: "Gratis listing", body: "Aanmelden kost niets. We selecteren handmatig op kwaliteit." },
          { icon: Shield, title: "Echte reviews", body: "Geen nep-sterren — alleen feedback van échte klanten." },
          { icon: Heart, title: "Lokaal bereik", body: "Klanten vinden je via stad, stijl en zoekwoorden." },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl bg-card border border-border/60 p-6">
            <div className="h-11 w-11 rounded-full bg-[color:var(--blush)] flex items-center justify-center">
              <f.icon className="h-5 w-5 text-[color:var(--rose)]" />
            </div>
            <h3 className="font-display text-xl mt-4">{f.title}</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.body}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 mt-12 mb-16">
        <div className="rounded-[1.5rem] bg-card border border-border/60 p-6 sm:p-10 text-center">
          <h2 className="font-display text-3xl">Hoe werkt het?</h2>
          <ol className="mt-6 grid gap-4 text-left text-sm">
            <li className="flex gap-3"><span className="font-semibold text-[color:var(--rose)]">1.</span> Maak een account aan met je e-mail.</li>
            <li className="flex gap-3"><span className="font-semibold text-[color:var(--rose)]">2.</span> Vul je listing in: naam, stad, Instagram, foto, prijs, specialiteiten en bio.</li>
            <li className="flex gap-3"><span className="font-semibold text-[color:var(--rose)]">3.</span> Je listing verschijnt als <strong>Unverified</strong>. Ons team controleert je profiel.</li>
            <li className="flex gap-3"><span className="font-semibold text-[color:var(--rose)]">4.</span> Eenmaal geverifieerd ben je live en zichtbaar voor klanten.</li>
          </ol>

          <Link
            to="/auth"
            search={{ next: "/my-listing" }}
            className="mt-8 inline-flex items-center gap-2 bg-foreground text-background text-sm font-semibold rounded-full px-6 py-3.5"
          >
            Begin nu <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
