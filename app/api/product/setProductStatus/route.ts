import { connect } from '@/backend/database/dbConfig';
import { NextResponse, NextRequest } from 'next/server';
import ItemModal from "@/backend/Model/ProductModal";
const jwt = require("jsonwebtoken")

export async function PUT(request: NextRequest) {
    try {
        await connect();

        const token = request.cookies.get('token');

        if (!token) {
          return NextResponse.json({
            message: "No token provided",
          }, {
            status: 400,
          });
        }

        const decoded = jwt.verify(token.value, process.env.JET_SECREAT);

        const { _id, active } = await request.json();

        if (decoded.userType === "user") {
            const data = await ItemModal.findOneAndUpdate(
                { _id: _id },
                {
                    active: active,
                },
                { new: true }
            );
                return NextResponse.json({
                    status: 200,
                    data: data,
                },{
                    status: 200,
                });
        } else {
            return NextResponse.json({
                status: "error",
                message: "You are not authorized. Please sign in as a user to continue",
            },{
                status: 401,
            });
        }
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