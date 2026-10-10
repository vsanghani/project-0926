import type { MatchResult, ViabilityRadar, WedgeAngle } from "./types";

export function generateViabilityRadar(idea: string, matches: MatchResult[]): ViabilityRadar {
  const topMatch = matches[0];
  const topScore = topMatch?.score ?? 0;
  const matchCount = matches.length;
  const ideaLower = idea.toLowerCase();

  // 1. Saturation Score & Level
  let saturationScore = 15;
  let saturationLevel: ViabilityRadar["saturationLevel"] = "Low / Untapped";
  let saturationComment = "Zero direct competitors found in our catalog. You may be entering an uncrowded niche or creating a brand new wedge.";

  if (topScore >= 70) {
    saturationScore = Math.min(96, Math.round(52 + topScore * 0.44));
    saturationLevel = "High / Crowded";
    saturationComment = `Direct live competitors like ${topMatch.app.name} already occupy this core value proposition.`;
  } else if (topScore >= 40 || matchCount >= 4) {
    saturationScore = Math.min(72, Math.round(30 + topScore * 0.5));
    saturationLevel = "Moderate Competition";
    saturationComment = `Adjacent live products exist (nearest: ${topMatch.app.name}), but none are a 1-to-1 carbon copy of your angle.`;
  } else if (matchCount > 0) {
    saturationScore = Math.max(22, Math.round(topScore * 0.8));
    saturationLevel = "Low / Untapped";
    saturationComment = `Only distant cousins exist. There is clear whitespace for a focused product here.`;
  }

  // 2. Wedge Potential Score & Level
  let wedgePotentialScore = 88;
  let wedgePotentialLevel: ViabilityRadar["wedgePotentialLevel"] = "Expansive Whitespace";

  if (saturationScore >= 75) {
    wedgePotentialScore = Math.max(35, 110 - saturationScore);
    wedgePotentialLevel = "Narrow Angle Needed";
  } else if (saturationScore >= 45) {
    wedgePotentialScore = Math.max(65, 115 - saturationScore);
    wedgePotentialLevel = "Defined Wedge";
  } else {
    wedgePotentialScore = Math.min(95, 120 - saturationScore);
    wedgePotentialLevel = "Expansive Whitespace";
  }

  // 3. Speed to MVP
  let speedToMvp: ViabilityRadar["speedToMvp"] = "1-3 Days (Micro-MVP)";
  const complexKeywords = ["fintech", "banking", "compliance", "hipaa", "crypto", "marketplace", "social network", "video streaming"];
  const saasKeywords = ["ai", "llm", "agent", "crawler", "extension", "api", "database", "analytics", "automation", "stripe", "sync"];

  if (complexKeywords.some((word) => ideaLower.includes(word))) {
    speedToMvp = "1-2 Months (Deep Tech / Platform)";
  } else if (saasKeywords.some((word) => ideaLower.includes(word)) || topMatch?.app.category.toLowerCase().includes("ai")) {
    speedToMvp = "1-2 Weeks (Standard SaaS)";
  }

  // 4. Monetization Model
  let monetizationModel = "Freemium with Pro unlock ($9–$19/mo or $49 lifetime pass)";
  const oneTimeKeywords = ["boilerplate", "template", "starter", "icon", "theme", "asset", "kit"];
  const b2bKeywords = ["sales", "crm", "lead", "enterprise", "team", "security", "recruiting", "pipeline"];

  if (oneTimeKeywords.some((word) => ideaLower.includes(word))) {
    monetizationModel = "Pay-once lifetime license ($49–$149) or tiered asset packs";
  } else if (b2bKeywords.some((word) => ideaLower.includes(word))) {
    monetizationModel = "Seat-based B2B SaaS ($29–$99/user/month) with free trial";
  } else if (topMatch?.app.category.toLowerCase().includes("ai")) {
    monetizationModel = "Credit-based usage or $19–$39/month recurring subscription";
  }

  // 5. Strategic Differentiation Angles (3 Wedges)
  const angles: WedgeAngle[] = [
    {
      id: "vertical",
      title: "The Vertical Wedge: Hyper-Specific ICP",
      badge: "Target Audience",
      hook: topMatch ? `Don't fight ${topMatch.app.name} horizontally.` : "Own a tight, passionate vertical.",
      description: topMatch
        ? `${topMatch.app.name} caters to a wide audience. You can win by targeting one specific persona (e.g. video creators, freelance designers, technical solo-founders) and optimizing every single workflow for their exact jargon and constraints.`
        : "Niche down from a general tool to a specific trade. Vertical solutions convert at 3-5x the rate of generic alternatives because users feel the product was custom-built for them.",
      exampleAction: "Replace generic onboarding with industry-tailored presets and templates.",
    },
    {
      id: "workflow",
      title: "The Friction Wedge: Unbundle the Interface",
      badge: "Delivery & UX",
      hook: topMatch ? `Meet users where ${topMatch.app.name} forces another browser tab.` : "Eliminate login friction.",
      description: topMatch
        ? `Most incumbents require users to log in, browse dashboards, and manually click buttons. Win on raw speed by delivering your wedge as a native menu bar app, Raycast/Alfred extension, CLI, or keyboard-first tool.`
        : "Strip away the bloated 80% of secondary features. Build a single-purpose micro-tool that accomplishes the core job in 5 seconds without requiring an account or browser navigation.",
      exampleAction: "Package the core utility into a zero-latency desktop shortcut or webhook.",
    },
    {
      id: "pricing",
      title: "The Business Model Wedge: Pay-Once vs SaaS Fatigue",
      badge: "Monetization",
      hook: "Capitalize on modern subscription fatigue.",
      description: topMatch
        ? `Users are exhausted by paying monthly recurring fees for tools they only touch a few times a week. Counter ${topMatch.app.maker || topMatch.app.name}'s recurring subscription with a transparent pay-once license or Bring-Your-Own-Key (BYOK) model.`
        : "Offer an indie-friendly pricing model: a one-time purchase ($29–$49) or generous free tier with zero recurring lock-in to jumpstart early organic adoption.",
      exampleAction: "Launch on Product Hunt and Twitter with a limited lifetime deal to bootstrap early cash flow.",
    },
  ];

  return {
    saturationScore,
    saturationLevel,
    saturationComment,
    wedgePotentialScore,
    wedgePotentialLevel,
    speedToMvp,
    monetizationModel,
    angles,
    closestCompetitorName: topMatch?.app.name,
    closestCompetitorGap: topMatch?.app.gap,
  };
}
