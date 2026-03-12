import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPagePath } from "@/lib/marketing-pages";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "for early rollout",
    description: "Ideal for pilots and evaluation teams.",
    features: [
      "Core platform modules",
      "Single workspace setup",
      "Standard onboarding",
      "Community support",
    ],
  },
  {
    name: "Growth",
    price: "$29",
    period: "per member / month",
    description: "Built for active teams and creator businesses.",
    features: [
      "Expanded storage and messaging",
      "Role-driven team controls",
      "Premium support SLA",
      "Advanced content workflows",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contract pricing",
    description: "For regulated or large-scale operations.",
    features: [
      "SSO and policy enforcement",
      "Self-hosted deployment",
      "Dedicated implementation support",
      "Custom security reviews",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">Pricing That Matches Real Delivery Stages</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start with pilot mode, grow into full operations, and move to enterprise control when required.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-2xl border p-7 ${
                plan.highlight
                  ? "border-gs-cyan/60 bg-card shadow-lg shadow-gs-cyan/10"
                  : "border-border/60 bg-card/85"
              }`}
            >
              <h3 className="text-2xl font-semibold">{plan.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              <div className="mt-5">
                <p className="text-4xl font-bold">{plan.price}</p>
                <p className="text-sm text-muted-foreground">{plan.period}</p>
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 text-gs-green" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant={plan.highlight ? "brand" : "outline"} className="mt-7 w-full" asChild>
                <Link to="/auth">
                  Choose {plan.name}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to={getPagePath("pricing")} className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Open full pricing page
          </Link>
        </div>
      </div>
    </section>
  );
}
