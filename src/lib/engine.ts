// src/lib/engine.ts — WindyWallet v2

import {
  MOBILE_PLANS, INTERNET_PLANS, INSURANCE_PLANS, STREAMING_PLANS, TRANSIT_LABELS,
  type MobilePlan, type InternetPlan, type StreamingPlan,
} from "./plans";
import type {
  MobileBill, InternetBill, TransitBill, InsuranceBill, StreamingBill,
  ComparisonResult, AlternativePlan, DiscountType,
} from "@/types";

const COV_RANK = { basic: 0, standard: 1, premium: 2 } as const;

// ── Discount multiplier (max 38%) ───────────────────────────
export function calcDiscountMultiplier(discounts: DiscountType[], childCount: number): number {
  let m = 0;
  if (discounts.includes("veteran"))    m += 0.08;
  if (discounts.includes("disability")) m += 0.10;
  if (discounts.includes("senior"))     m += 0.10;
  if (discounts.includes("frontline"))  m += 0.07;
  if (discounts.includes("lowincome"))  m += 0.12;
  if (discounts.includes("child"))      m += 0.05 * Math.min(childCount, 5);
  return Math.min(m, 0.38);
}

function round2(n: number): number { return Math.round(n * 100) / 100; }

function planToAlt(plan: MobilePlan | InternetPlan | StreamingPlan | any, cost: number, labels: string[], flags: Partial<AlternativePlan> = {}): AlternativePlan {
  return {
    planId: plan.id,
    provider: plan.provider,
    cost: round2(cost),
    features: labels,
    isChicagoLocal: plan.isChicagoLocal,
    localTag: plan.localTag,
    note: plan.note,
    ...flags,
  };
}

// ── Mobile ───────────────────────────────────────────────────
export function analyzeMobile(bill: MobileBill, discMult: number, discounts: DiscountType[]): ComparisonResult {
  const isSenior = discounts.includes("senior");

  let candidates = MOBILE_PLANS.filter((p: MobilePlan) => {
    if (bill.hotspot && !p.hotspot) return false;
    if (bill.intl && !p.intl) return false;
    if (p.linesMax < bill.lines) return false;
    if (bill.data === "unlimited" && p.data !== "unlimited") return false;
    return p.cost * (1 - discMult) < bill.cost;
  });

  candidates.sort((a, b) => a.cost * (1 - discMult) - b.cost * (1 - discMult));
  if (isSenior) {
    const cc = candidates.find(p => p.provider.includes("Consumer"));
    if (cc) candidates = [cc, ...candidates.filter(p => p !== cc)];
  }

  if (!candidates.length) {
    return {
      category: "mobile", label: "Mobile / Telephone",
      currentProvider: bill.provider || "Current Carrier",
      currentCost: bill.cost, alreadyOptimal: true, saving: 0, discountApplied: false,
      message: `Your plan at $${bill.cost}/mo is already competitive for the features you need.`,
    };
  }

  // Build top 3 alternatives
  const top3 = candidates.slice(0, 4);
  const cheapest = top3[0];
  const bestValue = top3.find(p => p.isChicagoLocal) ?? top3[Math.min(1, top3.length - 1)];

  const alternatives: AlternativePlan[] = top3.map((p, i) => {
    const cost = round2(p.cost * (1 - discMult));
    return planToAlt(p, cost, [
      p.data === "unlimited" ? "Unlimited data" : `${p.data} GB/mo`,
      p.hotspot ? "Hotspot included" : "No hotspot",
      p.intl ? "International included" : "Domestic only",
    ], {
      isCheapest: i === 0,
      isBestValue: p === bestValue && i !== 0,
    });
  });

  const best = top3[0];
  const altCost = round2(best.cost * (1 - discMult));

  return {
    category: "mobile", label: "Mobile / Telephone",
    currentProvider: bill.provider || "Current Carrier",
    currentCost: bill.cost,
    currentFeatures: [
      bill.data === "unlimited" ? "Unlimited data" : `${bill.data} GB/mo`,
      `${bill.lines} line${bill.lines > 1 ? "s" : ""}`,
      bill.hotspot ? "Hotspot included" : "No hotspot",
      bill.intl ? "International enabled" : "Domestic only",
    ],
    altProvider: best.provider, altCost,
    altFeatures: [
      best.data === "unlimited" ? "Unlimited data" : `${best.data} GB/mo`,
      best.hotspot ? "Hotspot included" : "Basic hotspot",
      best.intl ? "International included" : "Domestic only",
      best.note,
    ],
    alternatives,
    saving: round2(bill.cost - altCost),
    discountApplied: discMult > 0,
    alreadyOptimal: false,
  };
}

