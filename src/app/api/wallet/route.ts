import { NextRequest, NextResponse } from "next/server";
import { saveWalletPlan, getWallet } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const plans = getWallet(userId);
  const total = plans.reduce((s: number, p: any) => s + p.monthlySaving, 0);
  return NextResponse.json({ plans, totalMonthlySavings: total, totalAnnualSavings: total * 12 });
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const plan = await req.json();
  const updated = saveWalletPlan(userId, { ...plan, selectedAt: new Date().toISOString() });
  return NextResponse.json({ success: true, plans: updated });
}
