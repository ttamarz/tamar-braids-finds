import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getCity } from "@/data/cities";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { stylistsQueryOptions } from "@/lib/stylistsQuery";
import type { Stylist } from "@/lib/stylists.functions";
import { useSavedStylists } from "@/hooks/useSavedStylists";
import { Instagram, ArrowLeft, Star, Bookmark, MapPin } from "lucide-react";

const fallbackImage =
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80";

export const Route = createFileRoute("/city/$citySlug")({
  loader: async ({ params, context }) => {
    const city = getCity(params.citySlug);
    if (!city) throw notFound();
    await context.queryClient.ensureQueryData(stylistsQueryOptions);
    return { city };
  },
  head: ({ loaderData }) => {
    const city = loaderData?.city;
    const title = city ? `Vlechters in ${city.name} — Tamar Finds` : "Tamar Finds";
    const description = city ? `Ontdek handgekozen vlechters in ${city.name}.` : "";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...(city ? [{ property: "og:image", content: city.cover }] : []),
      ],
    };
  },
  component: CityPage,
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-muted-foreground">{error.message}</div>
  ),
  notFoundComponent: () => <div className="p-10 text-center">Stad niet gevonden.</div>,
});

function CityPage() {
  const { city } = Route.useLoaderData();
  const { data: all } = useSuspenseQuery(stylistsQueryOptions);
  const { isSaved, toggle } = useSavedStylists();
  const stylists = all.filter(
    (s: Stylist) => s.city.toLowerCase() === city.name.toLowerCase()
  );

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">
        <div className="relative overflow-hidden rounded-[2rem] min-h-[340px] sm:min-h-[420px] flex items-end">
          <img src={city.cover} alt={city.name} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
          <div className="relative p-6 sm:p-10 text-white w-full">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/85 hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Alle steden
            </Link>
            <h1 className="font-display text-5xl sm:text-7xl mt-6 text-white">{city.name}</h1>
            <p className="mt-2 font-[family-name:var(--font-script)] text-2xl sm:text-3xl text-white/95 max-w-xl">
              {city.tagline}
            </p>
            <p className="mt-3 text-sm text-white/80">{stylists.length} vlechters</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-10">
        {stylists.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            Nog geen vlechters in {city.name}. Kom snel terug!
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stylists.map((b) => (
              <article
                key={b.id}
                className="group rounded-3xl bg-card border border-border/60 overflow-hidden shadow-sm hover:shadow-[0_20px_60px_-20px_rgba(180,80,120,0.25)] transition-all duration-500 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  <img
                    src={b.image_url || fallbackImage}
                    alt={b.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-[color:var(--blush)]/95 backdrop-blur text-xs font-semibold px-2.5 py-1 rounded-full">
                    <Star className="h-3 w-3 fill-[color:var(--pink)] text-[color:var(--pink)]" />
                    {Number(b.rating).toFixed(1)}
                  </span>
                  {b.featured && (
                    <span className="absolute bottom-3 left-3 bg-[color:var(--rose)] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Featured
                    </span>
                  )}
                  {!b.verified && (
                    <span className="absolute bottom-3 right-3 bg-amber-100 text-amber-900 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Unverified
                    </span>
                  )}
                  <button
                    type="button"
                    aria-label={isSaved(b.id) ? "Remove from saved" : "Save stylist"}
                    onClick={() => toggle(b.id)}
                    className="absolute top-3 right-3 h-8 w-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white"
                  >
                    <Bookmark className={`h-4 w-4 ${isSaved(b.id) ? "fill-[color:var(--rose)] text-[color:var(--rose)]" : ""}`} />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="font-display text-2xl text-foreground leading-tight">{b.name}</h2>
                      <p className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" /> {b.city}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs uppercase tracking-[0.18em] text-[color:var(--rose)] font-semibold">
                      €{b.price_min}{b.price_max > b.price_min ? `–${b.price_max}` : ""}
                    </span>
                  </div>
                  {b.bio && <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{b.bio}</p>}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {b.specialties.map((s) => (
                      <span key={s} className="text-xs px-3 py-1 rounded-full bg-[color:var(--blush)] text-[color:var(--cocoa)]">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
                    <span className="text-xs text-muted-foreground">{b.reviews_count} reviews</span>
                    {b.instagram_url && (
                      <a
                        href={b.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-[color:var(--rose)] transition-colors"
                      >
                        <Instagram className="h-4 w-4" />
                        Instagram
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
