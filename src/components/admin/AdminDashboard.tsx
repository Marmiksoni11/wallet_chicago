"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import chart-heavy tabs to avoid SSR issues with recharts
const TabOverview  = dynamic(() => import("./TabOverview"),  { ssr: false });
const TabAnalytics = dynamic(() => import("./TabAnalytics"), { ssr: false });
const TabUsers     = dynamic(() => import("./TabUsers"),     { ssr: false });
const TabVendors   = dynamic(() => import("./TabVendors"),   { ssr: false });
const TabPlans     = dynamic(() => import("./TabPlans"),     { ssr: false });
const TabEconomy   = dynamic(() => import("./TabEconomy"),   { ssr: false });

type NavId = "overview" | "analytics" | "users" | "vendors" | "plans" | "economy";

const NAV_ITEMS: { id: NavId; icon: string; label: string }[] = [
  { id: "overview",  icon: "▦",  label: "Overview"         },
  { id: "analytics", icon: "◈",  label: "Analytics"        },
  { id: "users",     icon: "◎",  label: "Users"            },
  { id: "vendors",   icon: "◉",  label: "Chicago Vendors"  },
  { id: "plans",     icon: "▤",  label: "Plans Database"   },
  { id: "economy",   icon: "◐",  label: "Economy Impact"   },
];

// ── Sidebar ──────────────────────────────────────────────────
function Sidebar({
  active, onNav, collapsed, onToggle, onLogout, adminName,
}: {
  active: NavId;
  onNav: (id: NavId) => void;
  collapsed: boolean;
  onToggle: () => void;
  onLogout: () => void;
  adminName: string;
}) {
  return (
    <div style={{
      width: collapsed ? 64 : 220, flexShrink: 0,
      background: "#0A0F1E", borderRight: "1px solid #0F172A",
      display: "flex", flexDirection: "column",
      transition: "width 0.25s ease", overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{ padding: "24px 16px 20px", borderBottom: "1px solid #0F172A" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: "linear-gradient(135deg, #2563EB, #7C3AED)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 900, fontSize: 16,
            boxShadow: "0 0 20px rgba(37,99,235,0.3)",
          }}>W</div>
          {!collapsed && (
            <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#F1F5F9" }}>WindyWallet</div>
              <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.05em" }}>ADMIN CONSOLE</div>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
        {NAV_ITEMS.map(item => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              title={collapsed ? item.label : undefined}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "10px 12px", borderRadius: 10, border: "none",
                cursor: "pointer",
                background: isActive ? "#1E293B" : "transparent",
                color: isActive ? "#60A5FA" : "#475569",
                fontSize: 13, fontWeight: isActive ? 700 : 500,
                marginBottom: 2, transition: "all 0.15s",
                whiteSpace: "nowrap", overflow: "hidden",
                fontFamily: "inherit",
                boxShadow: isActive ? "inset 2px 0 0 #3B82F6" : "none",
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer: user + collapse */}
      <div style={{ padding: "12px 8px", borderTop: "1px solid #0F172A" }}>
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", marginBottom: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, #2563EB, #7C3AED)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 800, color: "white",
            }}>{adminName[0]}</div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#E2E8F0", whiteSpace: "nowrap" }}>{adminName}</div>
              <div style={{ fontSize: 10, color: "#475569" }}>Super Admin</div>
            </div>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={onLogout}
            style={{
              width: "100%", padding: "7px 12px", background: "#1E293B",
              border: "none", borderRadius: 8, color: "#F87171", cursor: "pointer",
              fontSize: 11, fontWeight: 600, fontFamily: "inherit", marginBottom: 6,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
            }}
          >← Back to WindyWallet</button>
        )}
        <button
          onClick={onToggle}
          style={{
            width: "100%", padding: "8px 12px", background: "#0F172A", border: "none",
            borderRadius: 8, color: "#475569", cursor: "pointer", fontSize: 12,
            display: "flex", alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-end",
            gap: 6, fontFamily: "inherit",
          }}
        >{collapsed ? "→" : "← Collapse"}</button>
      </div>
    </div>
  );
}

// ── Main AdminDashboard ───────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<NavId>("overview");
  const [collapsed, setCollapsed]   = useState(false);
  const [adminName, setAdminName]   = useState("Alex Rivera");
  const [authed, setAuthed]         = useState(false);

  // Read user from sessionStorage (set by AuthModal on login)
  useEffect(() => {
    const raw = sessionStorage.getItem("ww_user");
    if (!raw) { router.replace("/"); return; }
    try {
      const user = JSON.parse(raw);
      if (user.role !== "admin") { router.replace("/"); return; }
      setAdminName(user.name ?? "Admin");
      setAuthed(true);
    } catch {
      router.replace("/");
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("ww_user");
    router.push("/");
  };

  if (!authed) {
    return (
      <div style={{
        minHeight: "100vh", background: "#030712",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          border: "3px solid #1E293B", borderTopColor: "#3B82F6",
          animation: "spin 0.7s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const tabLabels: Record<NavId, string> = {
    overview: "Overview", analytics: "Analytics", users: "Users",
    vendors: "Chicago Vendors", plans: "Plans Database", economy: "Economy Impact",
  };

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      background: "#030712", color: "#F1F5F9",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes pulse  { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0F172A; }
        ::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 4px; }
        * { scrollbar-width: thin; scrollbar-color: #1E293B #0F172A; }
        button:hover { opacity: 0.85; }
      `}</style>

      <Sidebar
        active={activeNav}
        onNav={setActiveNav}
        collapsed={collapsed}
        onToggle={() => setCollapsed(v => !v)}
        onLogout={handleLogout}
        adminName={adminName}
      />

      {/* Main content */}
      <div style={{ flex: 1, overflow: "auto", padding: "28px 32px" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", color: "#F1F5F9" }}>
              {tabLabels[activeNav]}
            </div>
            <div style={{ color: "#475569", fontSize: 12, marginTop: 2 }}>
              🏙 Chicago, IL · Last updated just now
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              background: "#0F172A", border: "1px solid #1E293B",
              borderRadius: 10, padding: "8px 14px", color: "#475569", fontSize: 12,
            }}>📅 Feb 2025</div>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#052E16", border: "1px solid #14532D",
              borderRadius: 10, padding: "8px 12px",
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: "50%", background: "#4ADE80",
                animation: "pulse 2s infinite",
              }} />
              <span style={{ color: "#4ADE80", fontSize: 11, fontWeight: 700 }}>Live</span>
            </div>
          </div>
        </div>

        {/* Tab content */}
        {activeNav === "overview"  && <TabOverview />}
        {activeNav === "analytics" && <TabAnalytics />}
        {activeNav === "users"     && <TabUsers />}
        {activeNav === "vendors"   && <TabVendors />}
        {activeNav === "plans"     && <TabPlans />}
        {activeNav === "economy"   && <TabEconomy />}
      </div>
    </div>
  );
}
