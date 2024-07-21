import { connect } from '@/backend/database/dbConfig';
import { NextResponse, NextRequest } from 'next/server';
const jwt = require("jsonwebtoken")
const QRCode = require('qrcode');

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

        const { link } = await request.json();

        const url = await QRCode.toDataURL(link)
            if (!url) {
                return NextResponse.json({
                    status: "error",
                    message: "Failed to generate QR code",
                },{
                    status: 400,
                });
            }

            // return res.render('displayQRCode', { qrcode: url });
            return NextResponse.json({
                status: "success",
                message: "QR Code generated successfully",
                data: url,
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