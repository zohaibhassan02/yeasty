import { connect } from '@/backend/database/dbConfig';
import { NextResponse, NextRequest } from 'next/server';
import SubUserModal from "@/backend/Model/SubUserModal";
const jwt = require('jsonwebtoken');


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
      
        const subuser = await SubUserModal.findById(decoded._id).exec();
        if (!subuser) {
        return NextResponse.json({ message: "subuser not found" }, { status: 404 });
        }
    
        const isMatch = currentPassword === subuser.password;
        if (!isMatch) {
        return NextResponse.json({ message: "Old password is incorrect" }, { status: 400 });
        }
    
        subuser.password = newPassword;
        await subuser.save();
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