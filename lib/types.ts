export type SourceId =
  | "indie-products"
  | "product-hunt"
  | "indie-hackers"
  | "directories";

export type LiveApp = {
  id: string;
  name: string;
  url: string;
  tagline: string;
  description: string;
  category: string;
  tags: string[];
  sourceId: SourceId;
  maker: string;
  year?: number;
  featured?: boolean;
  gap: string;
};

export type Source = {
  id: SourceId;
  name: string;
  short: string;
  blurb: string;
  site: string;
  countLabel: string;
};

export type MatchResult = {
  app: LiveApp;
  score: number;
  reasons: string[];
};

export type IdeaExample = {
  label: string;
  text: string;
};

export type WedgeAngle = {
  id: "vertical" | "workflow" | "pricing";
  title: string;
  badge: string;
  hook: string;
  description: string;
  exampleAction: string;
};

export type ViabilityRadar = {
  saturationScore: number;
  saturationLevel: "Low / Untapped" | "Moderate Competition" | "High / Crowded";
  saturationComment: string;
  wedgePotentialScore: number;
  wedgePotentialLevel: "Expansive Whitespace" | "Defined Wedge" | "Narrow Angle Needed";
  speedToMvp: "1-3 Days (Micro-MVP)" | "1-2 Weeks (Standard SaaS)" | "1-2 Months (Deep Tech / Platform)";
  monetizationModel: string;
  angles: WedgeAngle[];
  closestCompetitorName?: string;
  closestCompetitorGap?: string;
};

export type SharedScan = {
  id: string;
  scanId?: string;
  idea: string;
  summary: string;
  matches: MatchResult[];
  intelligence: ViabilityRadar;
  createdAt: string;
  viewCount: number;
};

