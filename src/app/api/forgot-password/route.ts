import { connectDB } from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendForgotPasswordEmail } from "@/helper/sendForgotPasswordEmail";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 },
      );
    }

    const existingUser = await UserModel.findOne({ email });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    existingUser.resetPasswordToken = hashedToken;

    // set ttoken expiry time to 10 minutes
    existingUser.resetPasswordExpire = new Date(Date.now() + 1000 * 60 * 10);

    await existingUser.save();

    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // send email with resetLink here using your email service provider
    const emailRespose = await sendForgotPasswordEmail(
      existingUser.username,
      existingUser.email,
      resetLink,
    );

    if (!emailRespose.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            emailRespose.message || "Failed to send reset password email",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Password reset link sent to email" },
      { status: 200 },
    );
    
  } catch (error) {
    console.error("Error in forgot password:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
