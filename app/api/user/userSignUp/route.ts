export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { connect } from "@/backend/database/dbConfig";
import UserAuthModal from "@/backend/Model/UserAuthModal";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

// Change this to your frontend domain if you ever call from a different origin.
// For same-origin requests, this header doesn't hurt.
const ORIGIN = "https://yeasty.vercel.app";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": ORIGIN,
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Toggle this to false once POST works and you want to test real DB signup.
const TEST_MODE = false;

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json(
    { ok: true, route: "app/api/user/userSignUp", methods: ["GET", "POST", "OPTIONS"], testMode: TEST_MODE },
    { status: 200, headers: corsHeaders }
  );
}

export async function POST(request: NextRequest) {
  // 1) First, confirm POST is actually hitting this file:
  if (TEST_MODE) {
    let body: any = null;
    try {
      body = await request.json();
    } catch {
      body = { note: "No JSON body / failed to parse JSON" };
    }

    return NextResponse.json(
      { ok: true, message: "POST reached route.ts", received: body },
      { status: 200, headers: corsHeaders }
    );
  }

  // 2) Real signup logic (enable by setting TEST_MODE = false)
  try {
    await connect();

    const { fullName, email, password, companyName, hearFrom } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { status: "error", message: "email and password are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const existing = await UserAuthModal.findOne({ email }).exec();
    if (existing) {
      return NextResponse.json(
        { status: "error", message: "User already exists" },
        { status: 400, headers: corsHeaders }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserAuthModal({
      fullName,
      email,
      password: hashedPassword,
      companyName,
      hearFrom,
    });

    await newUser.save();

    return NextResponse.json(
      { status: "success", message: "User account created successfully" },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { status: "error", message: "Something went wrong" },
      { status: 500, headers: corsHeaders }
    );
  }
}
