"use client";
import { SectionHeader, AdminCard, CatBadge, MiniBtn } from "./ui";
import { PLAN_PERFORMANCE } from "./data";

export default function TabPlans() {
  return (
    <div>
      <AdminCard>
        <SectionHeader title="Plans Performance Database" sub="All active plans ranked by user selections" action="+ Add Plan" />
        {/* Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "0.4fr 2fr 1fr 1fr 1fr 0.6fr",
          gap: 12, padding: "8px 12px", marginBottom: 4,
        }}>
          {["#", "Plan Name", "Category", "Selections", "Avg. Saving", "Actions"].map(h => (
            <div key={h} style={{
              fontSize: 10, fontWeight: 700, color: "#334155",
              letterSpacing: "0.08em", textTransform: "uppercase",
            }}>{h}</div>
          ))}
        </div>
        {/* Rows */}
        {PLAN_PERFORMANCE.map((p, i) => (
          <div key={p.name} style={{
            display: "grid",
            gridTemplateColumns: "0.4fr 2fr 1fr 1fr 1fr 0.6fr",
            gap: 12, padding: "12px", borderRadius: 10, marginBottom: 4,
            background: i % 2 === 0 ? "#0A0F1E" : "transparent",
            alignItems: "center",
            animation: `fadeUp 0.4s ${i * 40}ms ease both`,
          }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#334155" }}>{i + 1}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0" }}>{p.name}</div>
            <CatBadge category={p.category} />
            <div style={{ fontSize: 13, color: "#94A3B8" }}>{p.selections.toLocaleString()}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#4ADE80" }}>+${p.avgSaving}/mo</div>
            <MiniBtn>Edit</MiniBtn>
          </div>
        ))}
      </AdminCard>
    </div>
  );
}
