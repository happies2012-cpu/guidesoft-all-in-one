import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  imageClassName?: string;
  textClassName?: string;
  showText?: boolean;
}

export function BrandLogo({
  className,
  imageClassName,
  textClassName,
  showText = true,
}: BrandLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <img
        src={BRAND.logoUrl}
        alt={BRAND.name}
        className={cn("h-10 w-10 rounded-xl object-contain", imageClassName)}
        loading="lazy"
      />
      {showText ? (
        <span className={cn("text-lg font-bold tracking-[0.18em]", textClassName)}>
          {BRAND.name}
        </span>
      ) : null}
    </span>
  );
}
