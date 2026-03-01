"use client";
import { useState } from "react";
import { Eyebrow, PageTitle, Grad, Notice, BtnRow, Btn } from "./ui";
import type { AnalyzeResponse, ComparisonResult, AlternativePlan, FormState, DiscountType } from "@/types";

const EMOJI: Record<string, string> = { mobile: "📱", internet: "📡", transit: "🚇", insurance: "🛡️", streaming: "📺" };
const ICON_BG: Record<string, string> = {
  mobile: "bg-primary-light", internet: "bg-accent-light",
  transit: "bg-emerald-50", insurance: "bg-purple-50", streaming: "bg-orange-50",
};
const DISC_LABELS: Record<DiscountType, string> = {
  veteran: "Veteran", disability: "Disability", senior: "Senior",
  frontline: "Frontline Worker", lowincome: "Income-Qualified", child: "Family",
};

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5 animate-fade-up">
      <div className="w-11 h-11 rounded-full border-[3px] border-gray-200 border-t-primary animate-spin-slow" />
      <div className="text-base font-semibold text-gray-400">Analyzing your bills…</div>
      <div className="text-sm text-gray-300 text-center max-w-xs">
        Comparing Chicago providers and applying eligible discounts
      </div>
    </div>
  );
}

interface PlanCardProps {
  plan: AlternativePlan;
  currentCost: number;
  onSelect?: (plan: AlternativePlan) => void;
  isSelected?: boolean;
}

