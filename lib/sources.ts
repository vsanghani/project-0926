import type { Source } from "./types";

export const sources: Source[] = [
  {
    id: "indie-products",
    name: "Indie products",
    short: "Indie",
    blurb:
      "Bootstrapped products already live — ShipFast, Nomad List, HeadshotPro, Chatbase, and other sites with real users.",
    site: "https://www.indiehackers.com",
    countLabel: "Live products",
  },
  {
    id: "product-hunt",
    name: "Product Hunt",
    short: "Product Hunt",
    blurb:
      "Daily launches, category leaders, and tools that already survived a public launch.",
    site: "https://www.producthunt.com",
    countLabel: "Launch archive",
  },
  {
    id: "indie-hackers",
    name: "Indie Hackers",
    short: "Indie Hackers",
    blurb:
      "Milestone posts, revenue screenshots, and products people are actually running as businesses.",
    site: "https://www.indiehackers.com",
    countLabel: "Builder reports",
  },
  {
    id: "directories",
    name: "Directories",
    short: "Directories",
    blurb:
      "TrustMRR, AlternativeTo, Acquire.com — places where live products are listed, compared, and sometimes sold.",
    site: "https://trustmrr.com",
    countLabel: "Market lists",
  },
];
