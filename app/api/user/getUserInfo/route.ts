import { connect } from '@/backend/database/dbConfig';
import { NextResponse, NextRequest } from 'next/server';
import UserAuthModal from "@/backend/Model/UserAuthModal";
const jwt = require('jsonwebtoken');

export async function POST(request: NextRequest) {
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
        const user = await UserAuthModal.findById(decoded._id).exec();

        if (!user) {
          return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
    
        return NextResponse.json({
          message: "success",
          status: 200,
          data: user
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