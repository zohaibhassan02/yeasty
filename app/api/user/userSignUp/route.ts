export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import UserAuthModal from "@/backend/Model/UserAuthModal";

export async function POST(req: NextRequest) {
  // Just touch the model
  const name = UserAuthModal?.modelName || "no-model";
  return NextResponse.json({ ok: true, step: "model import worked", name });
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
