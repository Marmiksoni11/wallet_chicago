"use client";
import {
  BarChart, Bar, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { StatCard, SectionHeader, AdminCard, ChartTooltip } from "./ui";
import { SAVINGS_TREND, NEIGHBORHOOD_DATA } from "./data";

export default function TabAnalytics() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard icon="📈" label="Monthly Growth Rate" value={8}  suffix="%" trend={2.3} color="#3B82F6" delay={0}   sub="Month-over-month users" />
        <StatCard icon="🔄" label="Plan Switch Rate"    value={73} suffix="%" trend={4.1} color="#8B5CF6" delay={60}  sub="Users who select a plan" />
        <StatCard icon="⭐" label="Local Preference"    value={34} suffix="%" trend={7.8} color="#F59E0B" delay={120} sub="Users pick local first" />
      </div>

      <AdminCard delay={150} style={{ marginBottom: 20 }}>
        <SectionHeader title="Savings by Chicago Neighborhood" sub="Total monthly savings enabled per area" action="Full Report" />
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={NEIGHBORHOOD_DATA} barSize={28}>
            <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="savings" name="savings" radius={[6, 6, 0, 0]}>
              {NEIGHBORHOOD_DATA.map((_, i) => (
                <Cell key={i} fill={`hsl(${220 + i * 10}, 80%, ${55 - i * 3}%)`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </AdminCard>

      <AdminCard delay={250}>
        <SectionHeader title="Users vs. Savings Trend" sub="Correlation between user growth and savings enabled" />
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={SAVINGS_TREND}>
            <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left"  tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Line yAxisId="left"  type="monotone" dataKey="savings" stroke="#3B82F6" strokeWidth={2.5}
              dot={{ fill: "#3B82F6", r: 4 }} name="savings" />
            <Line yAxisId="right" type="monotone" dataKey="users"   stroke="#8B5CF6" strokeWidth={2.5}
              dot={{ fill: "#8B5CF6", r: 4 }} name="users" />
          </LineChart>
        </ResponsiveContainer>
      </AdminCard>
    </div>
  );
}
