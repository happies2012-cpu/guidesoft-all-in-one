import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getPagePath, marketingPages } from "@/lib/marketing-pages";
import { techStack } from "@/lib/tech-stack";

const featuredSlugs = [
  "social",
  "messaging",
  "streaming",
  "cloud-storage",
  "news-media",
  "enterprise",
  "creators",
  "payments",
];

const featuredPages = featuredSlugs
  .map((slug) => marketingPages.find((page) => page.slug === slug))
  .filter((page): page is NonNullable<typeof page> => Boolean(page));

export function Features() {
  return (
    <section id="features" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-secondary/25" />

      <div className="container relative z-10 mx-auto space-y-14 px-4">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Real Modules for Social, Messaging, Streaming, and Cloud Operations
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every section links to a dedicated internal page with practical flows, imagery, and launch-oriented content.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredPages.map((page, index) => (
            <Link
              key={page.slug}
              to={getPagePath(page.slug)}
              className="group rounded-2xl border border-border/60 bg-card/90 p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-fade-in"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{page.category}</p>
              <h3 className="mt-2 text-xl font-semibold">{page.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{page.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-gs-cyan">
                View page
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>

        <div className="rounded-3xl border border-border/60 bg-card/85 p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h3 className="text-2xl font-semibold">Tech Stack (SVG Icons)</h3>
            <p className="max-w-xl text-sm text-muted-foreground">
              Natural, production-grade stack references with official SVG logos.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {techStack.map((item) => (
              <div key={item.name} className="rounded-xl border border-border/50 bg-background/65 p-4">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg border border-border/50 bg-card">
                  <img src={item.icon} alt={`${item.name} SVG icon`} className="h-6 w-6" loading="lazy" />
                </div>
                <h4 className="font-semibold">{item.name}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{item.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
