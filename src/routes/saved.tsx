import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { stylistsQueryOptions } from "@/lib/stylistsQuery";
import { useSavedStylists } from "@/hooks/useSavedStylists";
import { cities } from "@/data/cities";
import { Bookmark, MapPin, Star, Heart } from "lucide-react";

const fallbackImage =
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80";

function priceTier(min: number): string {
  if (min >= 180) return "€€€";
  if (min >= 120) return "€€";
  return "€";
}

function citySlugFor(name: string): string {
  const match = cities.find((c) => c.name.toLowerCase() === name.toLowerCase());
  return match?.slug ?? name.toLowerCase().replace(/\s+/g, "-");
}

export const Route = createFileRoute("/saved")({
  ssr: false,
  loader: ({ context }) => context.queryClient.ensureQueryData(stylistsQueryOptions),
  head: () => ({
    meta: [
      { title: "Saved Stylists — Tamar Finds" },
      { name: "description", content: "Jouw opgeslagen vlechters en hairstylists." },
    ],
  }),
  component: SavedPage,
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-muted-foreground">{error.message}</div>
  ),
  notFoundComponent: () => <div className="p-10 text-center">Niet gevonden.</div>,
});

function SavedPage() {
  const { data: all } = useSuspenseQuery(stylistsQueryOptions);
  const { saved, toggle } = useSavedStylists();
  const items = all.filter((s) => saved.includes(s.id));

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">
        <div className="rounded-[2rem] bg-gradient-to-br from-[color:var(--blush)] via-[color:var(--blush)]/70 to-[color:var(--background)] p-6 sm:p-10">
          <p className="font-[family-name:var(--font-script)] text-3xl sm:text-4xl text-[color:var(--rose)]">
            Saved
          </p>
          <h1 className="mt-1 font-display text-5xl sm:text-6xl leading-[0.95]">
            Jouw <em className="italic">favorieten.</em>
          </h1>
          <p className="mt-4 text-foreground/75">{items.length} opgeslagen stylist{items.length === 1 ? "" : "s"}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-10">
        {items.length === 0 ? (
          <div className="rounded-[1.5rem] bg-card border border-border/60 p-10 text-center">
            <Heart className="h-10 w-10 mx-auto text-[color:var(--rose)]" />
            <p className="font-display text-2xl mt-4">Nog geen opgeslagen stylists</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Tik op het bladwijzer-icoon bij een stylist om ze hier te bewaren.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 bg-foreground text-background text-sm font-semibold rounded-full px-5 py-2.5"
            >
              Discover stylists
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((s) => (
              <div key={s.id} className="group block">
                <Link
                  to="/city/$citySlug"
                  params={{ citySlug: citySlugFor(s.city) }}
                  className="block"
                >
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-muted">
                    <img
                      src={s.image_url || fallbackImage}
                      alt={s.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 bg-[color:var(--blush)]/95 backdrop-blur text-[11px] font-semibold px-2 py-1 rounded-full">
                      <Star className="h-3 w-3 fill-[color:var(--pink)] text-[color:var(--pink)]" />
                      {Number(s.rating).toFixed(1)}
                    </span>
                    <button
                      type="button"
                      aria-label="Remove from saved"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggle(s.id);
                      }}
                      className="absolute top-2 right-2 h-7 w-7 bg-white/90 rounded-full flex items-center justify-center hover:bg-white"
                    >
                      <Bookmark className="h-3.5 w-3.5 fill-[color:var(--rose)] text-[color:var(--rose)]" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-display text-base leading-tight truncate">{s.name}</h3>
                      <p className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" /> {s.city}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[color:var(--rose)] shrink-0">
                      {priceTier(s.price_min)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{s.reviews_count} reviews</p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
