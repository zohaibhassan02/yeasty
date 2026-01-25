export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

/**
 * This route does NOTHING except prove:
 * - POST works
 * - You are hitting the correct deployment
 */

export async function GET() {
  return NextResponse.json({
    ok: true,
    method: "GET",
    stamp: "USER_SIGNUP_ROUTE_GET_vFINAL",
  });
}

export async function POST() {
  return NextResponse.json({
    ok: true,
    method: "POST",
    stamp: "USER_SIGNUP_ROUTE_POST_vFINAL",
    time: new Date().toISOString(),
  });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
