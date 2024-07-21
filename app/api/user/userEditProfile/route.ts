import { connect } from '@/backend/database/dbConfig';
import { NextResponse, NextRequest } from 'next/server';
import UserAuthModal from "@/backend/Model/UserAuthModal";
import SubUserModal from "@/backend/Model/SubUserModal";
const jwt = require('jsonwebtoken');
import nodemailer from "nodemailer";
import { cookies } from 'next/headers'; // Import cookies


export async function PUT(request: NextRequest) {
    try {
        await connect();
  
        const updates = await request.json();

        const token = request.cookies.get('token');

        if (!token) {
          return NextResponse.json({
            message: "No token provided",
          }, {
            status: 401,
          });
        }

        const decoded = jwt.verify(token.value, process.env.JET_SECREAT);

        console.log(updates);

        const user = await UserAuthModal.findByIdAndUpdate(decoded._id, updates.updates, { new: true }).exec();

        if (!user) {
          return NextResponse.json({
            status: "error",
            message: "No user found",
          },{
            status: 404,
          });
        }
        console.log("yayayayaa")
        return NextResponse.json({
          status: "success",
          message: "Profile updated successfully",
        },{
            status: 200,
        });
  
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