// ── Internet ─────────────────────────────────────────────────
export function analyzeInternet(bill: InternetBill, discMult: number, discounts: DiscountType[]): ComparisonResult {
  const isLowincome = discounts.includes("lowincome");

  let candidates = INTERNET_PLANS.filter((p: InternetPlan) => {
    if (p.eligibility === "lowincome" && !isLowincome) return false;
    if (p.speed < bill.speed * 0.5) return false;
    const eff = p.cost * (p.eligibility ? 1 : 1 - discMult);
    return eff < bill.cost;
  });

  candidates.sort((a, b) => {
    const ea = a.cost * (a.eligibility ? 1 : 1 - discMult);
    const eb = b.cost * (b.eligibility ? 1 : 1 - discMult);
    return ea - eb;
  });

  if (bill.datacap === "no") {
    const noCap = candidates.filter(p => !p.datacap);
    if (noCap.length) candidates = noCap;
  }

  if (!candidates.length) {
    return {
      category: "internet", label: "WiFi / Internet",
      currentProvider: bill.provider || "Current ISP",
      currentCost: bill.cost, alreadyOptimal: true, saving: 0, discountApplied: false,
      message: `At $${bill.cost}/mo for ${bill.speed} Mbps, your internet is already competitive in Chicago.`,
    };
  }

  const top3 = candidates.slice(0, 4);
  const best = top3[0];

  const alternatives: AlternativePlan[] = top3.map((p, i) => {
    const mult = p.eligibility ? 1 : 1 - discMult;
    const cost = round2(p.cost * mult);
    return planToAlt(p, cost, [`${p.speed} Mbps download`, "No data cap", p.note], {
      isCheapest: i === 0,
      isBestValue: p.isChicagoLocal || i === 1,
    });
  });

  const mult = best.eligibility ? 1 : 1 - discMult;
  const altCost = round2(best.cost * mult);

  return {
    category: "internet", label: "WiFi / Internet",
    currentProvider: bill.provider || "Current ISP",
    currentCost: bill.cost,
    currentFeatures: [`${bill.speed} Mbps download`, bill.datacap === "yes" ? "Has data cap" : "No data cap"],
    altProvider: best.provider, altCost,
    altFeatures: [`${best.speed} Mbps download`, "No data cap", best.note],
    alternatives,
    saving: round2(bill.cost - altCost),
    discountApplied: discMult > 0 && !best.eligibility,
    alreadyOptimal: false,
    note: best.eligibility ? "⚠️ Income-qualified program — eligibility verification required." : undefined,
  };
}

// ── Streaming ─────────────────────────────────────────────────
export function analyzeStreaming(bill: StreamingBill, discMult: number): ComparisonResult {
  // Filter plans user might not already have
  const notHaving = STREAMING_PLANS.filter(p => !bill.services.includes(p.provider));

  let candidates = STREAMING_PLANS.filter(p => {
    if (bill.wantLive && !p.hasLive) return false;
    if (bill.screens > p.screens) return false;
    if (p.cost >= bill.cost) return false;
    return true;
  });

  candidates.sort((a, b) => a.cost - b.cost);

  // Also build a bundle suggestion
  const cheapBundle = buildCheapBundle(bill);

  if (!candidates.length && !cheapBundle) {
    return {
      category: "streaming", label: "Streaming / Entertainment",
      currentProvider: bill.services.join(" + ") || "Current streaming bundle",
      currentCost: bill.cost, alreadyOptimal: true, saving: 0, discountApplied: false,
      message: `At $${bill.cost}/mo your streaming spend is already competitive. Consider student/promotional bundles for more savings.`,
    };
  }

  const top3 = candidates.slice(0, 3);
  const alternatives: AlternativePlan[] = top3.map((p, i) => {
    const cost = round2(p.cost * (1 - discMult * 0.3)); // smaller discount for streaming
    return planToAlt(p, cost, [
      `${p.quality} quality`, `${p.screens} screens`,
      p.hasAds ? "Has ads" : "Ad-free",
      p.hasLive ? "Includes live TV" : "On-demand only",
    ], { isCheapest: i === 0 });
  });

  if (cheapBundle) {
    alternatives.push({
      planId: "bundle-rec",
      provider: cheapBundle.label,
      cost: cheapBundle.cost,
      features: cheapBundle.features,
      isBestValue: true,
      note: "Best bundle recommendation based on your needs",
    });
  }

  const best = cheapBundle ?? { cost: top3[0]?.cost ?? bill.cost, label: top3[0]?.provider };
  const altCost = round2(best.cost * (1 - discMult * 0.2));

  return {
    category: "streaming", label: "Streaming / Entertainment",
    currentProvider: bill.services.join(" + ") || "Current streaming services",
    currentCost: bill.cost,
    currentFeatures: [
      `${bill.services.length} service${bill.services.length !== 1 ? "s" : ""}`,
      bill.quality + " quality",
      bill.wantLive ? "Live TV required" : "On-demand only",
      `${bill.screens} screen${bill.screens !== 1 ? "s" : ""}`,
    ],
    altProvider: (cheapBundle?.label ?? top3[0]?.provider) ?? "Recommended Bundle",
    altCost,
    altFeatures: cheapBundle?.features ?? [top3[0]?.note ?? ""],
    alternatives,
    saving: round2(bill.cost - altCost),
    discountApplied: discMult > 0,
    alreadyOptimal: false,
    note: "Streaming prices reflect 2024 standard rates. Annual plans may offer additional savings.",
  };
}

