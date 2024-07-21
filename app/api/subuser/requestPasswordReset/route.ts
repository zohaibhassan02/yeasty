import { connect } from '@/backend/database/dbConfig';
import { NextResponse, NextRequest } from 'next/server';
import SubUserModal from "@/backend/Model/SubUserModal";
import nodemailer from "nodemailer";
const jwt = require('jsonwebtoken');


export async function POST(request: NextRequest) {
    try {
        await connect();

        const { email } = await request.json();
        const subuser = await SubUserModal.findOne({ email }).exec();
        if (!subuser) {
        return NextResponse.json({ message: "subuser not found" }, { status: 404 });
        }
    
        const resetToken = jwt.sign({ id: subuser._id }, process.env.JET_SECREAT, { expiresIn: "1h" });
    
        const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
        });
    
        const resetLink = `${process.env.FRONTEND_URL}set-password?token=${resetToken}`;
        const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Password Reset Request",
        text: `Click the following link to reset your password: ${resetLink}`,
        };
    
        await transporter.sendMail(mailOptions);
        return NextResponse.json({ message: "Password reset email sent successfully" }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({
          message: "Something went wrong",
        },{
          status: 500,
        });
    }
    
}