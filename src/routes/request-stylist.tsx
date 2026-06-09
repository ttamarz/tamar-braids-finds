import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { ArrowLeft, Sparkles } from "lucide-react";
import { submitStylistRequest } from "@/lib/stylistRequests.functions";

export const Route = createFileRoute("/request-stylist")({
  head: () => ({
    meta: [
      { title: "Request a Stylist — Tamar Finds" },
      {
        name: "description",
        content:
          "Vertel ons wat je zoekt en we helpen je een vertrouwde vlechter in de buurt te vinden.",
      },
      { property: "og:title", content: "Request a Stylist — Tamar Finds" },
      {
        property: "og:description",
        content: "Krijg persoonlijke stylist aanbevelingen van Tamar Finds.",
      },
    ],
  }),
  component: RequestStylist,
});

const schema = z.object({
  name: z.string().trim().min(2, "Vul je naam in").max(80),
  email: z.string().trim().email("Vul een geldig e-mailadres in").max(200),
  city: z.string().trim().min(2, "In welke stad?").max(60),
  hairstyle: z.string().trim().min(2, "Welke stijl wil je?").max(200),
  budget: z.enum(["€", "€€", "€€€", "Flexibel"], {
    errorMap: () => ({ message: "Kies een budget" }),
  }),
  notes: z.string().trim().max(1000).optional(),
});

type FormValues = z.infer<typeof schema>;

function RequestStylist() {
  const submit = useServerFn(submitStylistRequest);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { budget: "€€" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await submit({ data: { ...values, notes: values.notes ?? "" } });
      toast.success("Bedankt! We nemen binnen 2 werkdagen contact op.");
      reset({ budget: "€€" } as FormValues);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Er ging iets mis.");
    }
  };

  const inputCls =
    "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-[color:var(--rose)] focus:ring-2 focus:ring-[color:var(--blush)] transition";

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <Toaster richColors position="top-center" />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">
        <div className="rounded-[2rem] bg-gradient-to-br from-[color:var(--blush)] via-[color:var(--blush)]/70 to-[color:var(--background)] p-6 sm:p-10 lg:p-14">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-foreground/70 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Terug
          </Link>
          <p className="mt-4 font-[family-name:var(--font-script)] text-3xl sm:text-4xl text-[color:var(--rose)]">
            Can't find a stylist?
          </p>
          <h1 className="mt-1 font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] max-w-3xl">
            We helpen je <em className="italic">verder.</em>
          </h1>
          <p className="mt-5 text-lg text-foreground/80 max-w-2xl">
            Vertel ons wat je zoekt en we matchen je met een vertrouwde
            vlechter in de buurt.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 mt-12">
        <div className="rounded-[1.5rem] bg-card border border-border/60 p-6 sm:p-10">
          <h2 className="font-display text-3xl inline-flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-[color:var(--pink)]" />
            Request a Stylist
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Vul het formulier in. We sturen je binnen 2 werkdagen persoonlijke
            aanbevelingen.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-5">
            <Field label="Naam" error={errors.name?.message}>
              <input {...register("name")} className={inputCls} placeholder="Voornaam Achternaam" />
            </Field>
            <Field label="E-mail" error={errors.email?.message}>
              <input type="email" {...register("email")} className={inputCls} placeholder="jij@voorbeeld.nl" />
            </Field>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Stad" error={errors.city?.message}>
                <input {...register("city")} className={inputCls} placeholder="bv. Amsterdam" />
              </Field>
              <Field label="Budget" error={errors.budget?.message}>
                <select {...register("budget")} className={inputCls}>
                  <option value="€">€ — Budget</option>
                  <option value="€€">€€ — Mid</option>
                  <option value="€€€">€€€ — Premium</option>
                  <option value="Flexibel">Flexibel</option>
                </select>
              </Field>
            </div>
            <Field label="Hairstyle nodig" error={errors.hairstyle?.message}>
              <input {...register("hairstyle")} className={inputCls} placeholder="bv. Knotless Braids, Goddess Locs" />
            </Field>
            <Field label="Extra notities" error={errors.notes?.message}>
              <textarea {...register("notes")} rows={4} className={inputCls} placeholder="Datum, haarlengte, voorkeuren…" />
            </Field>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 inline-flex items-center justify-center gap-2 bg-foreground text-background text-sm font-semibold rounded-full px-6 py-3.5 hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {isSubmitting ? "Versturen…" : "Verstuur aanvraag"}
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
      {error ? <span className="mt-1 block text-xs text-[color:var(--rose)]">{error}</span> : null}
    </label>
  );
}
