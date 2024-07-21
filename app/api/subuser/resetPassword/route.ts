import { connect } from '@/backend/database/dbConfig';
import { NextResponse, NextRequest } from 'next/server';
import SubUserModal from "@/backend/Model/SubUserModal";
const jwt = require('jsonwebtoken');


export async function PUT(request: NextRequest) {
    try {
        await connect();
  
        const url = new URL(request.url);
        const token = url.searchParams.get('token');

        const { newPassword } = await request.json();

        const decoded = jwt.verify(token, process.env.JET_SECREAT);
        const subuser = await SubUserModal.findById(decoded.id).exec();

        if (!subuser) {
        return NextResponse.json({ message: "subuser not found" }, );
        }
    
        subuser.password = newPassword;
        await subuser.save();
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