import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getCity } from "@/data/cities";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Instagram, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/city/$citySlug")({
  loader: ({ params }) => {
    const city = getCity(params.citySlug);
    if (!city) throw notFound();
    return { city };
  },
  head: ({ loaderData }) => {
    const city = loaderData?.city;
    const title = city
      ? `Braiders in ${city.name} — Tamar Finds`
      : "Tamar Finds";
    const description = city
      ? `Discover ${city.braiders.length} hand-picked braiders in ${city.name}, ${city.state}. Styles, prices, and Instagram links.`
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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={city.cover}
            alt={`${city.name}`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-background" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-32 sm:pt-24 sm:pb-44 text-white">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            All cities
          </Link>
          <p className="mt-10 text-xs uppercase tracking-[0.25em] text-white/80">
            {city.state}
          </p>
          <h1 className="font-display text-6xl sm:text-8xl mt-2 text-white">
            {city.name}
          </h1>
          <p className="mt-4 font-display italic text-xl sm:text-2xl text-white/90 max-w-xl">
            {city.tagline}
          </p>
        </div>
      </section>

      {/* Braiders */}
      <section className="mx-auto max-w-6xl px-6 -mt-20 relative z-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {city.braiders.map((b) => (
            <article
              key={b.instagram}
              className="group rounded-3xl bg-card border border-border/60 overflow-hidden shadow-sm hover:shadow-[0_20px_60px_-20px_rgba(120,40,50,0.2)] transition-all duration-500 hover:-translate-y-1"
            >
              <div className="aspect-[4/5] overflow-hidden bg-muted">
                <img
                  src={b.photo}
                  alt={b.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-2xl text-foreground leading-tight">
                    {b.name}
                  </h2>
                  <span className="shrink-0 text-xs uppercase tracking-[0.18em] text-[color:var(--rose)] font-medium">
                    from ${b.priceFrom}
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {b.bio}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {b.styles.map((s) => (
                    <span
                      key={s}
                      className="text-xs px-3 py-1 rounded-full bg-[color:var(--blush)] text-[color:var(--cocoa)]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <a
                  href={`https://instagram.com/${b.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-[color:var(--rose)] transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                  @{b.instagram}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
