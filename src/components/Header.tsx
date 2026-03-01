"use client";
import type { User } from "@/types";

interface Props {
  step: number;
  user?: User | null;
  onLoginClick: () => void;
  onAdminClick: () => void;
  onLogout: () => void;
}

const STEPS = ["Start","Categories","Bills","Discounts","Results"];

export default function Header({ step, user, onLoginClick, onAdminClick, onLogout }: Props) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-5 py-3">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 grad-bg rounded-xl flex items-center justify-center text-white text-base font-black">W</div>
          <div>
            <div className="font-display text-sm font-extrabold text-gray-900 leading-none">WindyWallet</div>
            <div className="text-[10px] text-gray-400 font-medium leading-none mt-0.5">Chicago Savings Engine</div>
          </div>
        </div>

        {/* Step indicator */}
        {step > 0 && step < 4 && (
          <div className="hidden sm:flex items-center gap-1">
            {STEPS.slice(1, 4).map((s, i) => (
              <div key={s} className="flex items-center gap-1">
                <div className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center transition-all
                  ${step - 1 >= i ? "grad-bg text-white" : "bg-gray-100 text-gray-400"}`}>
                  {step - 1 > i ? "✓" : i + 1}
                </div>
                {i < 2 && <div className={`w-8 h-0.5 transition-all ${step - 1 > i ? "bg-primary" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        )}

        {/* Auth */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              {user.role === "admin" && (
                <button onClick={onAdminClick}
                  className="text-xs font-bold text-primary bg-primary-light px-3 py-1.5 rounded-full hover:bg-blue-100 transition-all">
                  🔧 Admin
                </button>
              )}
              <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5">
                <div className="w-6 h-6 grad-bg rounded-full flex items-center justify-center text-white text-[11px] font-bold">
                  {user.name[0]}
                </div>
                <span className="text-xs font-semibold text-gray-700 hidden sm:block">{user.name.split(" ")[0]}</span>
              </div>
              <button onClick={onLogout} className="text-xs text-gray-400 hover:text-gray-600 font-medium">Sign out</button>
            </div>
          ) : (
            <button onClick={onLoginClick}
              className="text-xs font-bold text-white grad-bg px-4 py-2 rounded-full hover:opacity-90 transition-all shadow-btn">
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
