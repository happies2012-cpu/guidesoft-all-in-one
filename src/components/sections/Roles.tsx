import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getPagePath, marketingPages } from "@/lib/marketing-pages";

const gallerySlugs = [
  "solutions",
  "enterprise",
  "creators",
  "teams",
  "communities",
  "self-hosted",
  "resources",
  "pricing",
  "company",
];

const galleryPages = gallerySlugs
  .map((slug) => marketingPages.find((page) => page.slug === slug))
  .filter((page): page is NonNullable<typeof page> => Boolean(page));

export function Roles() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState("");

  const cards = useMemo(
    () =>
      galleryPages.map((page, index) => ({
        ...page,
        image: page.gallery[index % page.gallery.length] || page.heroImage,
      })),
    [],
  );

  return (
    <section id="roles" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-secondary/25" />
      <div className="pointer-events-none absolute left-8 top-16 h-64 w-64 rounded-full bg-gs-purple/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-16 right-8 h-64 w-64 rounded-full bg-gs-coral/10 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Animated Cards + Lightbox</p>
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">Solutions and Company Surface Gallery</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Browse solution and company pages visually, then open each page for full hero, sections, and CTAs.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <article
              key={card.slug}
              className="group overflow-hidden rounded-2xl border border-border/60 bg-card/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-fade-in"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <button
                onClick={() => {
                  setSelectedImage(card.image);
                  setSelectedTitle(card.title);
                }}
                className="relative block w-full overflow-hidden"
                aria-label={`Open ${card.title} image`}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              </button>
              <div className="space-y-3 p-5">
                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{card.category}</p>
                <h3 className="text-xl font-semibold">{card.title}</h3>
                <p className="text-sm text-muted-foreground">{card.description}</p>
                <Button variant="outline" size="sm" asChild>
                  <Link to={getPagePath(card.slug)}>View {card.title} Page</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Dialog open={Boolean(selectedImage)} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">{selectedTitle} preview</DialogTitle>
          <div className="overflow-hidden rounded-2xl border border-white/20 bg-black/80 p-2 backdrop-blur">
            {selectedImage ? (
              <img src={selectedImage} alt={selectedTitle} className="max-h-[80vh] w-full rounded-xl object-cover" />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
