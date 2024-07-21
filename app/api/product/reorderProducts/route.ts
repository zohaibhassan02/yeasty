import { connect } from '@/backend/database/dbConfig';
import { NextResponse, NextRequest } from 'next/server';
import ItemModal from "@/backend/Model/ProductModal";
const jwt = require("jsonwebtoken")

interface ReorderedProduct {
    _id: string;
  }
  

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

        const { reorderedProducts }: { reorderedProducts: ReorderedProduct[] } = await request.json();

        const updates = reorderedProducts.map((product: ReorderedProduct, index: number) => {
            return ItemModal.findByIdAndUpdate(product._id, { position: index }, { new: true }).exec();
        });

        const updatedProducts = await Promise.all(updates);

        return NextResponse.json({
            status: "success",
            message: updatedProducts,
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