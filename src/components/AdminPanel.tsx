"use client";
import { useState } from "react";
import { CHICAGO_VENDORS, MOBILE_PLANS, INTERNET_PLANS, INSURANCE_PLANS } from "@/lib/plans";
import type { User } from "@/types";

interface Props {
  user: User;
  onClose: () => void;
}

export default function AdminPanel({ user, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<"vendors" | "plans" | "stats">("stats");

  const tabs = [
    { id: "stats" as const, label: "📊 Dashboard" },
    { id: "vendors" as const, label: "🏙 Chicago Vendors" },
    { id: "plans" as const, label: "📋 Plans Database" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 grad-bg text-white">
          <div>
            <div className="font-display font-extrabold text-lg">Admin Panel</div>
            <div className="text-xs opacity-70">Welcome, {user.name} · WindyWallet Chicago</div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl">×</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex-1 py-3 text-xs font-bold transition-all
                ${activeTab === t.id ? "bg-white text-primary border-b-2 border-primary" : "text-gray-400 hover:text-gray-600"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === "stats" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  ["1,247", "Total Users", "text-primary"],
                  ["$312k", "Monthly Savings Enabled", "text-emerald-600"],
                  ["13", "Chicago Local Vendors", "text-amber-600"],
                ].map(([v, l, cls]) => (
                  <div key={l} className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className={`font-display text-xl font-extrabold ${cls}`}>{v}</div>
                    <div className="text-xs text-gray-400 mt-1">{l}</div>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Top Savings Categories</div>
                {[["Mobile", 38], ["Internet", 28], ["Streaming", 18], ["Insurance", 11], ["Transit", 5]].map(([cat, pct]) => (
                  <div key={cat} className="flex items-center gap-3 mb-2">
                    <div className="text-xs text-gray-500 w-20">{cat}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="h-2 grad-bg rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="text-xs font-bold text-gray-500 w-8">{pct}%</div>
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-2">🏙 Chicago Economy Impact</div>
                <div className="grid grid-cols-2 gap-3">
                  {[["$47,200", "Spent at Local Vendors"],["891", "Local Coupons Claimed"]].map(([v, l]) => (
                    <div key={l} className="text-center">
                      <div className="font-display font-extrabold text-lg text-amber-800">{v}</div>
                      <div className="text-xs text-amber-600">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "vendors" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-bold text-gray-700">Chicago Local Vendors ({CHICAGO_VENDORS.length})</div>
                <button className="bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-amber-600 transition-all">+ Add Vendor</button>
              </div>
              <div className="space-y-2">
                {CHICAGO_VENDORS.map(v => (
                  <div key={v.id} className={`flex items-center gap-3 p-3 rounded-xl border ${v.isFeatured ? "border-amber-200 bg-amber-50" : "border-gray-100 bg-gray-50"}`}>
                    <div className="text-xl">{v.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                        {v.name}
                        {v.isFeatured && <span className="text-[10px] bg-amber-400 text-white px-1.5 rounded">FEATURED</span>}
                      </div>
                      <div className="text-xs text-gray-400">{v.category} · {v.neighborhood}</div>
                    </div>
                    <div className="text-xs text-emerald-700 font-bold text-right">
                      <div>{v.discount}</div>
                      <div className="text-gray-400 font-normal">{v.discountCode}</div>
                    </div>
                    <button className="text-xs text-primary font-bold hover:underline ml-2">Edit</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "plans" && (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Mobile Plans ({MOBILE_PLANS.length})</div>
                <div className="space-y-1.5">
                  {MOBILE_PLANS.map(p => (
                    <div key={p.id} className={`flex items-center gap-3 p-2.5 rounded-lg border ${p.isChicagoLocal ? "border-amber-200 bg-amber-50" : "border-gray-100"}`}>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-gray-800 flex items-center gap-1">
                          {p.provider}
                          {p.isChicagoLocal && <span className="text-[9px] bg-amber-400 text-white px-1 rounded">LOCAL</span>}
                        </div>
                        <div className="text-[11px] text-gray-400">{p.data} data · {p.linesMax} line max</div>
                      </div>
                      <div className="text-sm font-extrabold text-gray-700">${p.cost}/mo</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
