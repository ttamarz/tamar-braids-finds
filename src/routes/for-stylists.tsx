import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { ArrowLeft, Heart, Shield, Sparkles } from "lucide-react";

export const Route = createFileRoute("/for-stylists")({
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

const schema = z.object({
  name: z.string().trim().min(2, "Vul je naam in").max(80),
  business: z.string().trim().min(2, "Vul je bedrijfsnaam in").max(80),
  city: z.string().trim().min(2, "In welke stad werk je?").max(60),
  instagram: z
    .string()
    .trim()
    .min(2, "Voeg een Instagram link of handle toe")
    .max(200),
  specialties: z
    .string()
    .trim()
    .min(2, "Welke stijlen doe je?")
    .max(300),
  priceRange: z.enum(["€", "€€", "€€€"], {
    errorMap: () => ({ message: "Kies een prijsklasse" }),
  }),
  email: z.string().trim().email("Vul een geldig e-mailadres in").max(200),
});

type FormValues = z.infer<typeof schema>;

function ForStylists() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { priceRange: "€€" },
  });

  const onSubmit = async (values: FormValues) => {
    // Client-only for now; can be wired to Lovable Cloud later.
    await new Promise((r) => setTimeout(r, 400));
    console.log("Stylist application:", values);
    toast.success("Bedankt! We nemen binnen 5 werkdagen contact op.");
    reset({ priceRange: "€€" } as FormValues);
  };

  const inputCls =
    "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-[color:var(--rose)] focus:ring-2 focus:ring-[color:var(--blush)] transition";

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <Toaster richColors position="top-center" />

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">
        <div className="rounded-[2rem] bg-gradient-to-br from-[color:var(--blush)] via-[color:var(--blush)]/70 to-[color:var(--background)] p-6 sm:p-10 lg:p-14">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-foreground/70 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Terug
          </Link>
          <p className="mt-4 font-[family-name:var(--font-script)] text-3xl sm:text-4xl text-[color:var(--rose)]">
            For stylists
          </p>
          <h1 className="mt-1 font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] max-w-3xl">
            Word ontdekt door <em className="italic">jouw</em> droomklanten.
          </h1>
          <p className="mt-5 text-lg text-foreground/80 max-w-2xl">
            Tamar Finds is een handgekozen directory van vlechters en
            hairstylists in Nederland. We helpen nieuwe klanten jou vinden —
            zonder eindeloos scrollen op Instagram.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-10 grid sm:grid-cols-3 gap-6">
        {[
          {
            icon: Sparkles,
            title: "Gratis listing",
            body: "Aanmelden kost niets. We selecteren handmatig op kwaliteit.",
          },
          {
            icon: Shield,
            title: "Echte reviews",
            body: "Geen nep-sterren — alleen feedback van échte klanten.",
          },
          {
            icon: Heart,
            title: "Lokaal bereik",
            body: "Klanten vinden je via stad, stijl en zoekwoorden.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-2xl bg-card border border-border/60 p-6"
          >
            <div className="h-11 w-11 rounded-full bg-[color:var(--blush)] flex items-center justify-center">
              <f.icon className="h-5 w-5 text-[color:var(--rose)]" />
            </div>
            <h3 className="font-display text-xl mt-4">{f.title}</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {f.body}
            </p>
          </div>
        ))}
      </section>

      {/* FORM */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 mt-12">
        <div className="rounded-[1.5rem] bg-card border border-border/60 p-6 sm:p-10">
          <h2 className="font-display text-3xl">Meld je business aan</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Vul het formulier in. We bekijken je profiel en nemen binnen 5
            werkdagen contact op.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-5">
            <Field label="Naam" error={errors.name?.message}>
              <input
                {...register("name")}
                className={inputCls}
                placeholder="Voornaam Achternaam"
              />
            </Field>

            <Field label="Bedrijfsnaam" error={errors.business?.message}>
              <input
                {...register("business")}
                className={inputCls}
                placeholder="bv. Crowned Beauty"
              />
            </Field>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Stad" error={errors.city?.message}>
                <input
                  {...register("city")}
                  className={inputCls}
                  placeholder="bv. Amsterdam"
                />
              </Field>
              <Field label="Prijsklasse" error={errors.priceRange?.message}>
                <select {...register("priceRange")} className={inputCls}>
                  <option value="€">€ — Budget</option>
                  <option value="€€">€€ — Mid</option>
                  <option value="€€€">€€€ — Premium</option>
                </select>
              </Field>
            </div>

            <Field label="Instagram link of handle" error={errors.instagram?.message}>
              <input
                {...register("instagram")}
                className={inputCls}
                placeholder="@jouwhandle of volledige link"
              />
            </Field>

            <Field
              label="Hairstyle specialiteiten"
              error={errors.specialties?.message}
            >
              <textarea
                {...register("specialties")}
                rows={3}
                className={inputCls}
                placeholder="bv. Knotless, Boho Braids, Goddess Locs"
              />
            </Field>

            <Field label="Contact e-mail" error={errors.email?.message}>
              <input
                type="email"
                {...register("email")}
                className={inputCls}
                placeholder="jij@voorbeeld.nl"
              />
            </Field>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 inline-flex items-center justify-center gap-2 bg-foreground text-background text-sm font-semibold rounded-full px-6 py-3.5 hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {isSubmitting ? "Versturen…" : "Verstuur aanmelding"}
            </button>
          </form>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <span className="mt-1 block text-xs text-[color:var(--rose)]">{error}</span>
      ) : null}
    </label>
  );
}
