import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ success: true, mode: "mock" }, { status: 201 });
}
