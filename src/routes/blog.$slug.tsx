import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { getBlogPost } from "@/data/blog";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getBlogPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.post.title} — Tamar Finds` },
            { name: "description", content: loaderData.post.excerpt },
            { property: "og:title", content: loaderData.post.title },
            { property: "og:description", content: loaderData.post.excerpt },
            { property: "og:image", content: loaderData.post.image },
          ],
        }
      : {},
  component: BlogPostPage,
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <article className="mx-auto max-w-3xl px-4 sm:px-6 pt-10">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Alle artikelen
        </Link>

        <span className="inline-block mt-6 text-[10px] uppercase tracking-[0.18em] font-semibold bg-[color:var(--blush)] px-2 py-1 rounded-full">
          {post.tag}
        </span>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl leading-tight">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">{post.readTime}</p>

        <div className="mt-8 aspect-[16/9] rounded-3xl overflow-hidden">
          <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
        </div>

        <div className="mt-10 space-y-6 text-lg leading-relaxed text-foreground/85">
          {post.body.map((para: string, i: number) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </article>

      <SiteFooter />
    </div>
  );
}
