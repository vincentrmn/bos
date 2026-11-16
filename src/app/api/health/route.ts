import { NextResponse } from "next/server";
import { q } from "@/lib/db";

// Touche la base : jamais prerendue au build.
export const dynamic = "force-dynamic";

/** 200 prouve que la base repond et que ensureSchema() a rejoue sans echouer. */
export async function GET() {
  try {
    await q(`SELECT 1`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
