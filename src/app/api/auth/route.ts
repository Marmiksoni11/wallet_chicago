import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    const user = loginUser(email, password);
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    return NextResponse.json({ success: true, user });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
