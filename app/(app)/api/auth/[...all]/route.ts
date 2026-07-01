import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ enabled: false, mode: "mock" });
}

export function POST() {
  return NextResponse.json({ enabled: false, mode: "mock" });
}
