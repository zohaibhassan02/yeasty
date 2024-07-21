import { connect } from '@/backend/database/dbConfig';
import { NextResponse, NextRequest } from 'next/server';
import UserAuthModal from "@/backend/Model/UserAuthModal";
import bcrypt from 'bcryptjs';
const jwt = require('jsonwebtoken');

export async function POST(request: NextRequest) {
    try {
        await connect();

        const { email, password } = await request.json();
        const user = await UserAuthModal.findOne({ email: email });
        if (!user) {
            return NextResponse.json({
                message: "Invalid email or password",
            }, {
                status: 404,
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ _id: user._id, userType: "user" }, process.env.JET_SECREAT);

            const response = NextResponse.json({
                token,
                message: "Login successful",
            }, {
                status: 200,
            });

            response.cookies.set("token", token, {
                maxAge: 9999,
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            });

            return response;
        } else {
            return NextResponse.json({
                message: "Invalid email or password",
            }, {
                status: 404,
            });
        }

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Incorrect email or password",
        }, {
            status: 500,
        });
    }
}
