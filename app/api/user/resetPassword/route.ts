import { connect } from '@/backend/database/dbConfig';
import { NextResponse, NextRequest } from 'next/server';
import UserAuthModal from "@/backend/Model/UserAuthModal";
const jwt = require('jsonwebtoken');
import bcrypt from 'bcryptjs';


export async function PUT(request: NextRequest) {
    try {
        await connect();
  
        const url = new URL(request.url);
        const token = url.searchParams.get('token');

        const { newPassword } = await request.json();

        const decoded = jwt.verify(token, process.env.JET_SECREAT);
        const user = await UserAuthModal.findById(decoded.id).exec();

        if (!user) {
        return NextResponse.json({ message: "User not found" }, );
        }
    
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();
        return NextResponse.json({ message: "Password reset successfully" });
  
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
