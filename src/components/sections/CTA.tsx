import { Link } from "react-router-dom";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";
import { getPagePath } from "@/lib/marketing-pages";

export function CTA() {
  return (
    <section id="cta" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--gs-cyan)/0.12),transparent_35%),radial-gradient(circle_at_bottom_right,hsl(var(--gs-coral)/0.12),transparent_30%)]" />
      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-4xl rounded-3xl border border-border/60 bg-card/85 p-8 text-center shadow-lg sm:p-12">
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Ready to Ship a Natural, Production-Grade GUIDESOFT Experience?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Start with secure auth, UPI verification, and role-gated access. Every marketing page is now connected to
            a real internal route.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button variant="brand" size="xl" asChild>
              <Link to="/auth">
                Start Now
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <Link to={getPagePath("admin-access")}>
                Open Admin Access
                <ShieldCheck className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-sm text-muted-foreground">
            <a href={`mailto:${BRAND.supportEmail}`} className="inline-flex items-center gap-2 hover:text-foreground">
              <Mail className="h-4 w-4" />
              {BRAND.supportEmail}
            </a>
            <span className="hidden sm:inline">|</span>
            <a href={BRAND.siteUrl} target="_blank" rel="noreferrer" className="hover:text-foreground">
              www.guideitsol.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
