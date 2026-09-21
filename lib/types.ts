export type SourceId =
  | "marc-lou"
  | "pieter-levels"
  | "indie-maker"
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
