import { connect } from '@/backend/database/dbConfig';
import { NextResponse, NextRequest } from 'next/server';
import UserAuthModal from "@/backend/Model/UserAuthModal";
import bcrypt from 'bcryptjs';

const ORIGIN = "https://yeasty.vercel.app";

const cors = {
  "Access-Control-Allow-Origin": ORIGIN,
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: cors });
}

export async function GET() {
  return NextResponse.json({ ok: true, route: "app/api/user/userSignUp" }, { headers: cors });
}

export async function POST(request: NextRequest) {
  try {
    await connect();

    const { fullName, email, password, companyName, hearFrom } = await request.json();

    const user = await UserAuthModal.findOne({ email }).exec();
    if (user) {
      return NextResponse.json(
        { status: "error", message: "User already exists" },
        { status: 400, headers: cors }
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
      { status: 200, headers: cors }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500, headers: cors }
    );
  }
}
