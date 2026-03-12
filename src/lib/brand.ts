export const BRAND = {
  name: "GUIDESOFT",
  shortName: "Guidesoft",
  logoUrl: "/logo.png",
  siteUrl: "https://www.guideitsol.com",
  supportEmail: "praveenkumar.kanneganti@gmail.com",
  paymentUpiId: "8884162999-4@ybl",
  paymentAmount: 99,
} as const;

export const SECTION_LINKS = {
  features: "#features",
  industries: "#industries",
  pricing: "#pricing",
  contact: BRAND.siteUrl,
} as const;
