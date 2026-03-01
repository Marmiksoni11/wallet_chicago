"use client";
import { StatCard, SectionHeader, AdminCard, MiniBtn } from "./ui";
import { LOCAL_VENDORS } from "./data";

export default function TabVendors() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard icon="🏙" label="Chicago Local Vendors" value={13}    color="#F59E0B" delay={0}  />
        <StatCard icon="🎫" label="Coupons Claimed"       value={891}   trend={14.2} color="#F59E0B" delay={60}  sub="This month" />
        <StatCard icon="💵" label="Local Economy Boost"   value={47200} prefix="$" trend={18.3} color="#4ADE80" delay={120} sub="Spent at Chicago vendors" />
      </div>

      <AdminCard>
        <SectionHeader title="Chicago Vendor Marketplace" sub="Manage local business partnerships & discount codes" action="+ Add Vendor" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {LOCAL_VENDORS.map((v, i) => (
            <div key={v.name} style={{
              background: v.featured ? "#0C1A0E" : "#0A0F1E",
              border: `1px solid ${v.featured ? "#14532D" : "#1E293B"}`,
              borderRadius: 14, padding: 18,
              animation: `fadeUp 0.4s ${i * 60}ms ease both`,
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, background: "#1E293B",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                  }}>{v.emoji}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#F1F5F9" }}>{v.name}</div>
                    <div style={{ fontSize: 10, color: v.featured ? "#4ADE80" : "#475569" }}>
                      {v.featured ? "⭐ Featured" : "🏙 Local"} · {v.category}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <MiniBtn>Edit</MiniBtn>
                  {!v.featured && <MiniBtn color="#1A2E1A" textColor="#4ADE80">Feature</MiniBtn>}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div style={{ background: "#1E293B", borderRadius: 8, padding: "8px 10px" }}>
                  <div style={{ fontSize: 10, color: "#475569", marginBottom: 2 }}>Coupons Claimed</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#F59E0B" }}>{v.coupons}</div>
                </div>
                <div style={{ background: "#1E293B", borderRadius: 8, padding: "8px 10px" }}>
                  <div style={{ fontSize: 10, color: "#475569", marginBottom: 2 }}>Revenue Generated</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#4ADE80" }}>${v.revenue.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}
