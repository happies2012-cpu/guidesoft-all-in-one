import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getPagePath, marketingPages } from "@/lib/marketing-pages";

const zigZagShowcase = ["social", "messaging", "streaming", "cloud-storage", "news-media"]
  .map((slug) => marketingPages.find((page) => page.slug === slug))
  .filter((page): page is NonNullable<typeof page> => Boolean(page));

export function Industries() {
  return (
    <section id="industries" className="py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Zig Zag Content Flow</p>
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Internal Pages with Real Hero Images, Motion, and Natural Content
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Platform pages are structured for real customer journeys with CTA-driven sections and clear navigation paths.
          </p>
        </div>

        <div className="space-y-20">
          {zigZagShowcase.map((item, index) => (
            <article key={item.slug} className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div className={index % 2 ? "lg:order-2" : ""}>
                <img
                  src={item.heroImage}
                  alt={item.title}
                  className="h-[320px] w-full rounded-3xl object-cover shadow-lg transition-transform duration-500 hover:scale-[1.01]"
                  loading="lazy"
                />
              </div>
              <div className={`${index % 2 ? "lg:order-1" : ""}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gs-cyan">{item.category}</p>
                <h3 className="mt-3 text-3xl font-bold">{item.title}</h3>
                <p className="mt-4 text-muted-foreground">{item.description}</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {item.highlights.slice(0, 4).map((highlight) => (
                    <div
                      key={highlight}
                      className="flex items-start gap-2 rounded-xl border border-border/60 bg-card/80 p-3 text-sm animate-fade-in"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-gs-cyan" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to={getPagePath(item.slug)}
                  className="mt-7 inline-flex items-center gap-2 rounded-lg border border-border/70 px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
                >
                  Open {item.title} page
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
