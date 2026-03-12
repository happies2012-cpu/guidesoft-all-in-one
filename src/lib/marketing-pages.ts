import { BRAND } from "@/lib/brand";

export interface MarketingLinkItem {
  label: string;
  slug: string;
}

export interface MarketingSection {
  title: string;
  description: string;
  image: string;
  points: string[];
}

export interface MarketingPage {
  slug: string;
  title: string;
  category: string;
  description: string;
  heroImage: string;
  ctaLabel: string;
  ctaHref: string;
  highlights: string[];
  sections: MarketingSection[];
  gallery: string[];
}

const IMAGES = [
  "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80",
];

const PAGE_SEEDS: Array<{
  slug: string;
  title: string;
  category: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}> = [
  {
    slug: "social",
    title: "Social",
    category: "Platform",
    description: "Create lively social spaces with discovery, profiles, reels, and moderation controls.",
  },
  {
    slug: "messaging",
    title: "Messaging",
    category: "Platform",
    description: "Run direct and group messaging with delivery reliability, controls, and archives.",
  },
  {
    slug: "streaming",
    title: "Streaming",
    category: "Platform",
    description: "Publish live and on-demand media with creator workflows and engagement metrics.",
  },
  {
    slug: "cloud-storage",
    title: "Cloud Storage",
    category: "Platform",
    description: "Store, share, and govern content with quota rules, lifecycle controls, and audit trails.",
  },
  {
    slug: "news-media",
    title: "News & Media",
    category: "Platform",
    description: "Support editorial teams with publishing pipelines, approvals, and distribution controls.",
  },
  {
    slug: "solutions",
    title: "Solutions",
    category: "Solutions",
    description: "Start from proven solution packs that match real execution and rollout needs.",
  },
  {
    slug: "enterprise",
    title: "Enterprise",
    category: "Solutions",
    description: "Enable enterprise governance with SSO, policy enforcement, and role-scoped operations.",
  },
  {
    slug: "creators",
    title: "Creators",
    category: "Solutions",
    description: "Give creators end-to-end control over audience growth, content, and monetization.",
  },
  {
    slug: "teams",
    title: "Teams",
    category: "Solutions",
    description: "Coordinate teams with shared spaces, async collaboration, and clear delivery workflows.",
  },
  {
    slug: "communities",
    title: "Communities",
    category: "Solutions",
    description: "Launch branded communities with membership rules, moderators, and content governance.",
  },
  {
    slug: "self-hosted",
    title: "Self-Hosted",
    category: "Solutions",
    description: "Deploy on your own infra with full control over data residency, policies, and release pace.",
  },
  {
    slug: "resources",
    title: "Resources",
    category: "Resources",
    description: "Find implementation guides, deployment playbooks, and operating checklists.",
  },
  {
    slug: "pricing",
    title: "Pricing",
    category: "Resources",
    description: "Select a pricing model that fits your team size, usage profile, and release goals.",
  },
  {
    slug: "company-site",
    title: "Company Site",
    category: "Resources",
    description: "Visit the official company website for services, updates, and direct outreach.",
    ctaLabel: "Open Company Site",
    ctaHref: BRAND.siteUrl,
  },
  {
    slug: "support-email",
    title: "Support Email",
    category: "Resources",
    description: "Reach platform support for onboarding, account activation, and production queries.",
    ctaLabel: "Email Support",
    ctaHref: `mailto:${BRAND.supportEmail}`,
  },
  {
    slug: "privacy",
    title: "Privacy",
    category: "Resources",
    description: "Review privacy commitments, data controls, and handling standards.",
  },
  {
    slug: "terms",
    title: "Terms",
    category: "Resources",
    description: "Understand platform terms, usage boundaries, and customer responsibilities.",
  },
  {
    slug: "company",
    title: "Company",
    category: "Company",
    description: "Understand GUIDESOFT mission, product direction, and engineering delivery model.",
  },
  {
    slug: "about",
    title: "About",
    category: "Company",
    description: "Learn how GUIDESOFT approaches product strategy, quality, and customer delivery.",
  },
  {
    slug: "contact",
    title: "Contact",
    category: "Company",
    description: "Connect with the team for demos, implementation planning, and partnership discussions.",
  },
  {
    slug: "admin-access",
    title: "Admin Access",
    category: "Company",
    description: "Access the secure admin workflow for payment review, governance, and platform control.",
    ctaLabel: "Open Admin Access",
    ctaHref: "/auth",
  },
  {
    slug: "payments",
    title: "Payments",
    category: "Company",
    description: "Track registration payments, verification, and approval states with clear status flow.",
    ctaLabel: "Open Payment Flow",
    ctaHref: "/auth",
  },
  {
    slug: "guidesoft",
    title: "GUIDESOFT",
    category: "Company",
    description: "One operating platform connecting social, media, messaging, and enterprise execution.",
  },
];

