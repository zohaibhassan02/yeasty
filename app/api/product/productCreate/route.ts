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


        if(decoded.userType === "user"){
            const { productName, abv, category, description, type, style, producer, quantity, pricintList, imageUrl } = await request.json();
    
            const userId = decoded._id;
            // Find the highest position for the user's products
            const highestPositionProduct = await ItemModal.findOne({ userId }).sort('-position').exec();
            const highestPosition = highestPositionProduct ? highestPositionProduct.position : -1;

            const newProduct = new ItemModal({
                userId,
                productName,
                abv,
                category,
                description,
                type,
                style,
                producer,
                quantity,
                pricintList,
                imageUrl,
                position: highestPosition + 1, // Set position to be one greater than the highest current position
            });

            const savedProduct = await newProduct.save();
            return NextResponse.json({
                status: "success",
                message: "Product added successfully",
                data: savedProduct,
            },{
                status: 200,
            });
        }
        else {
            return NextResponse.json({
                status: "error",
                message: "You are not authorized. Please sign in as a user to continue",
            },{
                status: 401,
            })
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