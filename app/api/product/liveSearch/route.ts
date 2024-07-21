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

        const { query } = await request.json();
  
        if (!query) {
          return NextResponse.json({
            status: "error",
            message: "Query is required",
          },{
            status: 400,
          });
        }
        
            const searchQuery = query.trim();
        //   const products = await ItemModal.find({
        //     $or: [
        //       { productName: { $regex: searchQuery, $options: "i" } },
        //       { description: { $regex: searchQuery, $options: "i" } },
        //     ],
        //   });
        
        const products = await ItemModal.find({
            productName: { $regex: searchQuery, $options: "i" },
            userId: decoded._id,

        });
        return NextResponse.json({
        status: "success",
        data: products,
        },{
            status: 200,
        });
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