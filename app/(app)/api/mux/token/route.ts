import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Mux playback is disabled in this front-end-only template." },
    { status: 404 },
  );
}
