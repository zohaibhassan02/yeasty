import { connect } from '@/backend/database/dbConfig';
import { NextResponse, NextRequest } from 'next/server';
import UserAuthModal from "@/backend/Model/UserAuthModal";
import SubUserModal from "@/backend/Model/SubUserModal";
const jwt = require('jsonwebtoken');
import nodemailer from "nodemailer";
import { cookies } from 'next/headers'; // Import cookies


export async function POST(request: NextRequest) {
    try {
        await connect();
  
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