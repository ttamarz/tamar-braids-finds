import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { blogPosts } from "@/data/blog";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — Tamar Finds" },
      {
        name: "description",
        content:
          "Tips, gidsen en verhalen over vlechten, haarverzorging en je perfecte stylist vinden.",
      },
      { property: "og:title", content: "Blog — Tamar Finds" },
      { property: "og:description", content: "Tips & verhalen over vlechten." },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Terug
        </Link>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">Blog</h1>
        <p className="mt-3 text-foreground/70 max-w-xl">
          Tips, gidsen en verhalen over vlechten en je perfecte stylist vinden.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((p) => (
          <Link
            key={p.slug}
            to="/blog/$slug"
            params={{ slug: p.slug }}
            className="group block"
          >
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
              <img
                src={p.image}
                alt={p.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <span className="inline-block mt-4 text-[10px] uppercase tracking-[0.18em] font-semibold bg-[color:var(--blush)] px-2 py-1 rounded-full">
              {p.tag}
            </span>
            <h2 className="font-display text-2xl leading-tight mt-3 group-hover:text-[color:var(--rose)] transition-colors">
              {p.title}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">{p.excerpt}</p>
            <p className="text-xs text-muted-foreground mt-2">{p.readTime}</p>
          </Link>
        ))}
      </section>

      <SiteFooter />
    </div>
  );
}
