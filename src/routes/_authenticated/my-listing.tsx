import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { supabase } from "@/integrations/supabase/client";
import {
  getMyStylist,
  createStylist,
  updateStylist,
  type Stylist,
} from "@/lib/stylists.functions";
import { cities } from "@/data/cities";
import { ShieldCheck, Clock, ArrowLeft, LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated/my-listing")({
  component: MyListing,
  head: () => ({ meta: [{ title: "Mijn listing — Tamar Finds" }] }),
});

type FormState = {
  name: string;
  city: string;
  instagram_url: string;
  image_url: string;
  price_min: string;
  price_max: string;
  specialties: string;
  bio: string;
  email: string;
  booking_url: string;
};

const empty: FormState = {
  name: "",
  city: cities[0]?.name ?? "",
  instagram_url: "",
  image_url: "",
  price_min: "100",
  price_max: "180",
  specialties: "",
  bio: "",
  email: "",
  booking_url: "",
};

function toForm(s: Stylist): FormState {
  return {
    name: s.name,
    city: s.city,
    instagram_url: s.instagram_url ?? "",
    image_url: s.image_url ?? "",
    price_min: String(s.price_min),
    price_max: String(s.price_max),
    specialties: s.specialties.join(", "),
    bio: s.bio ?? "",
    email: s.email ?? "",
    booking_url: s.booking_url ?? "",
  };
}

function fromForm(f: FormState, existing: Stylist | null) {
  return {
    name: f.name.trim(),
    city: f.city.trim(),
    instagram_url: f.instagram_url.trim(),
    image_url: f.image_url.trim(),
    rating: existing?.rating ?? 5,
    reviews_count: existing?.reviews_count ?? 0,
    price_min: Number(f.price_min),
    price_max: Number(f.price_max),
    specialties: f.specialties.split(",").map((s) => s.trim()).filter(Boolean),
    bio: f.bio.trim(),
    email: f.email.trim(),
    booking_url: f.booking_url.trim(),
  };
}

function MyListing() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const getMine = useServerFn(getMyStylist);
  const createFn = useServerFn(createStylist);
  const updateFn = useServerFn(updateStylist);

  const { data: mine, isLoading } = useQuery({
    queryKey: ["my-stylist"],
    queryFn: () => getMine(),
  });

  const [form, setForm] = useState<FormState>(empty);

  useEffect(() => {
    if (mine) setForm(toForm(mine));
  }, [mine]);

  const save = useMutation({
    mutationFn: async () => {
      const values = fromForm(form, mine ?? null);
      if (values.price_max < values.price_min)
        throw new Error("Max prijs moet groter zijn dan min prijs");
      if (mine) await updateFn({ data: { id: mine.id, values } });
      else await createFn({ data: values });
    },
    onSuccess: () => {
      toast.success(mine ? "Bijgewerkt" : "Listing aangemaakt — wacht op verificatie");
      qc.invalidateQueries({ queryKey: ["my-stylist"] });
      qc.invalidateQueries({ queryKey: ["stylists"] });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Opslaan mislukt"),
  });

  async function handleSignOut() {
    await supabase.auth.signOut();
    qc.clear();
    navigate({ to: "/" });
  }

  const inputCls =
    "mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-[color:var(--rose)]";

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <Toaster richColors position="top-center" />

      <section className="mx-auto max-w-3xl px-4 sm:px-6 pt-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Terug
          </Link>
          <button
            onClick={handleSignOut}
            className="text-sm inline-flex items-center gap-2 px-3 py-2 rounded-full hover:bg-muted"
          >
            <LogOut className="h-4 w-4" /> Uitloggen
          </button>
        </div>

        <h1 className="font-display text-4xl mt-4">Mijn listing</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Beheer je eigen profiel. Verificatie en featured-status worden door het Tamar Finds team toegekend.
        </p>

        {mine && (
          <div
            className={`mt-6 rounded-2xl border p-4 text-sm flex items-center gap-3 ${
              mine.verified
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-amber-200 bg-amber-50 text-amber-900"
            }`}
          >
            {mine.verified ? <ShieldCheck className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
            {mine.verified
              ? "Je listing is geverifieerd en zichtbaar voor klanten."
              : "Je listing is zichtbaar als ‘Unverified’. We bekijken je profiel zo snel mogelijk."}
          </div>
        )}

        <div className="mt-6 rounded-[1.5rem] bg-card border border-border/60 p-6 sm:p-8">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Laden…</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                save.mutate();
              }}
              className="grid sm:grid-cols-2 gap-4"
            >
              <Field label="Naam / bedrijf *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required cls={inputCls} />
              <Field
                label="Stad *"
                value={form.city}
                onChange={(v) => setForm({ ...form, city: v })}
                required
                list={cities.map((c) => c.name)}
                cls={inputCls}
              />
              <Field label="Instagram URL" value={form.instagram_url} onChange={(v) => setForm({ ...form, instagram_url: v })} placeholder="https://instagram.com/handle" cls={inputCls} />
              <Field label="Foto / logo URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} placeholder="https://..." cls={inputCls} />
              {form.image_url && (
                <div className="sm:col-span-2">
                  <img src={form.image_url} alt="" className="h-32 rounded-xl object-cover" />
                </div>
              )}
              <Field label="Prijs vanaf (€)" type="number" value={form.price_min} onChange={(v) => setForm({ ...form, price_min: v })} required cls={inputCls} />
              <Field label="Prijs tot (€)" type="number" value={form.price_max} onChange={(v) => setForm({ ...form, price_max: v })} required cls={inputCls} />
              <Field label="Contact e-mail" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="jij@voorbeeld.nl" cls={inputCls} />
              <Field label="Booking link" value={form.booking_url} onChange={(v) => setForm({ ...form, booking_url: v })} placeholder="https://..." cls={inputCls} />
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium">Specialiteiten (komma-gescheiden)</label>
                <input
                  className={inputCls}
                  value={form.specialties}
                  onChange={(e) => setForm({ ...form, specialties: e.target.value })}
                  placeholder="Knotless, Boho Braids, Goddess Locs"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium">Korte bio</label>
                <textarea
                  className={`${inputCls} min-h-28`}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2 flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={save.isPending}
                  className="px-6 py-3 rounded-full bg-foreground text-background text-sm font-semibold disabled:opacity-60"
                >
                  {save.isPending ? "Opslaan…" : mine ? "Wijzigingen opslaan" : "Listing aanmaken"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  list,
  cls,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  list?: string[];
  cls: string;
}) {
  const listId = list ? `list-${label.replace(/\s/g, "")}` : undefined;
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        list={listId}
        className={cls}
      />
      {list && (
        <datalist id={listId}>
          {list.map((v) => (
            <option key={v} value={v} />
          ))}
        </datalist>
      )}
    </label>
  );
}
