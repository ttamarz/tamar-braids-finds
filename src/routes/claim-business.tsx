import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";

export const Route = createFileRoute("/claim-business")({
  component: ClaimBusiness,
});

function ClaimBusiness() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
        <div className="rounded-[2rem] border border-border/60 bg-card p-8 sm:p-10">
          <div className="mb-8">
            <h1 className="font-display text-4xl sm:text-5xl text-foreground">
              Claim This Business
            </h1>
            <p className="mt-3 text-muted-foreground text-base sm:text-lg">
              Is dit jouw salon of braiding business? Dien een claim in en wij nemen contact met je op.
            </p>
          </div>

          <form className="space-y-6">
            <input
              type="text"
              placeholder="Your name"
              className="w-full rounded-full border border-border bg-background px-6 py-4 outline-none"
            />

            <input
              type="email"
              placeholder="Email address"
              className="w-full rounded-full border border-border bg-background px-6 py-4 outline-none"
            />

            <input
              type="text"
              placeholder="Instagram username"
              className="w-full rounded-full border border-border bg-background px-6 py-4 outline-none"
            />

            <textarea
              placeholder="Tell us why you own this business"
              className="min-h-[160px] w-full rounded-[1.5rem] border border-border bg-background px-6 py-4 outline-none"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-full bg-[color:var(--cocoa)] px-8 py-3.5 font-semibold text-white hover:opacity-90"
              >
                Submit Claim
              </button>
            </div>
          </form>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
