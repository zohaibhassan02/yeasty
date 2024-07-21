import { connect } from '@/backend/database/dbConfig';
import { NextResponse, NextRequest } from 'next/server';
import UserAuthModal from "@/backend/Model/UserAuthModal";
import SubUserModal from "@/backend/Model/SubUserModal";
const jwt = require('jsonwebtoken');
import nodemailer from "nodemailer";


export async function POST(request: NextRequest) {
    try {
        await connect();
  
        const { email } = await request.json();

        const token = request.cookies.get('token');

        if (!token) {
          return NextResponse.json({
            message: "No token provided",
          }, {
            status: 401,
          });
        }

        const decoded = jwt.verify(token.value, process.env.JET_SECREAT);

        const parentUserId = decoded._id;
      
        const parentUser = await UserAuthModal.findById(parentUserId).exec();
        if (!parentUser) {
        return NextResponse.json({ message: "Parent user not found" },{ status: 404 });
        }
    
        const existingSubUser = await SubUserModal.findOne({ email: email }).exec();
        if (existingSubUser) {
        return NextResponse.json({ message: "Sub-user already exists" }, { status: 400 });
        }
    
        const subUser = new SubUserModal({
        email: email,
        password: "password123",
        parentUser: parentUser._id,
        });
    
        await subUser.save();
        parentUser.subusers.push(subUser._id);
        await parentUser.save();
    
        const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
        });
    
        const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Sub-user Invitation",
        text: `You have been invited to create a sub-user account. Please use this temporary password to log in and set your new password: password123`,
        };
    
        await transporter.sendMail(mailOptions);
        return NextResponse.json({ message: "Invitation sent successfully", newSubUserId: subUser._id }, { status: 200 });
  
    }
    catch (error) {
        console.log(error);
        NextResponse.json({
          message: "Something went wrong",
        },{
          status: 500,
        });
    }
    
}