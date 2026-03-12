import { BRAND } from "@/lib/brand";
import { Marquee } from "@/components/ui/marquee";

export function LogoMarquee() {
  const logos = Array(12).fill(null).map((_, i) => ({
    id: i,
    url: BRAND.logoUrl,
    name: BRAND.name
  }));

  return (
    <div className="relative w-full overflow-hidden bg-background py-20 border-y border-border/50">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-gs-cyan/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-gs-purple/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 mb-16 text-center relative z-10">
        <p className="text-sm font-semibold tracking-[0.4em] uppercase text-gs-cyan mb-4 animate-pulse">Trusted by Industry Leaders</p>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight max-w-2xl mx-auto leading-tight">
          Connecting people and businesses across the <span className="text-gradient">global ecosystem.</span>
        </h2>
      </div>

      <div className="flex flex-col gap-8 relative z-10">
        {/* Row 1: Left to Right */}
        <Marquee direction="left" speed={30} className="[--gap:4rem]">
          {logos.map((logo) => (
            <div key={`left-${logo.id}`} className="flex items-center gap-6 opacity-40 hover:opacity-100 transition-all duration-500 cursor-default group">
              <div className="relative">
                <div className="absolute inset-0 bg-gs-cyan/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                <img 
                  src={logo.url} 
                  alt={logo.name} 
                  className="h-10 w-10 md:h-12 md:w-12 object-contain group-hover:scale-110 transition-transform relative" 
                />
              </div>
              <span className="text-2xl md:text-3xl font-black tracking-tighter italic uppercase text-muted-foreground group-hover:text-foreground transition-colors">
                {logo.name}
              </span>
            </div>
          ))}
        </Marquee>

        {/* Row 2: Right to Left */}
        <Marquee direction="right" speed={35} className="[--gap:4rem]">
          {logos.map((logo) => (
            <div key={`right-${logo.id}`} className="flex items-center gap-6 opacity-40 hover:opacity-100 transition-all duration-500 cursor-default group">
              <div className="relative">
                <div className="absolute inset-0 bg-gs-coral/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                <img 
                  src={logo.url} 
                  alt={logo.name} 
                  className="h-10 w-10 md:h-12 md:w-12 object-contain group-hover:scale-110 transition-transform relative" 
                />
              </div>
              <span className="text-2xl md:text-3xl font-black tracking-tighter italic uppercase text-muted-foreground group-hover:text-foreground transition-colors">
                {logo.name}
              </span>
            </div>
          ))}
        </Marquee>
      </div>

      {/* Edge Fades */}
      <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-background via-background/80 to-transparent z-20" />
      <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-background via-background/80 to-transparent z-20" />
    </div>
  );
}
