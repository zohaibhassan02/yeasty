import { NextResponse, NextRequest } from 'next/server';
const jwt = require('jsonwebtoken');

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
  
      try {
        const decoded = await jwt.verify(token.value, process.env.JET_SECREAT);
        return NextResponse.json({
          message: "Token is valid",
        }, {
          status: 200,
        });
      } catch (error) {
        return NextResponse.json({
          message: "Invalid or expired token",
        }, {
          status: 401,
        });
      }
    } catch (error) {
      return NextResponse.json({
        message: "Something went wrong",
      }, {
        status: 500,
      });
    }
  }