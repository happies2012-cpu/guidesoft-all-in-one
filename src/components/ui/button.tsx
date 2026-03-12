import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md active:scale-[0.98]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-md",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] font-semibold",
        "hero-outline": "border-2 border-foreground/20 bg-transparent hover:bg-foreground/5 hover:border-foreground/40 font-semibold",
        brand: "bg-gradient-to-r from-[hsl(10,80%,65%)] via-[hsl(190,85%,55%)] to-[hsl(270,60%,60%)] text-white hover:opacity-90 hover:shadow-lg shadow-md font-semibold",
        coral: "bg-[hsl(10,80%,65%)] text-white hover:opacity-90 hover:shadow-lg",
        cyan: "bg-[hsl(190,85%,55%)] text-white hover:opacity-90 hover:shadow-lg",
        green: "bg-[hsl(155,70%,50%)] text-white hover:opacity-90 hover:shadow-lg",
        purple: "bg-[hsl(270,60%,60%)] text-white hover:opacity-90 hover:shadow-lg",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };