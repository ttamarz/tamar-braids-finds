import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { cities, styleCategories } from "@/data/cities";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { useSavedStylists } from "@/hooks/useSavedStylists";
import { stylistsQueryOptions } from "@/lib/stylistsQuery";
import type { Stylist } from "@/lib/stylists.functions";
import { Search, MapPin, Star, Bookmark, Shield, Camera, Heart, ArrowRight, Sparkles, Calendar } from "lucide-react";

const heroPortrait =
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=85";
const polaroid1 =
  "https://images.pexels.com/photos/27987128/pexels-photo-27987128.jpeg";
const polaroid2 =
  "https://images.pexels.com/photos/27987138/pexels-photo-27987138.jpeg";
const stylistCta =
  "https://images.pexels.com/photos/5301538/pexels-photo-5301538.jpeg";

const fallbackImage =
  "https://images.pexels.com/photos/37115258/pexels-photo-37115258.jpeg";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(stylistsQueryOptions),
  head: () => ({
  links: [
    { rel: "icon", href: "/favicon.ico" },
  ],
  meta: [
    { title: "Tamar Finds | Vind Braiders & Vlechters in Nederland" },
    {
      name: "description",
      content:
        "Ontdek vertrouwde braiders, hairstylists en vlechters in Nederland. Vergelijk prijzen, bekijk foto's en vind jouw volgende afspraak via Tamar Finds.",
    },
    { property: "og:title", content: "Tamar Finds" },
    { property: "og:description", content: "Find trusted braiders near you." },
  ],
}),
  component: Home,
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-muted-foreground">{error.message}</div>
  ),
  notFoundComponent: () => <div className="p-10 text-center">Niet gevonden.</div>,
});

function priceTier(min: number | null | undefined): string | null {
  if (!min || min <= 0) return null;
  if (min >= 180) return "€€€";
  if (min >= 120) return "€€";
  return "€";
}

function citySlugFor(name: string): string {
  const match = cities.find((c) => c.name.toLowerCase() === name.toLowerCase());
  return match?.slug ?? name.toLowerCase().replace(/\s+/g, "-");
}