const getSectionCopy = (title: string, category: string, topic: string) => {
  const topicLower = topic.toLowerCase();

  if (category === "Resources") {
    return {
      title: `${title} Planning`,
      description: `Use ${topicLower} guidance to shorten setup time and reduce rollout risk.`,
      points: [
        "Implementation notes from real deployment paths",
        "Actionable checklist for launch preparation",
        "Clear owners for each critical handoff",
      ],
    };
  }

  if (category === "Company") {
    return {
      title: `${title} Operations`,
      description: `Connect ${topicLower} workflows with accountable ownership and measurable outcomes.`,
      points: [
        "Defined responsibility boundaries",
        "Governed approvals for high-impact actions",
        "Consistent visibility across teams",
      ],
    };
  }

  return {
    title: `${title} Experience`,
    description: `Shape a practical ${topicLower} experience with strong defaults and room to scale.`,
    points: [
      "Production-first interface patterns",
      "Role-aware flow and permission controls",
      "Monitoring hooks for release confidence",
    ],
  };
};

export const marketingPages: MarketingPage[] = PAGE_SEEDS.map((seed, index) => {
  let imageA = IMAGES[index % IMAGES.length];
  
  // Use realistic local images for specific slugs
  if (seed.slug === "social") imageA = "/assets/industries/social.png";
  if (seed.slug === "messaging") imageA = "/assets/industries/messaging.png";
  if (seed.slug === "streaming") imageA = "/assets/industries/streaming.png";
  if (seed.slug === "cloud-storage") imageA = "/assets/industries/cloud.png";
  
  const imageB = IMAGES[(index + 2) % IMAGES.length];
  const imageC = IMAGES[(index + 4) % IMAGES.length];

  const controlSection = getSectionCopy(seed.title, seed.category, "control layer");
  const deliverySection = getSectionCopy(seed.title, seed.category, "delivery flow");
  const growthSection = getSectionCopy(seed.title, seed.category, "growth layer");

  return {
    slug: seed.slug,
    title: seed.title,
    category: seed.category,
    description: seed.description,
    heroImage: imageA,
    ctaLabel: seed.ctaLabel || `Explore ${seed.title}`,
    ctaHref: seed.ctaHref || "/auth",
    highlights: [
      `${seed.title} onboarding flow`,
      `${seed.title} operations dashboard`,
      `${seed.title} governance controls`,
      `${seed.title} launch readiness`,
    ],
    sections: [
      {
        title: controlSection.title,
        description: controlSection.description,
        image: imageA,
        points: controlSection.points,
      },
      {
        title: `${seed.title} Delivery`,
        description: deliverySection.description,
        image: imageB,
        points: deliverySection.points,
      },
      {
        title: `${seed.title} Scale`,
        description: growthSection.description,
        image: imageC,
        points: growthSection.points,
      },
    ],
    gallery: [imageA, imageB, imageC],
  };
});

export const marketingPageBySlug = Object.fromEntries(
  marketingPages.map((page) => [page.slug, page]),
) as Record<string, MarketingPage>;

export const getPagePath = (slug: string) => `/pages/${slug}`;

export const getMarketingPage = (slug?: string) => (slug ? marketingPageBySlug[slug] : undefined);

export const getRelatedPages = (slug: string, limit = 4) => {
  const current = marketingPageBySlug[slug];
  if (!current) return [];
  return marketingPages
    .filter((page) => page.category === current.category && page.slug !== current.slug)
    .slice(0, limit);
};

export const navigationGroups: Array<{ title: string; items: MarketingLinkItem[] }> = [
  {
    title: "Platform",
    items: [
      { label: "Social", slug: "social" },
      { label: "Messaging", slug: "messaging" },
      { label: "Streaming", slug: "streaming" },
      { label: "Cloud Storage", slug: "cloud-storage" },
      { label: "News & Media", slug: "news-media" },
    ],
  },
  {
    title: "Solutions",
    items: [
      { label: "Solutions", slug: "solutions" },
      { label: "Enterprise", slug: "enterprise" },
      { label: "Creators", slug: "creators" },
      { label: "Teams", slug: "teams" },
      { label: "Communities", slug: "communities" },
      { label: "Self-Hosted", slug: "self-hosted" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Resources", slug: "resources" },
      { label: "Pricing", slug: "pricing" },
      { label: "Company Site", slug: "company-site" },
      { label: "Support Email", slug: "support-email" },
      { label: "Privacy", slug: "privacy" },
      { label: "Terms", slug: "terms" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "Company", slug: "company" },
      { label: "About", slug: "about" },
      { label: "Contact", slug: "contact" },
      { label: "Admin Access", slug: "admin-access" },
      { label: "Payments", slug: "payments" },
      { label: "GUIDESOFT", slug: "guidesoft" },
    ],
  },
];
