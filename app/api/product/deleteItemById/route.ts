import { connect } from '@/backend/database/dbConfig';
import { NextResponse, NextRequest } from 'next/server';
import ItemModal from "@/backend/Model/ProductModal";
const jwt = require("jsonwebtoken")

export async function DELETE(request: NextRequest) {
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

        const { _id } = await request.json();

        if(decoded.userType === "user"){
            const productToDelete = await ItemModal.findById(_id);
            if (!productToDelete) {
                return NextResponse.json({
                    status: "error",
                    message: "Product not found",
                },{
                    status: 404,
                });
            }
    
            // Delete the product
            await ItemModal.findByIdAndDelete(_id);
    
            // Get the remaining products for the user, ordered by position
            const remainingProducts = await ItemModal.find({ userId: productToDelete.userId }).sort('position').exec();
    
            // Update the positions of the remaining products
            const updates = remainingProducts.map((product, index) => {
                return ItemModal.findByIdAndUpdate(product._id, { position: index }, { new: true });
            });
    
            await Promise.all(updates);
    
            return NextResponse.json({
                status: "success",
                message: "Product deleted and positions updated successfully",
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