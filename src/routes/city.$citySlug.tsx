import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getCity } from "@/data/cities";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { stylistsQueryOptions } from "@/lib/stylistsQuery";
import type { Stylist } from "@/lib/stylists.functions";
import { useSavedStylists } from "@/hooks/useSavedStylists";
import { StylistReviews } from "@/components/StylistReviews";
import { Instagram, ArrowLeft, Star, Bookmark, MapPin, Calendar } from "lucide-react";

const fallbackImage =
  "https://images.pexels.com/photos/37115258/pexels-photo-37115258.jpeg";
function getStylistImages(b: Stylist) {
  const extraImages = Array.isArray((b as any).image_urls) ? (b as any).image_urls : [];
  return [b.image_url, ...extraImages].filter(Boolean);
}

function ImageCarousel({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  const safeImages = images.length ? images : [fallbackImage];

  return (
    <div className="relative h-full w-full">
      <img
        src={safeImages[index]}
        alt={name}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
      />

      {safeImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIndex((index - 1 + safeImages.length) % safeImages.length);
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full h-7 w-7 text-sm"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIndex((index + 1) % safeImages.length);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full h-7 w-7 text-sm"
          >
            ›
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {safeImages.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-4 bg-white" : "w-1.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function slugify(name: string) {
  return name.toLowerCase().trim().replace(/\s+/g, "-");
}

export const Route = createFileRoute("/city/$citySlug")({
  loader: async ({ params, context }) => {
    await context.queryClient.ensureQueryData(stylistsQueryOptions);
    return { slug: params.citySlug };
  },
  head: ({ loaderData }) => {
    const slug = loaderData?.slug ?? "";
    const preset = getCity(slug);
    const name = preset?.name ?? slug.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    const title = `Vlechters in ${name} — Tamar Finds`;
    const description = `Ontdek handgekozen vlechters in ${name}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...(preset ? [{ property: "og:image", content: preset.cover }] : []),
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
  const { slug } = Route.useLoaderData();
  const { data: all } = useSuspenseQuery(stylistsQueryOptions);
  const { isSaved, toggle } = useSavedStylists();

  const preset = getCity(slug);
  const stylists = all.filter((s: Stylist) => slugify(s.city) === slug);
  const displayName =
    preset?.name ??
    stylists[0]?.city ??
    slug.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  const tagline = preset?.tagline ?? "Ontdek vertrouwde vlechters in jouw stad.";

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">
        <div className="relative overflow-hidden rounded-[2rem] min-h-[340px] sm:min-h-[420px] flex items-end">
          {preset ? (
            <>
              <img src={preset.cover} alt={displayName} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--blush)] via-[color:var(--blush)]/70 to-[color:var(--background)]" />
          )}
          <div className={`relative p-6 sm:p-10 w-full ${preset ? "text-white" : "text-foreground"}`}>
            <Link to="/" className={`inline-flex items-center gap-2 text-sm ${preset ? "text-white/85 hover:text-white" : "text-foreground/70 hover:text-foreground"}`}>
              <ArrowLeft className="h-4 w-4" /> Alle steden
            </Link>
            <h1 className={`font-display text-5xl sm:text-7xl mt-6 ${preset ? "text-white" : "text-foreground"}`}>{displayName}</h1>
            <p className={`mt-2 font-[family-name:var(--font-script)] text-2xl sm:text-3xl max-w-xl ${preset ? "text-white/95" : "text-[color:var(--rose)]"}`}>
              {tagline}
            </p>
            <p className={`mt-3 text-sm ${preset ? "text-white/80" : "text-muted-foreground"}`}>{stylists.length} vlechters</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-10">
        {stylists.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            Nog geen vlechters in {displayName}. Kom snel terug!
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stylists.map((b) => (
              <article
                key={b.id}
                className="group rounded-3xl bg-card border border-border/60 overflow-hidden shadow-sm hover:shadow-[0_20px_60px_-20px_rgba(180,80,120,0.25)] transition-all duration-500 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  <ImageCarousel images={getStylistImages(b)} name={b.name} />
                  {b.reviews_count > 0 && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-[color:var(--blush)]/95 backdrop-blur text-xs font-semibold px-2.5 py-1 rounded-full">
                      <Star className="h-3 w-3 fill-[color:var(--pink)] text-[color:var(--pink)]" />
                      {Number(b.rating).toFixed(1)}
                    </span>
                  )}
                  {b.featured && (
                    <span className="absolute bottom-3 left-3 bg-[color:var(--rose)] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Featured
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
                    <span className="shrink-0 text-xs uppercase tracking-[0.18em] font-semibold">
                      {b.price_min > 0 ? (
                        <span className="text-[color:var(--rose)]">
                          €{b.price_min}{b.price_max > b.price_min ? `–${b.price_max}` : ""}
                        </span>
                      ) : (
                        <span className="text-muted-foreground font-normal">Prijs op aanvraag</span>
                      )}
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
                    <div className="flex items-center gap-4">
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
                      {b.booking_url && (
                      <a
                      href={b.booking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold bg-[color:var(--rose)] text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
                      >
                      <Calendar className="h-4 w-4" />
                      Book now
                      </a>
                      )}
                    </div>
                  </div>
                  <StylistReviews stylistId={b.id} />
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