function PlanCard({ plan, currentCost, onSelect, isSelected }: PlanCardProps) {
  const saving = currentCost - plan.cost;
  return (
    <div className={`relative border-2 rounded-xl p-4 transition-all duration-200
      ${isSelected ? "border-emerald-400 bg-emerald-50" : plan.isChicagoLocal ? "border-amber-300 bg-amber-50/50" : "border-gray-100 bg-gray-50"}`}>
      {/* Badges */}
      <div className="flex flex-wrap gap-1 mb-2">
        {plan.isCheapest && <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">💰 Cheapest</span>}
        {plan.isBestValue && <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">⭐ Best Value</span>}
        {plan.isChicagoLocal && <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">{plan.localTag ?? "🏙 Chicago Local"}</span>}
        {isSelected && <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">✓ Selected</span>}
      </div>

      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-bold text-gray-900 mb-1">{plan.provider}</div>
          {plan.features?.slice(0, 3).map((f, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-0.5">
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${plan.isChicagoLocal ? "bg-amber-400" : "bg-emerald-400"}`} />{f}
            </div>
          ))}
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-display text-2xl font-extrabold text-emerald-600 tracking-tight">
            ${plan.cost.toFixed(2)}<span className="text-xs font-medium text-gray-300">/mo</span>
          </div>
          {saving > 0 && (
            <div className="text-xs text-emerald-600 font-semibold">Save ${saving.toFixed(2)}/mo</div>
          )}
        </div>
      </div>

      {onSelect && !isSelected && (
        <button
          onClick={() => onSelect(plan)}
          className="mt-3 w-full grad-bg text-white text-xs font-bold py-2 rounded-lg hover:opacity-90 transition-all">
          Select This Plan →
        </button>
      )}
      {isSelected && (
        <div className="mt-3 w-full bg-emerald-500 text-white text-xs font-bold py-2 rounded-lg text-center">
          ✓ Plan Selected — Added to Your Wallet
        </div>
      )}
    </div>
  );
}

interface SavingsModalProps {
  plan: AlternativePlan;
  currentCost: number;
  category: string;
  onClose: () => void;
  onConfirm: () => void;
}

function SavingsModal({ plan, currentCost, category, onClose, onConfirm }: SavingsModalProps) {
  const saving = currentCost - plan.cost;
  const annual = saving * 12;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-up">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-100">
        <div className="text-center mb-5">
          <div className="text-4xl mb-3">🎉</div>
          <div className="font-display text-2xl font-extrabold text-gray-900 mb-1">Great choice!</div>
          <div className="text-sm text-gray-400">Here's your savings summary</div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Previous monthly cost</span>
            <span className="font-bold text-gray-400 line-through">${currentCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">New plan ({plan.provider})</span>
            <span className="font-bold text-emerald-600">${plan.cost.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 flex justify-between">
            <span className="font-bold text-gray-700">Monthly savings</span>
            <span className="font-extrabold text-emerald-600">${saving.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold text-gray-700">Annual savings</span>
            <span className="font-extrabold text-primary">${annual.toFixed(0)}</span>
          </div>
        </div>

        {plan.isChicagoLocal && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-xs text-amber-800 font-medium text-center">
            🏙 You're supporting a Chicago-owned business!
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-500 font-bold text-sm hover:bg-gray-200 transition">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl grad-bg text-white font-bold text-sm hover:opacity-90 transition">
            Add to Wallet ✓
          </button>
        </div>
      </div>
    </div>
  );
}

function CompCard({ r, delay, onPlanSelect, selectedPlanId }: {
  r: ComparisonResult; delay: number;
  onPlanSelect: (plan: AlternativePlan, category: string, currentCost: number) => void;
  selectedPlanId?: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden mb-4 animate-slide-up" style={{ animationDelay: `${delay}ms` }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2.5 text-sm font-bold text-gray-900">
          <div className={`w-8 h-8 ${ICON_BG[r.category]} rounded-lg flex items-center justify-center text-base`}>{EMOJI[r.category]}</div>
          {r.label}
        </div>
        {r.alreadyOptimal
          ? <span className="bg-primary-light text-primary rounded-full px-3.5 py-1 text-xs font-bold">Already Optimized ✓</span>
          : <span className="bg-emerald-50 text-emerald-700 rounded-full px-3.5 py-1 text-xs font-bold">Save ${r.saving.toFixed(2)}/mo</span>
        }
      </div>

      {/* Body */}
      {r.alreadyOptimal ? (
        <div className="px-6 py-5">
          <div className="bg-emerald-50 rounded-xl px-4 py-3.5 text-emerald-700 text-sm font-semibold flex items-center gap-2.5">
            <span>✅</span> {r.message}
          </div>
        </div>
      ) : (
        <div className="px-6 py-5">
          {/* Current plan */}
          <div className="flex items-start gap-4 mb-5 pb-5 border-b border-gray-100">
            <div className="flex-1">
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mb-2">Current Plan</div>
              <div className="text-sm font-bold text-gray-900 mb-1">{r.currentProvider}</div>
              <div className="font-display text-3xl font-extrabold text-gray-400 tracking-tight mb-2">
                ${r.currentCost.toFixed(2)}<span className="text-xs font-medium text-gray-300">/mo</span>
              </div>
              {r.currentFeatures?.map((f, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-200 flex-shrink-0" />{f}
                </div>
              ))}
            </div>
            <div className="flex items-center self-start mt-6">
              <div className="w-7 h-7 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs font-bold">→</div>
            </div>
          </div>

          {/* Alternatives */}
          <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-3">Recommended Plans — Click to Select</div>
          {r.alternatives && r.alternatives.length > 0 ? (
            <div className="grid gap-3">
              {r.alternatives.map(alt => (
                <PlanCard
                  key={alt.planId}
                  plan={alt}
                  currentCost={r.currentCost}
                  onSelect={plan => onPlanSelect(plan, r.category, r.currentCost)}
                  isSelected={selectedPlanId === alt.planId}
                />
              ))}
            </div>
          ) : (
            // Fallback: single recommendation
            r.altProvider && (
              <PlanCard
                plan={{ planId: "single", provider: r.altProvider, cost: r.altCost!, features: r.altFeatures ?? [] }}
                currentCost={r.currentCost}
                onSelect={plan => onPlanSelect(plan, r.category, r.currentCost)}
                isSelected={false}
              />
            )
          )}
        </div>
      )}

      {r.note && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 flex items-center gap-2">
          <span className="opacity-60">ℹ️</span>{r.note}
        </div>
      )}
    </div>
  );
}

// ── Chicago Local Vendors Section ─────────────────────────────
interface Vendor {
  id: string; name: string; category: string; neighborhood: string;
  description: string; discount: string; discountCode: string;
  discountAmount: number; discountType: "percent" | "dollar";
  isFeatured?: boolean; website: string; emoji: string;
}

function VendorCard({ v, onClaim }: { v: Vendor; onClaim: (v: Vendor) => void }) {
  const [claimed, setClaimed] = useState(false);
  const handleClaim = () => { setClaimed(true); onClaim(v); };
  return (
    <div className={`bg-white border-2 rounded-xl p-4 transition-all ${v.isFeatured ? "border-amber-300" : "border-gray-100"}`}>
      {v.isFeatured && (
        <div className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-2">⭐ Featured Chicago Vendor</div>
      )}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">{v.emoji}</div>
        <div>
          <div className="text-sm font-bold text-gray-900">{v.name}</div>
          <div className="text-xs text-amber-700 font-semibold">🏙 Chicago Local · {v.neighborhood}</div>
          <div className="text-xs text-gray-400 mt-0.5">{v.category}</div>
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-3 leading-relaxed">{v.description}</p>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 mb-3">
        <div className="text-xs font-bold text-amber-900">{v.discount}</div>
        {claimed ? (
          <div className="flex items-center gap-2 mt-1">
            <code className="text-xs bg-white border border-amber-300 px-2 py-1 rounded font-mono font-bold text-amber-800">{v.discountCode}</code>
            <span className="text-[11px] text-amber-700">Copied! Use at checkout</span>
          </div>
        ) : null}
      </div>
      <button
        onClick={handleClaim}
        disabled={claimed}
        className={`w-full py-2 rounded-lg text-xs font-bold transition-all
          ${claimed ? "bg-emerald-100 text-emerald-700 cursor-default" : "bg-amber-500 hover:bg-amber-600 text-white"}`}>
        {claimed ? `✓ Code: ${v.discountCode}` : "Claim Discount →"}
      </button>
    </div>
  );
}

interface Props {
  result: AnalyzeResponse | null;
  loading: boolean;
  error: string;
  form: FormState;
  onBack: () => void;
  onReset: () => void;
  user?: any;
}

export default function StepResults({ result, loading, error, form, onBack, onReset, user }: Props) {
  const [selectedPlans, setSelectedPlans] = useState<Record<string, string>>({}); // category -> planId
  const [walletSavings, setWalletSavings] = useState<{ monthly: number; annual: number }>({ monthly: 0, annual: 0 });
  const [pendingModal, setPendingModal] = useState<{ plan: AlternativePlan; category: string; currentCost: number } | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [showVendors, setShowVendors] = useState(false);
  const [claimedVendors, setClaimedVendors] = useState<string[]>([]);

  const loadVendors = async () => {
    if (vendors.length) { setShowVendors(true); return; }
    try {
      const res = await fetch("/api/vendors");
      const data = await res.json();
      setVendors(data.vendors);
      setShowVendors(true);
    } catch {}
  };

  const handlePlanSelect = (plan: AlternativePlan, category: string, currentCost: number) => {
    setPendingModal({ plan, category, currentCost });
  };

  const confirmPlanSelect = () => {
    if (!pendingModal) return;
    const { plan, category, currentCost } = pendingModal;
    const saving = currentCost - plan.cost;
    setSelectedPlans(prev => ({ ...prev, [category]: plan.planId }));
    setWalletSavings(prev => {
      // If replacing a previous selection for same category, subtract old saving
      const newMonthly = prev.monthly + saving;
      return { monthly: newMonthly, annual: newMonthly * 12 };
    });
    setPendingModal(null);
  };

  if (loading) return <Spinner />;
  if (error) return (
    <div className="animate-fade-up">
      <Notice type="error" icon="❌">{error}</Notice>
      <BtnRow><Btn variant="secondary" onClick={onBack}>← Go Back</Btn></BtnRow>
    </div>
  );
  if (!result) return null;

  const { totalMonthlySavings, totalAnnualSavings, discountMultiplier, results } = result;
  const budgetTotal = parseFloat(form.budget.total || "0");
  const budgetPct = budgetTotal > 0 ? ((totalMonthlySavings / budgetTotal) * 100).toFixed(1) : null;
  const optimized = results.filter(r => !r.alreadyOptimal).length;
  const discLabels = form.discounts.map(d => DISC_LABELS[d]).filter(Boolean);
  const hasWalletSelections = Object.keys(selectedPlans).length > 0;

  return (
    <div className="animate-fade-up">
      {pendingModal && (
        <SavingsModal
          plan={pendingModal.plan}
          currentCost={pendingModal.currentCost}
          category={pendingModal.category}
          onClose={() => setPendingModal(null)}
          onConfirm={confirmPlanSelect}
        />
      )}

      <Eyebrow>Step 4 of 4 — Your Report</Eyebrow>
      <PageTitle>Your savings <Grad>breakdown</Grad></PageTitle>

      {/* Hero savings */}
      <div className="grad-bg rounded-2xl p-10 text-white mb-7 relative overflow-hidden">
        <div className="absolute -top-14 -right-14 w-64 h-64 rounded-full bg-white/[0.07] pointer-events-none" />
        <div className="relative z-10">
          <div className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-2">Estimated Monthly Savings</div>
          <div className="font-display text-7xl font-extrabold tracking-tight leading-none mb-2 animate-fade-up">
            ${totalMonthlySavings.toFixed(2)}
          </div>
          <div className="text-base opacity-70 mb-6">
            ${totalAnnualSavings.toFixed(0)} per year
            {budgetPct && ` · ${budgetPct}% of your monthly budget recovered`}
          </div>
          <div className="flex flex-wrap gap-2">
            {results.filter(r => r.saving > 0).map(r => (
              <div key={r.category} className="bg-white/20 border border-white/25 backdrop-blur rounded-full px-4 py-1.5 text-xs font-semibold">
                {EMOJI[r.category]} {r.label}: save ${r.saving.toFixed(2)}/mo
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          ["$" + totalMonthlySavings.toFixed(2), "Potential Monthly", "text-primary"],
          ["$" + totalAnnualSavings.toFixed(0),  "Potential Annual", "text-emerald-600"],
          [optimized + " / " + results.length,   "Plans to Optimize", "text-accent"],
        ].map(([v, l, cls]) => (
          <div key={l} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
            <div className={`font-display text-2xl font-extrabold tracking-tight mb-1 ${cls}`}>{v}</div>
            <div className="text-xs text-gray-400 font-medium">{l}</div>
          </div>
        ))}
      </div>

      {/* Wallet savings tracker */}
      {hasWalletSelections && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-6 animate-fade-up">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-2xl">💼</div>
            <div>
              <div className="text-sm font-bold text-emerald-900">Your Wallet — Plans Selected</div>
              <div className="text-xs text-emerald-700">Based on the plans you've clicked</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-3 text-center">
              <div className="font-display text-2xl font-extrabold text-emerald-600">${walletSavings.monthly.toFixed(2)}</div>
              <div className="text-xs text-gray-400">Monthly Savings</div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center">
              <div className="font-display text-2xl font-extrabold text-primary">${walletSavings.annual.toFixed(0)}</div>
              <div className="text-xs text-gray-400">Annual Savings</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-emerald-700 font-medium text-center">
            {Object.keys(selectedPlans).length} plan{Object.keys(selectedPlans).length > 1 ? "s" : ""} selected · {user ? "Saved to your wallet" : "Login to save permanently"}
          </div>
        </div>
      )}

      {/* Discount notice */}
      {discountMultiplier > 0 && discLabels.length > 0 && (
        <Notice type="info" icon="🏷️">
          Discount eligibility ({discLabels.join(", ")}) applied — an extra {discountMultiplier}% reduction on eligible plans.
        </Notice>
      )}

      {/* Comparison cards */}
      {results.map((r, i) => (
        <CompCard
          key={r.category}
          r={r}
          delay={i * 100}
          onPlanSelect={handlePlanSelect}
          selectedPlanId={selectedPlans[r.category]}
        />
      ))}

      {/* Chicago Local Marketplace */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🏙</div>
            <div>
              <div className="text-sm font-bold text-amber-900">Chicago Local Business Marketplace</div>
              <div className="text-xs text-amber-700">Exclusive deals from Chicago-owned businesses</div>
            </div>
          </div>
          <button
            onClick={loadVendors}
            className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-full transition-all">
            {showVendors ? "Hide Deals" : "Show Local Deals →"}
          </button>
        </div>
        {showVendors && vendors.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {vendors.slice(0, 6).map(v => (
              <VendorCard key={v.id} v={v} onClaim={v => setClaimedVendors(prev => [...prev, v.id])} />
            ))}
          </div>
        )}
        {showVendors && vendors.length > 6 && (
          <div className="text-center mt-4">
            <button
              onClick={() => setVendors(v => v)} // all already loaded
              className="text-xs text-amber-700 font-bold hover:underline">
              View all {vendors.length} Chicago local deals →
            </button>
          </div>
        )}
      </div>

      {claimedVendors.length > 0 && (
        <Notice type="success" icon="🏙">
          You've claimed {claimedVendors.length} Chicago local deal{claimedVendors.length > 1 ? "s" : ""}! Supporting local businesses keeps money in Chicago's economy.
        </Notice>
      )}

      <BtnRow>
        <Btn variant="secondary" onClick={onBack}>← Adjust Bills</Btn>
        <Btn variant="primary" onClick={onReset}>🌬 New Analysis</Btn>
      </BtnRow>
    </div>
  );
}
