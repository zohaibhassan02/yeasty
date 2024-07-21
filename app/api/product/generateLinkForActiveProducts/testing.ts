
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {

        const token = request.cookies.get('token');

        if (!token) {
          return NextResponse.json({
            message: "No token provided",
          }, {
            status: 401,
          });
        }

        console.log("hello")

        const url = new URL(request.url);
        const category = url.searchParams.get('category');

        console.log(category)

        const link = `${process.env.BACKEND_URL}/product/api/active?category=${category}`;
        return NextResponse.json({
            status: "success",
            message: "Link generated successfully",
            link: link
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