import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useSuspenseQuery, useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  createStylist,
  updateStylist,
  deleteStylist,
  checkIsAdmin,
  setStylistFlags,
  type Stylist,
} from "@/lib/stylists.functions";
import { stylistsQueryOptions } from "@/lib/stylistsQuery";
import { supabase } from "@/integrations/supabase/client";
import { cities } from "@/data/cities";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, LogOut, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/stylists")({
  loader: ({ context }) => context.queryClient.ensureQueryData(stylistsQueryOptions),
  component: AdminStylists,
  head: () => ({ meta: [{ title: "Admin · Stylists — Tamar Finds" }] }),
});

type FormState = {
  name: string;
  city: string;
  instagram_url: string;
  image_url: string;
  rating: string;
  reviews_count: string;
  price_min: string;
  price_max: string;
  specialties: string;
  bio: string;
};

const empty: FormState = {
  name: "",
  city: cities[0]?.name ?? "",
  instagram_url: "",
  image_url: "",
  rating: "5",
  reviews_count: "0",
  price_min: "100",
  price_max: "160",
  specialties: "",
  bio: "",
};

function toForm(s: Stylist): FormState {
  return {
    name: s.name,
    city: s.city,
    instagram_url: s.instagram_url ?? "",
    image_url: s.image_url ?? "",
    rating: String(s.rating),
    reviews_count: String(s.reviews_count),
    price_min: String(s.price_min),
    price_max: String(s.price_max),
    specialties: s.specialties.join(", "),
    bio: s.bio ?? "",
  };
}

function fromForm(f: FormState) {
  return {
    name: f.name.trim(),
    city: f.city.trim(),
    instagram_url: f.instagram_url.trim(),
    image_url: f.image_url.trim(),
    rating: Number(f.rating),
    reviews_count: Number(f.reviews_count),
    price_min: Number(f.price_min),
    price_max: Number(f.price_max),
    specialties: f.specialties
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    bio: f.bio.trim(),
  };
}

