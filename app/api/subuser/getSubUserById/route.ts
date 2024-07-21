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

        const { _id } = await request.json();
  
        const subUser = await SubUserModal.findById(_id);
        if (!subUser) {
            return NextResponse.json({ message: 'Sub-user not found' }, { status: 404 });
        }

        return NextResponse.json(subUser, { status: 200 });
  
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