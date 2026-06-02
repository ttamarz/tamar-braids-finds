import { createFileRoute, Link } from "@tanstack/react-router";
import { cities } from "@/data/cities";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tamar Finds — Braiders, city by city" },
      {
        name: "description",
        content:
          "A hand-curated directory of talented braiders across the U.S. Browse by city and find your next stylist.",
      },
      { property: "og:title", content: "Tamar Finds" },
      {
        property: "og:description",
        content: "Find your next braider, city by city.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 sm:pt-28 sm:pb-24">
        <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--rose)] mb-6">
          A directory for the culture
        </p>
        <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl leading-[0.95] text-foreground max-w-4xl">
          Find the braider <em className="italic text-[color:var(--rose)]">made</em> for your crown.
        </h1>
        <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
          Tamar Finds is a hand-picked directory of braiders, city by city.
          Browse portfolios, peek their Instagram, and book with confidence.
        </p>
      </section>

      {/* Cities */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-display text-3xl sm:text-4xl">Browse by city</h2>
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {cities.length} cities · always growing
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city, i) => (
            <Link
              key={city.slug}
              to="/city/$citySlug"
              params={{ citySlug: city.slug }}
              className="group block"
            >
              <article
                className={`relative overflow-hidden rounded-3xl bg-card border border-border/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(120,40,50,0.25)] ${
                  i % 5 === 0 ? "sm:aspect-[4/5]" : "aspect-[4/5]"
                }`}
              >
                <img
                  src={city.cover}
                  alt={`${city.name} skyline`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <p className="text-xs uppercase tracking-[0.2em] opacity-80">
                    {city.state}
                  </p>
                  <h3 className="font-display text-3xl sm:text-4xl mt-1 text-white">
                    {city.name}
                  </h3>
                  <p className="mt-2 text-sm opacity-90 max-w-xs">
                    {city.braiders.length} braiders
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