function AdminStylists() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: stylists } = useSuspenseQuery(stylistsQueryOptions);

  const checkIsAdminFn = useServerFn(checkIsAdmin);
  const adminCheck = useQuery({
    queryKey: ["isAdmin"],
    queryFn: () => checkIsAdminFn(),
  });

  const createFn = useServerFn(createStylist);
  const updateFn = useServerFn(updateStylist);
  const deleteFn = useServerFn(deleteStylist);
  const flagsFn = useServerFn(setStylistFlags);

  const setFlags = useMutation({
    mutationFn: (vars: { id: string; verified?: boolean; featured?: boolean }) =>
      flagsFn({ data: vars }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["stylists"] }),
    onError: (err) => toast.error(err instanceof Error ? err.message : "Update mislukt"),
  });

  const [editing, setEditing] = useState<Stylist | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(empty);

  function startCreate() {
    setEditing(null);
    setForm(empty);
    setCreating(true);
  }
  function startEdit(s: Stylist) {
    setCreating(false);
    setEditing(s);
    setForm(toForm(s));
  }
  function cancel() {
    setCreating(false);
    setEditing(null);
  }

  const mutate = useMutation({
    mutationFn: async () => {
      const values = fromForm(form);
      if (values.price_max < values.price_min)
        throw new Error("Max price moet groter zijn dan min price");
      if (editing) await updateFn({ data: { id: editing.id, values } });
      else await createFn({ data: values });
    },
    onSuccess: () => {
      toast.success(editing ? "Bijgewerkt" : "Toegevoegd");
      qc.invalidateQueries({ queryKey: ["stylists"] });
      cancel();
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Opslaan mislukt"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Verwijderd");
      qc.invalidateQueries({ queryKey: ["stylists"] });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Verwijderen mislukt"),
  });

  async function handleSignOut() {
    await supabase.auth.signOut();
    qc.clear();
    navigate({ to: "/" });
  }

  const isAdmin = adminCheck.data?.isAdmin;

  return (
    <div className="min-h-screen bg-[color:var(--blush)]/30">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Terug naar site
            </Link>
            <h1 className="font-display text-2xl">Admin · Stylists</h1>
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm inline-flex items-center gap-2 px-3 py-2 rounded-full hover:bg-muted"
          >
            <LogOut className="h-4 w-4" /> Uitloggen
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {adminCheck.isLoading ? null : !isAdmin ? (
          <div className="rounded-2xl bg-card border border-border/60 p-6 text-sm">
            Je account heeft geen admin-rechten. De eerste persoon die zich registreert wordt automatisch admin.
          </div>
        ) : null}

        {isAdmin && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">{stylists.length} stylists in totaal</p>
              <button
                onClick={startCreate}
                className="inline-flex items-center gap-2 bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-semibold"
              >
                <Plus className="h-4 w-4" /> Stylist toevoegen
              </button>
            </div>

            <div className="rounded-2xl bg-card border border-border/60 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Stylist</th>
                    <th className="px-4 py-3 font-semibold">Stad</th>
                    <th className="px-4 py-3 font-semibold">Rating</th>
                    <th className="px-4 py-3 font-semibold">Prijs</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {stylists.map((s) => (
                    <tr key={s.id} className="border-t border-border/60">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {s.image_url ? (
                            <img src={s.image_url} alt="" className="h-10 w-10 rounded-full object-cover" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-muted" />
                          )}
                          <span className="font-medium">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{s.city}</td>
                      <td className="px-4 py-3">
                        {Number(s.rating).toFixed(1)} ({s.reviews_count})
                      </td>
                      <td className="px-4 py-3">
                        €{s.price_min}–{s.price_max}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => startEdit(s)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-muted text-xs"
                        >
                          <Pencil className="h-3 w-3" /> Bewerken
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Verwijder ${s.name}?`)) remove.mutate(s.id);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-destructive/10 text-destructive text-xs ml-1"
                        >
                          <Trash2 className="h-3 w-3" /> Verwijderen
                        </button>
                      </td>
                    </tr>
                  ))}
                  {stylists.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                        Nog geen stylists. Klik op "Stylist toevoegen".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      {(creating || editing) && isAdmin && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-border/60 flex items-center justify-between sticky top-0 bg-background">
              <h2 className="font-display text-2xl">
                {editing ? "Stylist bewerken" : "Nieuwe stylist"}
              </h2>
              <button onClick={cancel} className="text-sm text-muted-foreground hover:text-foreground">
                Sluiten
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                mutate.mutate();
              }}
              className="p-6 grid sm:grid-cols-2 gap-4"
            >
              <Field label="Naam *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
              <Field label="Stad *" value={form.city} onChange={(v) => setForm({ ...form, city: v })} required list={cities.map((c) => c.name)} />
              <Field label="Instagram URL" value={form.instagram_url} onChange={(v) => setForm({ ...form, instagram_url: v })} placeholder="https://instagram.com/handle" />
              <Field label="Foto URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} placeholder="https://..." />
              {form.image_url && (
                <div className="sm:col-span-2">
                  <img src={form.image_url} alt="" className="h-32 rounded-xl object-cover" />
                </div>
              )}
              <Field label="Rating (0-5)" type="number" step="0.1" value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} required />
              <Field label="Aantal reviews" type="number" value={form.reviews_count} onChange={(v) => setForm({ ...form, reviews_count: v })} required />
              <Field label="Prijs vanaf (€)" type="number" value={form.price_min} onChange={(v) => setForm({ ...form, price_min: v })} required />
              <Field label="Prijs tot (€)" type="number" value={form.price_max} onChange={(v) => setForm({ ...form, price_max: v })} required />
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium">Specialiteiten (komma-gescheiden)</label>
                <input
                  className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                  value={form.specialties}
                  onChange={(e) => setForm({ ...form, specialties: e.target.value })}
                  placeholder="Knotless, Boho Braids, Goddess Locs"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium">Bio</label>
                <textarea
                  className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm min-h-24"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" onClick={cancel} className="px-5 py-2.5 rounded-full text-sm hover:bg-muted">
                  Annuleren
                </button>
                <button
                  type="submit"
                  disabled={mutate.isPending}
                  className="px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold disabled:opacity-60"
                >
                  {mutate.isPending ? "Opslaan…" : "Opslaan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
  step,
  list,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  step?: string;
  list?: string[];
}) {
  const listId = list ? `list-${label.replace(/\s/g, "")}` : undefined;
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        type={type}
        step={step}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        list={listId}
        className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-[color:var(--rose)]"
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
