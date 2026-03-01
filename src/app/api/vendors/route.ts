import { NextResponse } from "next/server";
import { CHICAGO_VENDORS } from "@/lib/plans";

export async function GET() {
  return NextResponse.json({ vendors: CHICAGO_VENDORS });
}
