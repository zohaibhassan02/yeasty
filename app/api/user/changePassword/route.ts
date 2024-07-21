import { connect } from '@/backend/database/dbConfig';
import { NextResponse, NextRequest } from 'next/server';
import UserAuthModal from "@/backend/Model/UserAuthModal";
const jwt = require('jsonwebtoken');
import bcrypt from 'bcryptjs';


export async function PUT(request: NextRequest) {
    try {
        await connect();
  
        const token = request.cookies.get('token');

        if (!token) {
          return NextResponse.json({
            message: "No token provided",
          }, {
            status: 401,
          });
        }

        const decoded = jwt.verify(token.value, process.env.JET_SECREAT);

        const { currentPassword, newPassword } = await request.json();
      
        const user = await UserAuthModal.findById(decoded._id).exec();
        if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
    
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
        return NextResponse.json({ message: "Old password is incorrect" }, { status: 400 });
        }
    
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        await user.save();
        return NextResponse.json({ message: "Password changed successfully" }, { status: 200 });
  
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
