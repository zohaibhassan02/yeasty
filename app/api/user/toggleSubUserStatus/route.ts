import { connect } from '@/backend/database/dbConfig';
import { NextResponse, NextRequest } from 'next/server';
import SubUserModal from "@/backend/Model/SubUserModal";
const jwt = require('jsonwebtoken');


export async function PUT(request: NextRequest) {
    try {
        await connect();
  
        const { subUserId, isActive } = await request.json();

        const token = request.cookies.get('token');

        if (!token) {
          return NextResponse.json({
            message: "No token provided",
          }, {
            status: 401,
          });
        }

        const decoded = jwt.verify(token.value, process.env.JET_SECREAT);

        const subUser = await SubUserModal.findOne({ _id: subUserId, parentUser: decoded._id }).exec();
        if (!subUser) {
        return NextResponse.json({ message: "Sub-user not found or not authorized" }, { status: 404 });
        }
    
        subUser.isActive = isActive;
        await subUser.save();
        return NextResponse.json({ message: "Sub-user status updated successfully" }, { status: 200 });
  
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