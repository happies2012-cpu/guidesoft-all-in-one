import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/BrandLogo";
import { BRAND } from "@/lib/brand";
import { getPagePath, navigationGroups } from "@/lib/marketing-pages";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/20">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="mb-4 inline-flex items-center gap-2">
              <BrandLogo imageClassName="h-8 w-8 rounded-lg" textClassName="text-base tracking-[0.2em]" />
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              GUIDESOFT brings social, messaging, content, payments, and admin workflows into one production-ready surface.
            </p>
          </div>

          {navigationGroups.map((group) => (
            <div key={group.title}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                {group.title}
              </h4>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item.slug}>
                    <Link
                      to={getPagePath(item.slug)}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
            <Link to={getPagePath("privacy")} className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link to={getPagePath("terms")} className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <a href="https://www.guideitsol.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-foreground">
              Design and Developed by GUIDESOFT
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
