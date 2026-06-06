import { Link } from "@tanstack/react-router";
import { Search, Heart } from "lucide-react";
import logo from "@/assets/tamar-finds-logo.png.asset.json";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center shrink-0">
          <img src={logo.url} alt="Tamar Finds" className="h-10 sm:h-12 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className="px-4 py-2 rounded-full text-foreground data-[status=active]:bg-[color:var(--blush)]"
          >
            Discover
          </Link>
          <Link to="/blog" className="px-4 py-2 rounded-full text-foreground/80 hover:text-foreground">
            Blog
          </Link>
          <Link to="/for-stylists" className="px-4 py-2 rounded-full text-foreground/80 hover:text-foreground">
            For Stylists
          </Link>
        </nav>

        <div className="flex items-center gap-2 text-sm">
          <button className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-full hover:bg-[color:var(--blush)] transition-colors">
            <Search className="h-4 w-4" /> Search
          </button>
          <button className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-full hover:bg-[color:var(--blush)] transition-colors">
            <Heart className="h-4 w-4" /> Saved
          </button>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-[color:var(--blush)]/40">
      <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 sm:grid-cols-2">
        <div>
          <img src={logo.url} alt="Tamar Finds" className="h-10 w-auto" />
          <p className="mt-4 text-muted-foreground max-w-md leading-relaxed">
            Tamar Finds helpt je betrouwbare braiders en hairstylists in
            Nederland ontdekken — zonder eindeloos zoeken op Instagram.
          </p>
        </div>
        <div className="sm:text-right text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Tamar Finds</p>
          <p className="mt-1 italic font-[family-name:var(--font-script)] text-2xl text-foreground">
            Find your next crown.
          </p>
        </div>
      </div>
    </footer>
  );
}
