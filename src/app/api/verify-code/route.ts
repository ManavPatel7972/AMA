import { connectDB } from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  try {
    const { username, code } = await req.json();

    if (!username || !code) {
      return NextResponse.json(
        { message: "Username and code are required" },
        { status: 400 },
      );
    }

    // Decode the username to handle URL-encoded characters
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json(
        { message: "User is already verified Please login." },
        { status: 400 },
      );
    }

    //check if code is correct
    const isCodeValid = user.verifyCode === code;
    const isCodeExpired = new Date(user.verifyCodeExpiry) < new Date();

    if (isCodeValid && !isCodeExpired) {
      user.isVerified = true;

      await user.save();

      return NextResponse.json(
        { message: "Verification successful" },
        { status: 200 },
      );

    } else if (isCodeExpired) {
      //code is expired
      return NextResponse.json(
        { message: "Verification code has expired" },
        { status: 400 },
      );
    } else {
      //code is invalid
      return NextResponse.json(
        { message: "Invalid verification code" },
        { status: 400 },
      );
      
    }
  } catch (error) {
    console.log("Error verifying code:", error);
    return NextResponse.json(
      { success: false, message: "Error verifying user" },
      { status: 500 },
    );
  }
}

