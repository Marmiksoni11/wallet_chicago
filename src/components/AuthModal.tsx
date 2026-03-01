"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types";

interface Props {
  onLogin: (user: User) => void;
  onClose: () => void;
}

export default function AuthModal({ onLogin, onClose }: Props) {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { setError("Please enter email and password"); return; }
    setLoading(true); setError("");
    try {
      const res  = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Login failed"); setLoading(false); return; }

      const user: User = data.user;
      // Persist so admin page can read it
      sessionStorage.setItem("ww_user", JSON.stringify(user));

      if (user.role === "admin") {
        router.push("/admin");
      } else {
        onLogin(user);
        onClose();
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
    }}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="font-display text-xl font-extrabold text-gray-900">Sign In</div>
            <div className="text-xs text-gray-400 mt-0.5">Save your wallet & access your history</div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 text-xs text-blue-700">
          <div className="font-bold mb-1">Demo Accounts — click to fill:</div>
          <button className="block text-left w-full hover:text-blue-900"
            onClick={() => { setEmail("demo@windywallet.com"); setPassword("demo123"); setError(""); }}>
            👤 User: demo@windywallet.com / demo123
          </button>
          <button className="block text-left w-full hover:text-blue-900 mt-0.5"
            onClick={() => { setEmail("admin@windywallet.com"); setPassword("admin123"); setError(""); }}>
            🔧 Admin: admin@windywallet.com / admin123 → redirects to Admin Panel
          </button>
        </div>

        <div className="space-y-3 mb-4">
          <input type="email" placeholder="Email" value={email}
            onChange={e => { setEmail(e.target.value); setError(""); }}
            className="w-full h-11 bg-gray-50 border border-transparent rounded-xl px-3.5 text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all"
          />
          <input type="password" placeholder="Password" value={password}
            onChange={e => { setPassword(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            className="w-full h-11 bg-gray-50 border border-transparent rounded-xl px-3.5 text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all"
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm font-medium mb-4">{error}</div>
        )}

        <button onClick={handleLogin} disabled={loading}
          className="w-full grad-bg text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-60 text-sm">
          {loading
            ? <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white inline-block animate-spin-slow" />
                Signing in…
              </span>
            : "Sign In →"}
        </button>
        <div className="text-center mt-3">
          <button onClick={onClose} className="text-xs text-gray-400 hover:text-gray-600">Continue without account</button>
        </div>
      </div>
    </div>
  );
}
