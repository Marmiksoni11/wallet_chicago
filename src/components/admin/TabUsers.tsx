"use client";
import { useState } from "react";
import { StatCard, SectionHeader, AdminCard, Avatar, StatusBadge } from "./ui";
import { RECENT_USERS } from "./data";

export default function TabUsers() {
  const [search, setSearch] = useState("");
  const filtered = RECENT_USERS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.zip.includes(search) ||
    u.id.includes(search)
  );

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard icon="👥" label="Total Users"          value={1247} trend={8.7}  delay={0}   />
        <StatCard icon="✅" label="With Active Plans"    value={912}  trend={6.2}  color="#10B981" delay={60}  />
        <StatCard icon="🏙" label="Local Coupon Holders" value={341}  trend={11.4} color="#F59E0B" delay={120} />
        <StatCard icon="🔑" label="Admin Accounts"       value={3}                 color="#8B5CF6" delay={180} />
      </div>

      <AdminCard>
        <SectionHeader title="All Users" sub="Live user activity across Chicago neighborhoods" action="+ Add User" />

        {/* Search */}
        <div style={{ marginBottom: 16 }}>
          <input
            placeholder="🔍  Search by name, ZIP, or user ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", boxSizing: "border-box", padding: "10px 16px",
              background: "#1E293B", border: "1px solid #334155", borderRadius: 10,
              color: "#94A3B8", fontSize: 13, outline: "none", fontFamily: "inherit",
            }}
          />
        </div>

        {/* Table header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "0.6fr 2fr 0.8fr 1fr 0.7fr 0.8fr 0.8fr",
          gap: 12, padding: "8px 12px", marginBottom: 4,
        }}>
          {["ID", "Name", "ZIP", "Monthly Savings", "Plans", "Joined", "Status"].map(h => (
            <div key={h} style={{
              fontSize: 10, fontWeight: 700, color: "#334155",
              letterSpacing: "0.08em", textTransform: "uppercase",
            }}>{h}</div>
          ))}
        </div>

        {/* Rows */}
        {filtered.map((u, i) => (
          <div key={u.id} style={{
            display: "grid",
            gridTemplateColumns: "0.6fr 2fr 0.8fr 1fr 0.7fr 0.8fr 0.8fr",
            gap: 12, padding: "12px", borderRadius: 10, marginBottom: 4,
            background: i % 2 === 0 ? "#0A0F1E" : "transparent",
            alignItems: "center",
            animation: `fadeUp 0.4s ${i * 50}ms ease both`,
          }}>
            <div style={{ fontSize: 10, color: "#334155", fontFamily: "'DM Mono', monospace" }}>{u.id}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar name={u.name} index={i} size={28} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0" }}>{u.name}</span>
            </div>
            <div style={{ fontSize: 12, color: "#60A5FA", fontFamily: "'DM Mono', monospace" }}>{u.zip}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#4ADE80" }}>${u.savings}/mo</div>
            <div style={{ fontSize: 12, color: "#94A3B8" }}>{u.plans} plans</div>
            <div style={{ fontSize: 11, color: "#475569" }}>{u.joined}</div>
            <StatusBadge status={u.status} />
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px 0", color: "#334155", fontSize: 13 }}>
            No users match "{search}"
          </div>
        )}
      </AdminCard>
    </div>
  );
}