function buildCheapBundle(bill: StreamingBill): { label: string; cost: number; features: string[] } | null {
  // Suggest a smart bundle
  if (bill.wantLive) {
    // Hulu + Live TV or YouTube TV
    if (bill.cost > 80) {
      return { label: "Hulu with Live TV bundle", cost: 77, features: ["Live TV + On-demand", "50+ channels", "Disney+ & ESPN+ included", "Unlimited DVR"] };
    }
  }
  if (bill.screens <= 2 && !bill.wantLive && bill.cost > 30) {
    return { label: "Disney+, Hulu (ads), ESPN+ bundle", cost: 14, features: ["3 services in 1 price", "Disney, Hulu, ESPN+", "Ad-supported", "Great for families"] };
  }
  return null;
}

// ── Transit ───────────────────────────────────────────────────
export function analyzeTransit(bill: TransitBill, discounts: DiscountType[]): ComparisonResult {
  const isSeniorOrDisabled = discounts.includes("senior") || discounts.includes("disability");
  const isLowincome = discounts.includes("lowincome");
  const monthly = Math.round((bill.freq || 10) * 4.3);

  let rec: { option: string; cost: number; note: string } | null = null;

  if (bill.commute === "suburb-loop") {
    if (isSeniorOrDisabled) {
      rec = { option: "Metra Reduced Fare Monthly", cost: 53, note: "Seniors/disabled qualify for 50% off Metra fares. Apply at Metra.com/Reduced." };
    } else if (bill.mode === "rideshare" || bill.mode === "car") {
      rec = { option: "Metra Zone A Monthly Pass", cost: 106, note: "Replacing rideshare/car with Metra significantly cuts commute cost. Saves Chicago parking (~$25–40/day)." };
    } else if (!bill.mode.startsWith("metra")) {
      rec = { option: "Metra Zone A Monthly Pass", cost: 106, note: "Best for daily suburb-to-Chicago commuters. All Loop terminal stations covered." };
    }
  } else if (bill.commute === "loop-only") {
    if (isSeniorOrDisabled || isLowincome) {
      rec = { option: "CTA Reduced Fare 30-Day Pass", cost: 50, note: "Seniors 65+, disabled, and income-qualified riders pay $50 vs $105. Apply at any Ventra kiosk." };
    } else if (monthly < 25) {
      const payCost = Math.round(monthly * 2.25);
      rec = { option: "CTA Ventra Pay-Per-Ride", cost: payCost, note: `At ~${bill.freq} trips/week (~${monthly}/mo) pay-per-ride at $2.25 costs ~$${payCost}/mo — less than the $105 pass.` };
    } else {
      rec = { option: "CTA 30-Day Unlimited Pass (Ventra)", cost: 105, note: "At your usage the Unlimited Pass is most economical. Covers all CTA L and bus in Chicago." };
    }
  } else {
    if (isSeniorOrDisabled) {
      rec = { option: "CTA Reduced Fare 30-Day Pass", cost: 50, note: "Reduced fare saves $55/month vs standard. Valid on all CTA routes." };
    } else {
      rec = { option: "CTA 30-Day Unlimited Pass (Ventra)", cost: 105, note: "Best for mixed neighborhood + downtown transit. Covers buses and all L lines." };
    }
  }

  const currentLabel = TRANSIT_LABELS[bill.mode] ?? bill.mode;

  if (!rec || rec.cost >= bill.cost) {
    return {
      category: "transit", label: "Transit",
      currentProvider: currentLabel, currentCost: bill.cost,
      alreadyOptimal: true, saving: 0, discountApplied: false,
      message: rec ? `Your current plan suits your commute. ${rec.note}` : `At $${bill.cost}/mo your transit spend matches the best available option.`,
    };
  }

  return {
    category: "transit", label: "Transit",
    currentProvider: currentLabel, currentCost: bill.cost,
    currentFeatures: [
      `${bill.freq} trips/week (~${monthly}/mo)`,
      bill.commute === "suburb-loop" ? "Suburb ↔ Chicago commute" : bill.commute === "mixed" ? "Mixed areas + neighborhood" : "Within Chicago area",
    ],
    altProvider: rec.option, altCost: rec.cost,
    altFeatures: [rec.note, "2024 official CTA / Metra fare tables"],
    alternatives: [{ planId: "transit-rec", provider: rec.option, cost: rec.cost, features: [rec.note], isCheapest: true, isBestValue: true }],
    saving: round2(bill.cost - rec.cost),
    discountApplied: isSeniorOrDisabled || isLowincome,
    alreadyOptimal: false,
    note: "Pricing sourced from official 2024 CTA and Metra fare tables.",
  };
}

