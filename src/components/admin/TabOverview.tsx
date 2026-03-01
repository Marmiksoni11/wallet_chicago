"use client";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { StatCard, SectionHeader, AdminCard, CatBadge, Avatar, ChartTooltip } from "./ui";
import { SAVINGS_TREND, CATEGORY_DATA, RECENT_USERS, PLAN_PERFORMANCE } from "./data";

const CATEGORY_COLORS: Record<string, string> = {
  Mobile: "#3B82F6", Internet: "#8B5CF6", Streaming: "#F59E0B",
  Insurance: "#10B981", Transit: "#EF4444",
};

export default function TabOverview() {
  return (
    <div>
      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard icon="💰" label="Total Savings Enabled" value={341800} prefix="$" trend={9.4} color="#3B82F6" delay={0}   sub="All Chicago users, Feb 2025" />
        <StatCard icon="👥" label="Active Users"          value={1247}          trend={8.7} color="#8B5CF6" delay={60}  sub="Across 77+ Chicago ZIPs"   />
        <StatCard icon="🏙" label="Local Vendor Claims"   value={891}           trend={14.2} color="#F59E0B" delay={120} sub="Chicago businesses supported" />
        <StatCard icon="📊" label="Avg. Savings / User"   value={274} prefix="$" trend={2.1} color="#10B981" delay={180} sub="Per month, all categories"  />
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Area chart */}
        <AdminCard delay={200}>
          <SectionHeader title="Savings Growth" sub="Monthly total enabled savings across Chicago" action="Export CSV" />
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={SAVINGS_TREND}>
              <defs>
                <linearGradient id="savGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="savings" stroke="#3B82F6" strokeWidth={2}
                fill="url(#savGrad)" name="savings" />
            </AreaChart>
          </ResponsiveContainer>
        </AdminCard>

        {/* Pie */}
        <AdminCard delay={250}>
          <SectionHeader title="By Category" sub="Share of total savings" />
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={CATEGORY_DATA} dataKey="savings" cx="50%" cy="50%"
                innerRadius={50} outerRadius={75} paddingAngle={3}>
                {CATEGORY_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => `${v}%`}
                contentStyle={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 8 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 8 }}>
            {CATEGORY_DATA.map(c => (
              <div key={c.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: c.color }} />
                  <span style={{ color: "#94A3B8", fontSize: 11 }}>{c.name}</span>
                </div>
                <span style={{ color: "#F1F5F9", fontSize: 11, fontWeight: 700 }}>{c.savings}%</span>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      {/* Bottom row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Recent users */}
        <AdminCard delay={300}>
          <SectionHeader title="Recent Users" sub="Latest sign-ups & activity" action="View All" />
          {RECENT_USERS.map((u, i) => (
            <div key={u.id} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: i < RECENT_USERS.length - 1 ? "1px solid #0F172A" : "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar name={u.name} index={i} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#E2E8F0" }}>{u.name}</div>
                  <div style={{ fontSize: 10, color: "#475569" }}>ZIP {u.zip} · {u.joined}</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#4ADE80" }}>${u.savings}/mo</div>
                <div style={{ fontSize: 10, color: "#475569" }}>{u.plans} plans</div>
              </div>
            </div>
          ))}
        </AdminCard>

        {/* Top plans */}
        <AdminCard delay={350}>
          <SectionHeader title="Top Performing Plans" sub="Most selected by Chicago users" action="Manage" />
          {PLAN_PERFORMANCE.slice(0, 6).map((p, i) => {
            const c = CATEGORY_COLORS[p.category] ?? "#60A5FA";
            return (
              <div key={p.name} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "9px 0", borderBottom: i < 5 ? "1px solid #0F172A" : "none",
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                  background: c + "22", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 9, fontWeight: 900, color: c,
                }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#E2E8F0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                    <CatBadge category={p.category} />
                    <span style={{ fontSize: 10, color: "#475569" }}>{p.selections} selections</span>
                  </div>
                </div>
                <div style={{ color: "#4ADE80", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>+${p.avgSaving}/mo</div>
              </div>
            );
          })}
        </AdminCard>
      </div>
    </div>
  );
}
