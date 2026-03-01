"use client";
import { SectionHeader, AdminCard } from "./ui";
import { NEIGHBORHOOD_DATA, LOCAL_VENDORS } from "./data";

export default function TabEconomy() {
  const max = NEIGHBORHOOD_DATA[0].users;
  return (
    <div>
      {/* Hero card */}
      <div style={{
        background: "linear-gradient(135deg, #0C1A0E, #0A1628)",
        border: "1px solid #14532D", borderRadius: 16, padding: 28,
        marginBottom: 24, animation: "fadeUp 0.5s ease both",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ fontSize: 32 }}>🏙</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#F1F5F9" }}>Chicago Economy Boost Dashboard</div>
            <div style={{ color: "#475569", fontSize: 13 }}>Tracking local business impact — February 2025</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {([
            ["$47,200", "Spent at Chicago Vendors",     "#4ADE80"],
            ["891",     "Local Coupons Claimed",        "#F59E0B"],
            ["13",      "Partner Chicago Businesses",   "#60A5FA"],
            ["34%",     "Users Prefer Local Options",   "#C084FC"],
          ] as const).map(([v, l, c]) => (
            <div key={l} style={{ background: "rgba(0,0,0,0.3)", borderRadius: 12, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: c }}>{v}</div>
              <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Neighborhood bars */}
        <AdminCard delay={100}>
          <SectionHeader title="Neighborhood Reach" sub="Users per Chicago neighborhood" />
          {NEIGHBORHOOD_DATA.map((n, i) => (
            <div key={n.name} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: "#94A3B8" }}>{n.name}</span>
                <span style={{ fontSize: 11, color: "#475569" }}>{n.users} users</span>
              </div>
              <div style={{ background: "#1E293B", borderRadius: 4, height: 6, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 4,
                  background: `hsl(${220 + i * 15}, 70%, 55%)`,
                  width: `${(n.users / max) * 100}%`,
                  transition: "width 1s ease",
                }} />
              </div>
            </div>
          ))}
        </AdminCard>

        {/* Top vendors */}
        <AdminCard delay={200}>
          <SectionHeader title="Top Chicago Local Vendors" sub="By coupon claims this month" />
          {LOCAL_VENDORS.slice(0, 6).map((v, i) => (
            <div key={v.name} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: i < 5 ? "1px solid #0F172A" : "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>{v.emoji}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#E2E8F0" }}>{v.name}</div>
                  <div style={{ fontSize: 10, color: "#475569" }}>{v.category}</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#F59E0B" }}>{v.coupons} claims</div>
                <div style={{ fontSize: 10, color: "#4ADE80" }}>${v.revenue.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </AdminCard>
      </div>
    </div>
  );
}
