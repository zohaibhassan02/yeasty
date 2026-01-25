export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/backend/database/dbConfig";

export async function POST(req: NextRequest) {
  await connect();
  return NextResponse.json({ ok: true, step: "connect() worked" });
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
