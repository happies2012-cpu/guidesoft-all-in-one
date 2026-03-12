export interface TechStackItem {
  name: string;
  icon: string;
  summary: string;
}

export const techStack: TechStackItem[] = [
  {
    name: "React",
    icon: "https://cdn.simpleicons.org/react/61DAFB",
    summary: "Component-driven UI with responsive rendering.",
  },
  {
    name: "TypeScript",
    icon: "https://cdn.simpleicons.org/typescript/3178C6",
    summary: "Typed contracts for safer, maintainable releases.",
  },
  {
    name: "Vite",
    icon: "https://cdn.simpleicons.org/vite/646CFF",
    summary: "Fast local development and optimized production bundles.",
  },
  {
    name: "Tailwind CSS",
    icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4",
    summary: "Consistent design tokens and utility-first styling.",
  },
  {
    name: "Supabase",
    icon: "https://cdn.simpleicons.org/supabase/3ECF8E",
    summary: "Auth, Postgres, and policies in one managed platform.",
  },
  {
    name: "PostgreSQL",
    icon: "https://cdn.simpleicons.org/postgresql/4169E1",
    summary: "Relational data model with migration-driven workflows.",
  },
  {
    name: "Node.js",
    icon: "https://cdn.simpleicons.org/nodedotjs/5FA04E",
    summary: "Runtime foundation for scripts and CI tooling.",
  },
  {
    name: "Playwright",
    icon: "https://cdn.simpleicons.org/playwright/2EAD33",
    summary: "Automated browser tests for production confidence.",
  },
];
