import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  direction?: "left" | "right";
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
}

export function Marquee({
  children,
  direction = "left",
  speed = 20,
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current) return;

    const container = containerRef.current;
    const scroller = scrollerRef.current;

    const scrollerContent = Array.from(scroller.children);
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      scroller.appendChild(duplicatedItem);
    });

    container.style.setProperty("--animation-duration", `${speed}s`);
    container.style.setProperty(
      "--animation-direction",
      direction === "left" ? "forwards" : "reverse"
    );
  }, [speed, direction]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-8 py-4 w-max flex-nowrap",
          "animate-marquee",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {children}
      </ul>
    </div>
  );
}
