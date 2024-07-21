import { NextResponse, NextRequest } from 'next/server';


export async function POST(request: NextRequest) {
    try {
  
        const response = NextResponse.json({
            message: "Logout successful",
          },{
            status: 200,
            // headers: { 'Set-Cookie': `token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=9999` }
          });
  
          response.cookies.delete("token");
  
          return response;
  
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