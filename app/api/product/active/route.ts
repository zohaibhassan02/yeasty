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

        const url = new URL(request.url);
        const category = url.searchParams.get('category');

        if(category === null){
            return NextResponse.json({
                message: "No category provided",
            }, {
                status: 400,
            });
        }
        const categories = category.split(",");

        const query = {
            userId: decoded._id,
            category: { $in: categories },
            active: true,
        };

        const products = await ItemModal.find(query).sort('position');

        return NextResponse.json({
            status: "success",
            message: "Get Active Products Successfully",
            data: products
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