// ── Insurance ─────────────────────────────────────────────────
export function analyzeInsurance(bill: InsuranceBill, discMult: number): ComparisonResult {
  const insKey = bill.insType || "renters";
  const pool = INSURANCE_PLANS[insKey] ?? INSURANCE_PLANS.renters;
  const labelMap: Record<string, string> = { renters: "Renters Insurance", auto: "Auto Insurance", health: "Health Insurance" };
  const label = labelMap[insKey] ?? "Insurance";

  let candidates = pool.filter(p => {
    if (COV_RANK[p.coverage] < COV_RANK[bill.coverage]) return false;
    return p.monthly * (1 - discMult) < bill.cost;
  });

  if (!candidates.length) {
    candidates = pool.filter(p => p.monthly * (1 - discMult) < bill.cost);
  }

  candidates.sort((a, b) => a.monthly * (1 - discMult) - b.monthly * (1 - discMult));

  if (!candidates.length) {
    return {
      category: "insurance", label,
      currentProvider: "Your Current Plan", currentCost: bill.cost,
      alreadyOptimal: true, saving: 0, discountApplied: false,
      message: `At $${bill.cost}/mo your ${insKey} insurance is already competitive. No cheaper equivalent found.`,
    };
  }

  const top3 = candidates.slice(0, 4);
  const best = top3[0];
  const altCost = round2(best.monthly * (1 - discMult));

  const alternatives: AlternativePlan[] = top3.map((p, i) => {
    const cost = round2(p.monthly * (1 - discMult));
    return planToAlt(p, cost, [
      `${p.coverage.charAt(0).toUpperCase() + p.coverage.slice(1)} coverage`,
      `$${p.deductible.toLocaleString()} deductible`,
      p.note,
    ], { isCheapest: i === 0, isBestValue: p.isChicagoLocal });
  });

  return {
    category: "insurance", label,
    currentProvider: "Your Current Plan", currentCost: bill.cost,
    currentFeatures: [
      `${bill.coverage.charAt(0).toUpperCase() + bill.coverage.slice(1)} coverage`,
      `$${bill.deductible.toLocaleString()} deductible`,
    ],
    altProvider: best.provider, altCost,
    altFeatures: [`${best.coverage} coverage`, `$${best.deductible.toLocaleString()} deductible`, best.note],
    alternatives,
    saving: round2(bill.cost - altCost),
    discountApplied: discMult > 0,
    alreadyOptimal: false,
    note: insKey === "health" ? "Health plan rates are illustrative. Actual premiums vary by age, income, and plan year." : undefined,
  };
}
