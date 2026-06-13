import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/claim-business")({
  component: ClaimBusiness,
});

function ClaimBusiness() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-4xl">Claim This Business</h1>

      <p className="mt-4 text-muted-foreground">
        Own this listing? Fill in your details below and we'll review your request.
      </p>

      <form className="mt-8 space-y-4">
        <input
          type="text"
          placeholder="Your name"
          className="w-full rounded-xl border p-3"
        />

        <input
          type="email"
          placeholder="Email address"
          className="w-full rounded-xl border p-3"
        />

        <input
          type="text"
          placeholder="Instagram username"
          className="w-full rounded-xl border p-3"
        />

        <textarea
          placeholder="Tell us why you own this business"
          className="w-full rounded-xl border p-3 min-h-[120px]"
        />

        <button
          type="submit"
          className="rounded-full bg-[color:var(--blush)] px-6 py-3 font-semibold"
        >
          Submit Claim
        </button>
      </form>
    </div>
  );
}
