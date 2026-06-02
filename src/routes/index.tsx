import { createFileRoute, Link } from "@tanstack/react-router";
import { cities, styleCategories } from "@/data/cities";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Search, MapPin, Star, Bookmark, Shield, Camera, Heart, ArrowRight, Sparkles } from "lucide-react";

const heroPortrait =
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=85";
const polaroid1 =
  "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=500&q=85";
const polaroid2 =
  "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=500&q=85";
const stylistCta =
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=85";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tamar Finds — Vind vertrouwde vlechters in Nederland" },
      {
        name: "description",
        content:
          "Een handgekozen directory van vlechters in Amsterdam, Rotterdam, Utrecht, Arnhem en Den Haag.",
      },
      { property: "og:title", content: "Tamar Finds" },
      { property: "og:description", content: "Find trusted braiders near you." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[color:var(--blush)] via-[color:var(--blush)]/70 to-[color:var(--background)] p-6 sm:p-10 lg:p-14">
          <div className="grid lg:grid-cols-[1fr_1.1fr_auto] gap-8 items-center">
            {/* Portrait */}
            <div className="relative aspect-[4/5] max-w-sm lg:max-w-none rounded-[1.5rem] overflow-hidden shadow-xl">
              <img src={heroPortrait} alt="Braided model" className="h-full w-full object-cover" />
            </div>

            {/* Copy & search */}
            <div className="relative">
              <p className="font-[family-name:var(--font-script)] text-4xl sm:text-5xl text-foreground leading-none">
                Find trusted
                <span className="inline-block ml-2 text-[color:var(--pink)]">♡</span>
              </p>
              <h1 className="mt-2 font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] text-foreground">
                braiders <em className="italic">near you.</em>
              </h1>
              <p className="mt-5 text-lg text-foreground/80">
                Stop gambling with <span className="deco-underline font-semibold">your edges.</span>
              </p>

              {/* Search bar */}
              <div className="mt-7 flex items-center gap-2 rounded-full bg-card border border-border shadow-sm p-2 pl-5">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Zoek stad, stijl of vlechter…"
                  className="flex-1 bg-transparent outline-none text-sm sm:text-base placeholder:text-muted-foreground py-2"
                />
                <button
                  aria-label="Search"
                  className="h-11 w-11 rounded-full bg-[color:var(--primary)] text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>

              {/* Popular chips */}
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold mr-1">Popular:</span>
                {cities.map((c) => (
                  <Link
                    key={c.slug}
                    to="/city/$citySlug"
                    params={{ citySlug: c.slug }}
                    className="px-4 py-1.5 rounded-full border border-border bg-card text-sm hover:bg-[color:var(--blush)] hover:border-[color:var(--rose)]/40 transition-colors"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Polaroids */}
            <div className="hidden lg:block relative w-[220px] h-[360px]">
              <div className="absolute top-0 right-4 rotate-[6deg] p-2 pb-6 bg-white shadow-lg rounded-sm">
                <img src={polaroid1} alt="" className="w-40 h-48 object-cover" />
              </div>
              <div className="absolute bottom-0 right-0 -rotate-[5deg] p-2 pb-6 bg-white shadow-lg rounded-sm">
                <img src={polaroid2} alt="" className="w-44 h-52 object-cover" />
                <span className="absolute -top-2 left-6 w-14 h-3 bg-[color:var(--blush)] rotate-[-8deg] opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED + SIDEBAR */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-10 grid lg:grid-cols-[1.6fr_1fr] gap-6">
        {/* Featured stylists */}
        <div className="rounded-[1.5rem] bg-card border border-border/60 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[color:var(--pink)]" />
              <span className="uppercase tracking-[0.15em] text-sm font-semibold text-foreground">
                Featured Stylists
              </span>
            </h2>
            <a href="#all" className="text-sm font-medium inline-flex items-center gap-1 text-foreground hover:text-[color:var(--rose)]">
              View all <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {cities.flatMap((c) => c.braiders.map((b) => ({ b, city: c }))).slice(0, 8).map(({ b, city }) => (
              <Link
                key={b.instagram}
                to="/city/$citySlug"
                params={{ citySlug: city.slug }}
                className="group block"
              >
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-muted">
                  <img src={b.photo} alt={b.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 bg-[color:var(--blush)]/95 backdrop-blur text-[11px] font-semibold px-2 py-1 rounded-full">
                    <Star className="h-3 w-3 fill-[color:var(--pink)] text-[color:var(--pink)]" />
                    {b.rating.toFixed(1)}
                  </span>
                  <span className="absolute top-2 right-2 h-7 w-7 bg-white/90 rounded-full flex items-center justify-center">
                    <Bookmark className="h-3.5 w-3.5" />
                  </span>
                </div>
                <div className="mt-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-display text-base leading-tight truncate">{b.name}</h3>
                    <p className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" /> {city.name}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[color:var(--rose)] shrink-0">{b.priceTier}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{b.reviews} reviews</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6">
          {/* Browse by style */}
          <div className="rounded-[1.5rem] bg-card border border-border/60 p-6">
            <h2 className="uppercase tracking-[0.15em] text-sm font-semibold mb-5">Browse by style</h2>
            <div className="grid grid-cols-5 gap-3">
              {styleCategories.map((s) => (
                <a key={s.name} href="#style" className="group text-center">
                  <div className="aspect-square rounded-full overflow-hidden ring-2 ring-[color:var(--blush)] group-hover:ring-[color:var(--pink)] transition-all">
                    <img src={s.photo} alt={s.name} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                  <p className="mt-2 text-[11px] leading-tight font-medium">{s.name}</p>
                </a>
              ))}
            </div>
          </div>

          {/* For stylists CTA */}
          <div id="stylists" className="relative rounded-[1.5rem] bg-[color:var(--blush)] p-6 overflow-hidden">
            <div className="max-w-[60%]">
              <h3 className="font-display text-2xl leading-tight">Are you a braider?</h3>
              <p className="mt-2 text-sm text-foreground/75">
                Word ontdekt door nieuwe klanten en laat je business groeien.
              </p>
              <button className="mt-4 inline-flex items-center gap-2 bg-foreground text-background text-sm font-semibold rounded-full px-5 py-2.5 hover:opacity-90 transition-opacity">
                List your business <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="absolute right-3 bottom-3 w-28 h-32 rotate-[6deg] p-1.5 pb-4 bg-white shadow-md rounded-sm hidden sm:block">
              <img src={stylistCta} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        </aside>
      </section>

      {/* TRUST BADGES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-10">
        <div className="rounded-[1.5rem] bg-card border border-border/60 p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { icon: Shield, title: "Vetted Stylists", body: "Alleen vertrouwde, ervaren vlechters." },
            { icon: Camera, title: "Real Photo Reviews", body: "Zie échte resultaten van echte klanten." },
            { icon: MapPin, title: "Find Nearby", body: "Zoek per stad en ontdek lokaal talent." },
            { icon: Heart, title: "Save Your Favorites", body: "Bookmark je dream-braiders." },
          ].map((f) => (
            <div key={f.title} className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-[color:var(--blush)] flex items-center justify-center">
                <f.icon className="h-5 w-5 text-[color:var(--rose)]" />
              </div>
              <h4 className="font-display text-base mt-3">{f.title}</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CITIES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-16">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-3xl sm:text-4xl">Browse by city</h2>
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {cities.length} steden · meer onderweg
          </span>
        </div>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <Link
              key={city.slug}
              to="/city/$citySlug"
              params={{ citySlug: city.slug }}
              className="group block"
            >
              <article className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-card border border-border/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(180,80,120,0.3)]">
                <img src={city.cover} alt={city.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <h3 className="font-display text-3xl sm:text-4xl text-white">{city.name}</h3>
                  <p className="mt-1 text-sm opacity-90">{city.braiders.length} vlechters</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* BLOG TEASER */}
      <section id="blog" className="mx-auto max-w-7xl px-4 sm:px-6 mt-16">
        <div className="flex items-end justify-between mb-6">
          <h2 className="uppercase tracking-[0.15em] text-sm font-semibold">Latest from the blog</h2>
          <a href="#all" className="text-sm font-medium inline-flex items-center gap-1 hover:text-[color:var(--rose)]">
            View all <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { tag: "Guide", title: "How to avoid traction alopecia", img: "photo-1531123897727-8f129e1688ce", read: "5 min read" },
            { tag: "Tips", title: "Best styles for 4C hair in summer", img: "photo-1594744803329-e58b31de8bf5", read: "7 min read" },
            { tag: "Moving", title: "Verhuisd? Vind snel een nieuwe vlechter", img: "photo-1605497788044-5a32c7078486", read: "6 min read" },
          ].map((p) => (
            <a key={p.title} href="#post" className="group flex gap-4 items-center">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl overflow-hidden shrink-0">
                <img src={`https://images.unsplash.com/${p.img}?auto=format&fit=crop&w=300&q=80`} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div>
                <span className="inline-block text-[10px] uppercase tracking-[0.18em] font-semibold bg-[color:var(--blush)] px-2 py-1 rounded-full">{p.tag}</span>
                <h3 className="font-display text-lg leading-tight mt-2 group-hover:text-[color:var(--rose)] transition-colors">{p.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{p.read}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
