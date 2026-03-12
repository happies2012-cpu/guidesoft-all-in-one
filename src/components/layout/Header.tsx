import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BrandLogo } from "@/components/BrandLogo";
import { getPagePath, navigationGroups } from "@/lib/marketing-pages";

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <nav className="flex h-16 items-center justify-between">
          <Link to="/" className="group flex items-center gap-3">
            <BrandLogo
              imageClassName="h-9 w-9 transition-transform duration-300 group-hover:scale-105"
              textClassName="text-base tracking-[0.2em]"
            />
          </Link>

          <div className="hidden items-center gap-2 xl:flex">
            {navigationGroups.map((group) => (
              <div key={group.title} className="group relative">
                <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                  {group.title}
                  <ChevronDown className="h-4 w-4 opacity-60 transition-transform group-hover:rotate-180" />
                </button>
                <div className="invisible absolute left-0 top-full mt-2 min-w-[240px] rounded-2xl border border-border/60 bg-card/95 p-2 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  {group.items.map((item) => {
                    const href = getPagePath(item.slug);
                    return (
                      <Link
                        key={item.slug}
                        to={href}
                        className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                          location.pathname === href
                            ? "bg-secondary text-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <ThemeToggle />
            <Link to="/auth">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="brand" size="sm">
                Get Started
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              className="rounded-lg p-2 transition-colors hover:bg-accent"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border/60 bg-background/95 px-4 py-4 backdrop-blur-xl lg:hidden">
          <div className="max-h-[70vh] space-y-4 overflow-auto pb-2">
            {navigationGroups.map((group) => (
              <div key={group.title} className="rounded-xl border border-border/50 bg-card/70 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {group.title}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {group.items.map((item) => (
                    <Link
                      key={item.slug}
                      to={getPagePath(item.slug)}
                      onClick={closeMenu}
                      className="rounded-md border border-border/40 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-2">
              <Link to="/auth" onClick={closeMenu}>
                <Button variant="outline" className="w-full">
                  Sign in
                </Button>
              </Link>
              <Link to="/auth" onClick={closeMenu}>
                <Button variant="brand" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
