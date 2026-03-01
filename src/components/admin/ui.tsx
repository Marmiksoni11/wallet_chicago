"use client";
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

// ── Animated number counter ──────────────────────────────────
export function AnimatedNumber({
  value, prefix = "", suffix = "", duration = 1200,
}: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = null;
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{prefix}{display.toLocaleString()}{suffix}</span>;
}

// ── Recharts custom tooltip ──────────────────────────────────
export function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const fmtVal = (name: string, v: number) => {
    if (name === "savings" || name === "amount") {
      return v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`;
    }
    return v.toLocaleString();
  };
  return (
    <div style={{
      background: "#0F172A", border: "1px solid #1E293B",
      borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#94A3B8",
    }}>
      <div style={{ color: "#F1F5F9", fontWeight: 700, marginBottom: 4 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color ?? "#60A5FA" }}>
          {p.name}:{" "}
          <span style={{ color: "#F1F5F9", fontWeight: 600 }}>
            {fmtVal(p.name, p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Stat card ────────────────────────────────────────────────
interface StatCardProps {
  icon: string; label: string; value: number;
  suffix?: string; prefix?: string;
  sub?: string; trend?: number; color?: string; delay?: number;
}

export function StatCard({
  icon, label, value, sub, trend, prefix = "", suffix = "",
  color = "#3B82F6", delay = 0,
}: StatCardProps) {
  const trendUp = (trend ?? 0) >= 0;
  return (
    <div style={{
      background: "#0F172A", border: "1px solid #1E293B", borderRadius: 16,
      padding: "20px 24px", position: "relative", overflow: "hidden",
      animation: `fadeUp 0.5s ${delay}ms ease both`,
    }}>
      <div style={{
        position: "absolute", top: -20, right: -20, width: 80, height: 80,
        borderRadius: "50%", background: `${color}15`, pointerEvents: "none",
      }} />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ fontSize: 20 }}>{icon}</div>
        {trend !== undefined && (
          <div style={{
            fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6,
            background: trendUp ? "#052E16" : "#450A0A",
            color: trendUp ? "#4ADE80" : "#F87171",
          }}>
            {trendUp ? "↑" : "↓"} {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div style={{
        color: "#94A3B8", fontSize: 11, fontWeight: 600,
        letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6,
      }}>{label}</div>
      <div style={{ color: "#F1F5F9", fontSize: 28, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1 }}>
        <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
      </div>
      {sub && <div style={{ color: "#475569", fontSize: 12, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

// ── Section header ───────────────────────────────────────────
export function SectionHeader({
  title, sub, action, onAction,
}: { title: string; sub?: string; action?: string; onAction?: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 16 }}>
      <div>
        <div style={{ color: "#F1F5F9", fontSize: 15, fontWeight: 700 }}>{title}</div>
        {sub && <div style={{ color: "#475569", fontSize: 12, marginTop: 2 }}>{sub}</div>}
      </div>
      {action && (
        <button onClick={onAction} style={{
          background: "transparent", border: "1px solid #1E293B", color: "#60A5FA",
          fontSize: 11, fontWeight: 600, padding: "6px 12px", borderRadius: 8,
          cursor: "pointer", fontFamily: "inherit",
        }}>{action}</button>
      )}
    </div>
  );
}

// ── Card wrapper ─────────────────────────────────────────────
export function AdminCard({
  children, delay = 0, style = {},
}: { children: ReactNode; delay?: number; style?: CSSProperties }) {
  return (
    <div style={{
      background: "#0F172A", border: "1px solid #1E293B", borderRadius: 16, padding: 24,
      animation: `fadeUp 0.5s ${delay}ms ease both`, ...style,
    }}>
      {children}
    </div>
  );
}

// ── Category color badge ──────────────────────────────────────
const CAT_COLORS: Record<string, string> = {
  Mobile: "#3B82F6", Internet: "#8B5CF6", Streaming: "#F59E0B",
  Insurance: "#10B981", Transit: "#EF4444",
};

export function CatBadge({ category }: { category: string }) {
  const c = CAT_COLORS[category] ?? "#60A5FA";
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20,
      background: c + "20", color: c,
    }}>{category}</span>
  );
}

// ── Status dot ───────────────────────────────────────────────
export function StatusBadge({ status }: { status: string }) {
  const active = status === "active";
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20,
      background: active ? "#052E16" : "#1A1A2E",
      color: active ? "#4ADE80" : "#475569",
    }}>● {status}</span>
  );
}

// ── Avatar ───────────────────────────────────────────────────
export function Avatar({ name, index, size = 32 }: { name: string; index: number; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: `hsl(${index * 60}, 60%, 35%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 700, color: "white",
    }}>{name[0]}</div>
  );
}

// ── Mini button ───────────────────────────────────────────────
export function MiniBtn({
  children, color = "#1E293B", textColor = "#60A5FA", onClick,
}: { children: ReactNode; color?: string; textColor?: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{
      background: color, border: "none", borderRadius: 6,
      padding: "4px 8px", color: textColor, fontSize: 11,
      cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
    }}>{children}</button>
  );
}
