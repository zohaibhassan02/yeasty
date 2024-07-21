import { connect } from '@/backend/database/dbConfig';
import { NextResponse, NextRequest } from 'next/server';
import ItemModal from "@/backend/Model/ProductModal";
const jwt = require("jsonwebtoken")
import SubUserModal from "@/backend/Model/SubUserModal";
import UserAuthModal from "@/backend/Model/UserAuthModal";
const QRCode = require('qrcode');
const PDFDocument = require("pdfkit");
const path = require("path");

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

        const { category } = await request.json();

        if (decoded.userType === "subUser") {
            const subUser = await SubUserModal.findById(decoded._id);
            if (subUser) {
                const Record = await ItemModal.find({ userId: subUser.parentUser, category: category, active: true }).sort('position');
                if (Record) {
                    return NextResponse.json({
                        status: "success",
                        message: "Get All Products Successfully",
                        data: Record,
                    },{
                        status: 200,
                    });
                } else {
                    return NextResponse.json({
                        status: "error",
                        message: "Something Went Wrong",
                    },{
                        status: 400,
                    });
                }
            } else {
                return NextResponse.json({
                    status: "error",
                    message: "Something Went Wrong",
                },{
                    status: 400,
                });
            }
        } else if (decoded.userType === "user") {
            const Record = await ItemModal.find({ userId: decoded._id, category: category }).sort('position');
            if (Record) {
                return NextResponse.json({
                    status: "success",
                    message: "Get All Products Successfully",
                    data: Record,
                },{
                    status: 200,
                });
            } else {
                return NextResponse.json({
                    status: "error",
                    message: "Something Went Wrong",
                },{
                    status: 400,
                });
            }
        } else {
            return NextResponse.json({
                status: "error",
                message: "You are not signed in. Please sign in to continue",
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