function Home() {
  const { data: stylists } = useSuspenseQuery(stylistsQueryOptions);
  const { isSaved, toggle } = useSavedStylists();
  const [query, setQuery] = useState("");

  const trimmed = query.trim().toLowerCase();
  const isSearching = trimmed.length > 0;

  const results = useMemo(() => {
    if (!isSearching) return [];
    return stylists.filter((s: Stylist) => {
      const hay = [
        s.name,
        s.bio ?? "",
        s.instagram_url ?? "",
        s.city,
        ...s.specialties,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(trimmed);
    });
  }, [trimmed, isSearching, stylists]);

  const scrollToResults = () => {
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  const setQueryAndScroll = (q: string) => {
    setQuery(q);
    scrollToResults();
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[color:var(--blush)] via-[color:var(--blush)]/70 to-[color:var(--background)] p-6 sm:p-10 lg:p-14">
          <div className="grid lg:grid-cols-[1fr_1.1fr_auto] gap-8 items-center">
            <div className="relative aspect-[4/5] max-w-sm lg:max-w-none rounded-[1.5rem] overflow-hidden shadow-xl">
              <img src={heroPortrait} alt="Braided model" className="h-full w-full object-cover" />
            </div>

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

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  scrollToResults();
                }}
                className="mt-7 flex items-center gap-2 rounded-full bg-card border border-border shadow-sm p-2 pl-5"
              >
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
                <input
                  id="discover-search"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Zoek stad, stijl of vlechter…"
                  className="flex-1 bg-transparent outline-none text-sm sm:text-base placeholder:text-muted-foreground py-2"
                />

                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="text-xs text-muted-foreground hover:text-foreground px-2"
                  >
                    Wis
                  </button>
                )}
                <button
                  type="submit"
                  aria-label="Search"
                  className="h-11 w-11 rounded-full bg-[color:var(--primary)] text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <Search className="h-5 w-5" />
                </button>
              </form>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold mr-1">Popular:</span>
                {cities.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => setQueryAndScroll(c.name)}
                    className="px-4 py-1.5 rounded-full border border-border bg-card text-sm hover:bg-[color:var(--blush)] hover:border-[color:var(--rose)]/40 transition-colors"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

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

      {/* RESULTS + SIDEBAR */}
      <section id="results" className="mx-auto max-w-7xl px-4 sm:px-6 mt-10 grid lg:grid-cols-[1.6fr_1fr] gap-6">
        <div className="rounded-[1.5rem] bg-card border border-border/60 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[color:var(--pink)]" />
              <span className="uppercase tracking-[0.15em] text-sm font-semibold text-foreground">
                {isSearching ? `Resultaten · ${results.length}` : "Featured Stylists"}
              </span>
            </h2>
            {isSearching ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-sm font-medium inline-flex items-center gap-1 text-foreground hover:text-[color:var(--rose)]"
              >
                Wis zoekopdracht
              </button>
            ) : null}
          </div>

          {!isSearching ? (
            <div className="py-16 text-center">
              <p className="font-display text-2xl">Find your braider</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Search by city, style, or stylist name above to see results.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-display text-2xl">No results</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try a different city, style, or stylist name.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.map((s) => (
                <Link
                  key={s.id}
                  to="/city/$citySlug"
                  params={{ citySlug: citySlugFor(s.city) }}
                  className="group block"
                >
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-muted">
                    <img
                      src={s.image_url || fallbackImage}
                      alt={s.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {s.reviews_count > 0 && (
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 bg-[color:var(--blush)]/95 backdrop-blur text-[11px] font-semibold px-2 py-1 rounded-full">
                    <Star className="h-3 w-3 fill-[color:var(--pink)] text-[color:var(--pink)]" />
                    {Number(s.rating).toFixed(1)}
                    </span>
                    )}
                    {s.featured && (
                      <span className="absolute bottom-2 left-2 bg-[color:var(--rose)] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Featured
                      </span>
                    )}
                    <button
                      type="button"
                      aria-label={isSaved(s.id) ? "Remove from saved" : "Save stylist"}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggle(s.id);
                      }}
                      className="absolute top-2 right-2 h-7 w-7 bg-white/90 rounded-full flex items-center justify-center hover:bg-white"
                    >
                      <Bookmark
                        className={`h-3.5 w-3.5 ${isSaved(s.id) ? "fill-[color:var(--rose)] text-[color:var(--rose)]" : ""}`}
                      />
                    </button>
                  </div>
                  <div className="mt-3 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-display text-base leading-tight truncate">{s.name}</h3>
                      <p className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" /> {s.city}
                      </p>
                    </div>
                    <span className="text-xs font-semibold shrink-0">
                    {priceTier(s.price_min) ?? (
                    <span className="text-muted-foreground font-normal">Prijs op aanvraag</span>
                    )}
                  </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{s.reviews_count} reviews</p>
                </Link>
              {(s.booking_url || s.instagram_url) && (
  
    href={s.booking_url || s.instagram_url || "#"}
    target="_blank"
    rel="noopener noreferrer"
    onClick={(e) => e.stopPropagation()}
    aria-label="Book"
    className="absolute top-2 right-11 h-7 w-7 bg-white/90 rounded-full flex items-center justify-center hover:bg-white"
  >
    <Calendar className="h-3.5 w-3.5" />
  </a>
)}
              ))}
            </div>
          )}
        </div>

        <aside className="flex flex-col gap-6">
          <div className="rounded-[1.5rem] bg-card border border-border/60 p-6">
            <h2 className="uppercase tracking-[0.15em] text-sm font-semibold mb-5">Browse by style</h2>
            <div className="grid grid-cols-5 gap-3">
              {styleCategories.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => setQueryAndScroll(s.name)}
                  className="group text-center"
                >
                  <div className="aspect-square rounded-full overflow-hidden ring-2 ring-[color:var(--blush)] group-hover:ring-[color:var(--pink)] transition-all">
                    <img src={s.photo} alt={s.name} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                  <p className="mt-2 text-[11px] leading-tight font-medium">{s.name}</p>
                </button>
              ))}
            </div>
          </div>

          <Link
            to="/for-stylists"
            className="relative block rounded-[1.5rem] bg-[color:var(--blush)] p-6 overflow-hidden hover:opacity-95 transition-opacity"
          >
            <div className="max-w-[60%]">
              <h3 className="font-display text-2xl leading-tight">Are you a braider?</h3>
              <p className="mt-2 text-sm text-foreground/75">
                Word ontdekt door nieuwe klanten en laat je business groeien.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 bg-foreground text-background text-sm font-semibold rounded-full px-5 py-2.5">
                List your business <ArrowRight className="h-4 w-4" />
              </span>
            </div>
            <div className="absolute right-3 bottom-3 w-28 h-32 rotate-[6deg] p-1.5 pb-4 bg-white shadow-md rounded-sm hidden sm:block">
              <img src={stylistCta} alt="" className="w-full h-full object-cover" />
            </div>
          </Link>
        </aside>
      </section>

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

      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-16">
        <div className="rounded-[1.5rem] bg-card border border-border/60 p-6 sm:p-10 grid lg:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <p className="font-[family-name:var(--font-script)] text-3xl sm:text-4xl text-[color:var(--rose)]">
              Can't find a stylist?
            </p>
            <h2 className="font-display text-3xl sm:text-4xl mt-1 leading-tight">
              We helpen je <em className="italic">verder.</em>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-foreground/75 max-w-xl">
              Tell us what you're looking for and we'll help you find a trusted braider near you.
            </p>
          </div>
          <Link
            to="/request-stylist"
            className="inline-flex items-center justify-center gap-2 bg-foreground text-background text-sm font-semibold rounded-full px-6 py-3.5 hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Request a Stylist <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>


      <SiteFooter />
    </div>
  );
}
