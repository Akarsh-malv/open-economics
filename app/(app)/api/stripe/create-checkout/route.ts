import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json({
    success: false,
    error: "Checkout is disabled in the front-end-only Open Economics template.",
  });
}
