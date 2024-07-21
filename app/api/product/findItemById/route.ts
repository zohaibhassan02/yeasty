import { connect } from '@/backend/database/dbConfig';
import { NextResponse, NextRequest } from 'next/server';
import ItemModal from "@/backend/Model/ProductModal";
const jwt = require("jsonwebtoken")

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

        const { _id } = await request.json();

        const record = await ItemModal.findById(_id);
        if (record) {
            return NextResponse.json({
                status: 200,
                record: record,
            },{
                status: 200,
            });
        } else {
            return NextResponse.json({
                status: 400,
                message: "Product not found",
            },{
                status: 400,
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