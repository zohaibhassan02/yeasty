export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const hash = await bcrypt.hash("test1234", 10);
  return NextResponse.json({ ok: true, step: "bcrypt worked", hashLen: hash.length });
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
