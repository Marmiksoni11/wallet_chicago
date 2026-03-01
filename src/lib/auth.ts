// src/lib/auth.ts — Simple in-memory auth (no DB required for demo)

import type { User, UserRole } from "@/types";

// Mock user database
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: "admin-1",
    name: "Alex Rivera",
    email: "admin@windywallet.com",
    password: "admin123",
    role: "admin",
    zip: "60601",
    wallet: { selectedPlans: [], totalMonthlySavings: 0, totalAnnualSavings: 0 },
  },
  {
    id: "user-1",
    name: "Jordan Chen",
    email: "demo@windywallet.com",
    password: "demo123",
    role: "user",
    zip: "60607",
    wallet: {
      selectedPlans: [
        { category: "mobile", planId: "mint-30", planName: "Mint Mobile", previousCost: 75, newCost: 30, monthlySaving: 45, annualSaving: 540, selectedAt: "2024-01-15" },
        { category: "internet", planId: "rcn-200", planName: "RCN Chicago – 200 Mbps", previousCost: 89, newCost: 40, monthlySaving: 49, annualSaving: 588, selectedAt: "2024-01-15" },
      ],
      totalMonthlySavings: 94,
      totalAnnualSavings: 1128,
    },
  },
];

export function loginUser(email: string, password: string): (User & { password?: string }) | null {
  const found = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!found) return null;
  const { password: _, ...user } = found;
  return user;
}

export function getUserById(id: string): User | null {
  const found = MOCK_USERS.find(u => u.id === id);
  if (!found) return null;
  const { password: _, ...user } = found;
  return user;
}

// In-memory wallet store (server-side, resets on restart for demo)
const walletStore: Record<string, any> = {};

export function saveWalletPlan(userId: string, plan: any) {
  if (!walletStore[userId]) walletStore[userId] = [];
  // Remove existing plan for this category
  walletStore[userId] = walletStore[userId].filter((p: any) => p.category !== plan.category);
  walletStore[userId].push(plan);
  return walletStore[userId];
}

export function getWallet(userId: string) {
  return walletStore[userId] ?? [];
}
