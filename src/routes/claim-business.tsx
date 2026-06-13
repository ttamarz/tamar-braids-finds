import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/claim-business")({
  validateSearch: (search) => ({
    stylistId: typeof search.stylistId === "string" ? search.stylistId : "",
  }),
  component: ClaimBusiness,
});

function ClaimBusiness() {
  const { stylistId } = Route.useSearch();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);

    const { error } = await supabase.from("business_claims").insert({
      stylist_id: stylistId || null,
      name: String(form.get("name")),
      email: String(form.get("email")),
      instagram: String(form.get("instagram")),
      message: String(form.get("message")),
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setSubmitted(true);
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
        <div className="rounded-[2rem] border border-border/60 bg-card p-8 sm:p-10">
          <h1 className="font-display text-4xl sm:text-5xl text-foreground">
            Claim This Business
          </h1>

          <p className="mt-3 text-muted-foreground text-base sm:text-lg">
            Is dit jouw salon of braiding business? Dien een claim in en wij nemen contact met je op.
          </p>

          {submitted ? (
            <div className="mt-8 rounded-[1.5rem] bg-[color:var(--blush)] p-6">
              <p className="font-semibold">Thanks! Your claim has been received.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                We’ll review it and contact you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <input name="name" required placeholder="Your name" className="w-full rounded-full border border-border bg-background px-6 py-4 outline-none" />
              <input name="email" required type="email" placeholder="Email address" className="w-full rounded-full border border-border bg-background px-6 py-4 outline-none" />
              <input name="instagram" placeholder="Instagram username" className="w-full rounded-full border border-border bg-background px-6 py-4 outline-none" />
              <textarea name="message" required placeholder="Tell us why you own this business" className="min-h-[160px] w-full rounded-[1.5rem] border border-border bg-background px-6 py-4 outline-none" />

              <div className="flex justify-end">
                <button disabled={loading} type="submit" className="rounded-full bg-[color:var(--cocoa)] px-8 py-3.5 font-semibold text-white hover:opacity-90">
                  {loading ? "Submitting..." : "Submit Claim"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
