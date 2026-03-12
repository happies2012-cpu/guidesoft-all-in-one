import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, ExternalLink, X } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getMarketingPage, getPagePath, getRelatedPages } from "@/lib/marketing-pages";
import { techStack } from "@/lib/tech-stack";
import NotFound from "./NotFound";

export default function MarketingPage() {
  const { slug } = useParams<{ slug: string }>();
  const page = getMarketingPage(slug);
  const [activeSlide, setActiveSlide] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const slides = useMemo(() => (page ? page.gallery : []), [page]);
  const relatedPages = useMemo(() => (slug ? getRelatedPages(slug, 4) : []), [slug]);

  useEffect(() => {
    setActiveSlide(0);
  }, [slug]);

  useEffect(() => {
    if (slides.length < 2) return;
    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, [slides.length]);

  if (!page) {
    return <NotFound />;
  }

  const isExternalCta = page.ctaHref.startsWith("http") || page.ctaHref.startsWith("mailto:");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="overflow-hidden pt-16">
        <section className="relative min-h-[82vh]">
          <div className="absolute inset-0">
            {slides.map((image, index) => (
              <img
                key={`${page.slug}-slide-${index}`}
                src={image}
                alt={`${page.title} hero ${index + 1}`}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ${
                  index === activeSlide ? "scale-100 opacity-100" : "scale-110 opacity-0"
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(19,213,255,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,126,91,0.2),transparent_40%),linear-gradient(120deg,rgba(3,8,20,0.82),rgba(8,14,29,0.55))]" />
          </div>

          <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-gs-cyan/30 blur-3xl animate-float" />
          <div
            className="pointer-events-none absolute -right-16 bottom-20 h-72 w-72 rounded-full bg-gs-coral/25 blur-3xl animate-float"
            style={{ animationDelay: "-2s" }}
          />

          <div className="container relative z-10 mx-auto px-4 py-20">
            <p className="mb-5 inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
              {page.category}
            </p>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              {page.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/85">{page.description}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {isExternalCta ? (
                <Button variant="brand" size="lg" asChild>
                  <a href={page.ctaHref} target={page.ctaHref.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                    {page.ctaLabel}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              ) : (
                <Button variant="brand" size="lg" asChild>
                  <Link to={page.ctaHref}>
                    {page.ctaLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
              <Button variant="hero-outline" size="lg" asChild>
                <Link to="/auth">Start with GUIDESOFT</Link>
              </Button>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {page.highlights.map((highlight) => (
                <div key={highlight} className="rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm text-white/90">
                  {highlight}
                </div>
              ))}
            </div>
            <div className="mt-10 flex items-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={`${page.slug}-dot-${index}`}
                  className={`h-2 rounded-full transition-all ${index === activeSlide ? "w-8 bg-white" : "w-2 bg-white/50"}`}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Show slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-20">
          <div className="absolute inset-0 bg-secondary/20" />
          <div className="container relative z-10 mx-auto space-y-20 px-4">
            {page.sections.map((section, index) => (
              <article key={section.title} className="grid gap-8 lg:grid-cols-2 lg:items-center">
                <div className={index % 2 ? "lg:order-2" : ""}>
                  <img
                    src={section.image}
                    alt={section.title}
                    className="h-[320px] w-full rounded-3xl object-cover shadow-xl transition-transform duration-500 hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
                <div className={`${index % 2 ? "lg:order-1" : ""} space-y-5`}>
                  <h2 className="text-3xl font-bold sm:text-4xl">{section.title}</h2>
                  <p className="text-muted-foreground">{section.description}</p>
                  <div className="grid gap-3">
                    {section.points.map((point) => (
                      <div key={point} className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/80 p-4 transition-transform duration-300 hover:-translate-y-0.5">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-gs-cyan" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <div className="mb-8 flex items-center justify-between gap-4">
            <h2 className="text-3xl font-bold sm:text-4xl">Technology Stack</h2>
            <p className="max-w-lg text-sm text-muted-foreground">
              Real production stack icons, with practical tooling used in this project.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {techStack.map((item) => (
              <div key={item.name} className="rounded-2xl border border-border/60 bg-card/80 p-4">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border/60 bg-background/70">
                  <img src={item.icon} alt={`${item.name} icon`} className="h-7 w-7" loading="lazy" />
                </div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.summary}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <div className="mb-8">
            <h2 className="text-3xl font-bold sm:text-4xl">Visual Gallery</h2>
            <p className="mt-2 text-muted-foreground">Open any image to preview the section in a lightbox.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {page.gallery.map((image, index) => (
              <button
                key={`${page.slug}-gallery-${index}`}
                className="group relative overflow-hidden rounded-2xl"
                onClick={() => setLightboxImage(image)}
                aria-label={`Open ${page.title} gallery image ${index + 1}`}
              >
                <img
                  src={image}
                  alt={`${page.title} gallery ${index + 1}`}
                  className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              </button>
            ))}
          </div>
        </section>

        {relatedPages.length > 0 && (
          <section className="container mx-auto px-4 pb-24">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-bold">Related Pages</h2>
              <Link to={getPagePath("guidesoft")} className="text-sm text-muted-foreground hover:text-foreground">
                Explore full site map
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {relatedPages.map((related) => (
                <Link
                  key={related.slug}
                  to={getPagePath(related.slug)}
                  className="rounded-2xl border border-border/60 bg-card/80 p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{related.category}</p>
                  <h3 className="mt-2 text-lg font-semibold">{related.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{related.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Dialog open={Boolean(lightboxImage)} onOpenChange={(open) => !open && setLightboxImage(null)}>
        <DialogContent className="max-w-5xl border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">{page.title} gallery preview</DialogTitle>
          <div className="relative rounded-2xl bg-black/70 p-2 backdrop-blur-sm">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              aria-label="Close lightbox"
            >
              <X className="h-4 w-4" />
            </button>
            {lightboxImage ? (
              <img src={lightboxImage} alt={`${page.title} preview`} className="max-h-[78vh] w-full rounded-xl object-cover" />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
