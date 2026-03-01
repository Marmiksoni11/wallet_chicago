// src/types/index.ts — WindyWallet v2

export type Category = "mobile" | "internet" | "transit" | "insurance" | "streaming";

export type DiscountType =
  | "veteran"
  | "disability"
  | "senior"
  | "frontline"
  | "lowincome"
  | "child";

export type CoverageLevel = "basic" | "standard" | "premium";
export type DatacapOption = "yes" | "no";
export type CommuteType = "loop-only" | "suburb-loop" | "mixed";

// ── Bill input shapes ────────────────────────────────────────
export interface MobileBill {
  provider: string;
  cost: number;
  data: string;
  lines: number;
  hotspot: boolean;
  intl: boolean;
}

export interface InternetBill {
  provider: string;
  cost: number;
  speed: number;
  datacap: DatacapOption;
}

export interface TransitBill {
  mode: string;
  cost: number;
  freq: number;
  commute: CommuteType;
}

export interface InsuranceBill {
  insType: "renters" | "auto" | "health" | "";
  cost: number;
  deductible: number;
  coverage: CoverageLevel;
}

export interface StreamingBill {
  services: string[];   // list of current providers
  cost: number;         // total monthly
  quality: "SD" | "HD" | "4K";
  wantLive: boolean;
  screens: number;
}

export interface Bills {
  mobile: MobileBill;
  internet: InternetBill;
  transit: TransitBill;
  insurance: InsuranceBill;
  streaming: StreamingBill;
}

// ── Wallet (selected plans) ──────────────────────────────────
export interface SelectedPlan {
  category: Category;
  planId: string;
  planName: string;
  previousCost: number;
  newCost: number;
  monthlySaving: number;
  annualSaving: number;
  selectedAt: string; // ISO date
}

export interface WalletState {
  selectedPlans: SelectedPlan[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
}

// ── Analysis request ─────────────────────────────────────────
export interface AnalyzeRequest {
  zip: string;
  categories: Category[];
  bills: Bills;
  discounts: DiscountType[];
  childCount: number;
}

// ── Analysis result ──────────────────────────────────────────
export interface AlternativePlan {
  planId: string;
  provider: string;
  cost: number;
  features: string[];
  isChicagoLocal?: boolean;
  localTag?: string;
  isCheapest?: boolean;
  isBestValue?: boolean;
  note?: string;
}

export interface ComparisonResult {
  category: Category;
  label: string;
  currentProvider: string;
  currentCost: number;
  currentFeatures?: string[];
  // Legacy fields for simple display
  altProvider?: string;
  altCost?: number;
  altFeatures?: string[];
  // Multi-option recommendations
  alternatives?: AlternativePlan[];
  saving: number;
  discountApplied: boolean;
  alreadyOptimal: boolean;
  message?: string;
  note?: string;
}

export interface AnalyzeResponse {
  success: boolean;
  zip: string;
  discountMultiplier: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  results: ComparisonResult[];
}

// ── Form state ───────────────────────────────────────────────
export interface FormState {
  zip: string;
  address: string;
  budget: { total: string; utilities: string; personal: string; other: string };
  categories: Category[];
  bills: Bills;
  discounts: DiscountType[];
  childCount: number;
  attested: boolean;
}

// ── Auth ─────────────────────────────────────────────────────
export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  zip?: string;
  wallet?: WalletState;
}
