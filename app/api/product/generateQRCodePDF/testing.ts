import { connect } from '@/backend/database/dbConfig';
import { NextResponse, NextRequest } from 'next/server';
const jwt = require("jsonwebtoken")
import QRCode from 'qrcode';
import PDFDocument from 'pdfkit'; // Correctly import PDFDocument

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

        const decoded = jwt.verify(token.value, process.env.JET_SECREAT);

        const { link } = await request.json();

        const url = await QRCode.toDataURL(link);
        if (!url) {
            return NextResponse.json({
                status: "error",
                message: "Failed to generate QR code",
            }, {
                status: 400,
            });
        }

        const doc = new PDFDocument();
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);

            NextResponse.next({
                headers: {
                    'Content-Disposition': 'attachment; filename=QRCode.pdf',
                    'Content-Type': 'application/pdf',
                }
            });

            return NextResponse.json({
                body: pdfData
            },{
                status: 200
            })

        });

        // Add the QR code image to the PDF document
        doc.image(url, {
            fit: [250, 250],
            align: 'center',
            valign: 'center'
        });

        // Finalize the PDF and end the stream
        doc.end();
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Something went wrong",
        }, {
            status: 500,
        });
    }
}
