import mongoose from "mongoose";

let isConnected = false;

export async function connect() {
  if (isConnected || mongoose.connection.readyState >= 1) return;

  const password = process.env.DATABASE_PASSWORD;
  if (!password) throw new Error("DATABASE_PASSWORD is not set");

  const uri = `mongodb+srv://zohaibhassan22002:${encodeURIComponent(
    password
  )}@cluster0.xzn1q5f.mongodb.net/yeasty?retryWrites=true&w=majority&appName=Cluster0`;

  try {
    await mongoose.connect(uri); // ✅ IMPORTANT: await
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    // ❌ DON'T process.exit() on Vercel/serverless
    throw err;
  }
}
