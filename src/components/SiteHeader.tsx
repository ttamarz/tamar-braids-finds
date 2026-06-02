import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl tracking-tight text-foreground">
            Tamar
          </span>
          <span className="font-display italic text-2xl text-[color:var(--rose)]">
            Finds
          </span>
        </Link>
        <nav className="hidden sm:flex items-center gap-8 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            Cities
          </Link>
          <a href="#about" className="hover:text-foreground transition-colors">
            About
          </a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer id="about" className="mt-32 border-t border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-16 grid gap-10 sm:grid-cols-2">
        <div>
          <h3 className="font-display text-3xl text-foreground">
            A love letter to the braiders.
          </h3>
          <p className="mt-4 text-muted-foreground max-w-md leading-relaxed">
            Tamar Finds is a hand-curated directory of braiders across the
            country. No reviews to game, no ads — just stylists worth booking.
          </p>
        </div>
        <div className="sm:text-right text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Tamar Finds</p>
          <p className="mt-1 italic font-display text-base">
            Crowns, woven with care.
          </p>
        </div>
      </div>
    </footer>
  );
}
