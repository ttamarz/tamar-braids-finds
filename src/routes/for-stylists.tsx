import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/for-stylists")({
  component: ForStylists,
  head: () => ({ meta: [{ title: "Voor Stylisten — Tamar Finds" }] }),
});

function ForStylists() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);

    const { error } = await (supabase as any).from("stylist_submissions").insert({
      name: String(form.get("name")),
      email: String(form.get("email")),
      city: String(form.get("city")),
      instagram: String(form.get("instagram")),
      specialties: String(form.get("specialties")),
      bio: String(form.get("bio")),
      price_range: String(form.get("price_range")),
      booking_method: String(form.get("booking_method")),
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setSubmitted(true);
    toast.success("Aanvraag verstuurd!");
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
        <div className="rounded-[2rem] border border-border/60 bg-card p-8 sm:p-10">
          <h1 className="font-display text-4xl sm:text-5xl">
            Meld je aan als stylist
          </h1>

          <p className="mt-3 text-muted-foreground">
            Vul je gegevens in. Ik bekijk je aanvraag en voeg je listing handmatig toe aan Tamar Finds.
          </p>

          {submitted ? (
            <div className="mt-8 rounded-[1.5rem] bg-[color:var(--blush)] p-6">
              <p className="font-semibold">Dankjewel! Je aanvraag is ontvangen.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Ik bekijk je gegevens en neem contact met je op als er iets mist.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <input name="name" required placeholder="Naam / business naam" className="w-full rounded-xl border border-border bg-background px-4 py-3" />
              <input name="email" required type="email" placeholder="E-mail" className="w-full rounded-xl border border-border bg-background px-4 py-3" />
              <input name="city" required placeholder="Stad" className="w-full rounded-xl border border-border bg-background px-4 py-3" />
              <input name="instagram" required placeholder="Instagram link of @handle" className="w-full rounded-xl border border-border bg-background px-4 py-3" />
              <input name="specialties" required placeholder="Specialiteiten, bv. knotless, boho, cornrows" className="w-full rounded-xl border border-border bg-background px-4 py-3" />
              <input name="price_range" placeholder="Prijsrange, bv. €80–€180" className="w-full rounded-xl border border-border bg-background px-4 py-3" />
              <input name="booking_method" placeholder="Booking methode, bv. Instagram DM, WhatsApp, website" className="w-full rounded-xl border border-border bg-background px-4 py-3" />
              <textarea name="bio" placeholder="Korte bio / extra info" className="min-h-[120px] w-full rounded-xl border border-border bg-background px-4 py-3" />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-foreground text-background py-3 font-semibold disabled:opacity-60"
              >
                {loading ? "Versturen..." : "Aanvraag versturen"}
              </button>
            </form>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
