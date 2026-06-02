import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getCity, type Braider } from "@/data/cities";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Instagram, ArrowLeft, Star, Bookmark, MapPin } from "lucide-react";

export const Route = createFileRoute("/city/$citySlug")({
  loader: ({ params }) => {
    const city = getCity(params.citySlug);
    if (!city) throw notFound();
    return { city };
  },
  head: ({ loaderData }) => {
    const city = loaderData?.city;
    const title = city ? `Vlechters in ${city.name} — Tamar Finds` : "Tamar Finds";
    const description = city
      ? `Ontdek ${city.braiders.length} handgekozen vlechters in ${city.name}.`
      : "";
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
});

function CityPage() {
  const { city } = Route.useLoaderData();

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero */}
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
            <p className="mt-3 text-sm text-white/80">{city.braiders.length} vlechters</p>
          </div>
        </div>
      </section>

      {/* Braiders */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {city.braiders.map((b: Braider) => (
            <article
              key={b.instagram}
              className="group rounded-3xl bg-card border border-border/60 overflow-hidden shadow-sm hover:shadow-[0_20px_60px_-20px_rgba(180,80,120,0.25)] transition-all duration-500 hover:-translate-y-1"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                <img src={b.photo} alt={b.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-[color:var(--blush)]/95 backdrop-blur text-xs font-semibold px-2.5 py-1 rounded-full">
                  <Star className="h-3 w-3 fill-[color:var(--pink)] text-[color:var(--pink)]" />
                  {b.rating.toFixed(1)}
                </span>
                <button aria-label="Save" className="absolute top-3 right-3 h-8 w-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white">
                  <Bookmark className="h-4 w-4" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-display text-2xl text-foreground leading-tight">{b.name}</h2>
                    <p className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" /> {city.name}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs uppercase tracking-[0.18em] text-[color:var(--rose)] font-semibold">
                    vanaf €{b.priceFrom}
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{b.bio}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {b.styles.map((s: string) => (
                    <span key={s} className="text-xs px-3 py-1 rounded-full bg-[color:var(--blush)] text-[color:var(--cocoa)]">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
                  <span className="text-xs text-muted-foreground">{b.reviews} reviews</span>
                  <a
                    href={`https://instagram.com/${b.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-[color:var(--rose)] transition-colors"
                  >
                    <Instagram className="h-4 w-4" />
                    @{b.instagram}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
