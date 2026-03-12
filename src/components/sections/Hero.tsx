import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPagePath } from "@/lib/marketing-pages";

const slides = [
  {
    image: "/assets/hero/tech-1.png",
    title: "The Ultimate Social Ecosystem for Brands.",
    description:
      "A unified platform for communities, streaming, and enterprise workspaces. Designed for high-performance teams and growing brands.",
  },
  {
    image: "/assets/hero/tech-2.png",
    title: "Enterprise Grade Logic, Consumer Grade UX.",
    description:
      "Bridge the gap between complex system architecture and simple, beautiful user experiences. Built with precision and speed.",
  },
  {
    image: "/assets/hero/tech-3.png",
    title: "Production Ready. Future Proofed.",
    description:
      "Ship faster with pre-integrated payment gateways, secure authentication, and real-time data flows that scale globally.",
  },
];

const statCards = [
  { label: "Active Nodes", value: "1.2k+" },
  { label: "Data Throughput", value: "99.9%" },
  { label: "Global Regions", value: "24" },
  { label: "Build Velocity", value: "10x" },
];

export function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden pt-16 flex items-center">
      {/* Background Layer: Images */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <img
            key={slide.title}
            src={slide.image}
            alt={slide.title}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-1500 ease-in-out ${
              index === activeSlide ? "scale-100 opacity-60" : "scale-110 opacity-0"
            }`}
          />
        ))}
        {/* Overlays */}
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" />
        <div className="absolute inset-0 hero-gradient-animate opacity-40" />
        <div className="absolute inset-0 grid-background opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-24 text-center">
        <div className="mx-auto max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <p className="inline-flex rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur-md">
            Production Release v1.0.4
          </p>
          
          <h1 className="text-5xl font-black leading-[1.1] text-white sm:text-7xl lg:text-8xl tracking-tight">
            {slides[activeSlide].title}
          </h1>
          
          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-white/90 font-medium">
            {slides[activeSlide].description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <Button variant="brand" size="xl" className="h-16 px-10 text-lg shadow-xl shadow-gs-cyan/20" asChild>
              <Link to="/auth">
                Start Building Free
                <ArrowRight className="ml-2 h-6 w-6" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" className="h-16 px-10 text-lg backdrop-blur-md border-white/30 text-white hover:bg-white/10" asChild>
              <Link to={getPagePath("solutions")}>
                View Live Systems
                <PlayCircle className="ml-2 h-6 w-6" />
              </Link>
            </Button>
          </div>

          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {statCards.map((stat, idx) => (
              <div 
                key={stat.label} 
                className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:bg-white/10"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <p className="text-3xl font-black text-white">{stat.value}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-bold mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                activeSlide === index ? "w-12 bg-gs-cyan" : "w-4 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

