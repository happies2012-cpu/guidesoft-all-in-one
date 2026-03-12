import { BrandLogo } from "@/components/BrandLogo";

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gs-coral via-gs-cyan to-gs-purple opacity-30 blur-xl animate-pulse-slow" />
          <BrandLogo
            showText={false}
            imageClassName="h-12 w-12 relative animate-spin-slow rounded-2xl"
          />
        </div>
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
