import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import { connectDB } from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  const { identifier } = await req.json();

  const user = await UserModel.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });

  if (!user) {
    return NextResponse.json({
      success: false,
      message: "User not found",
    });
  }

  if (user.isVerified) {
    return NextResponse.json({
      success: false,
      message: "User is already verified Please login.",
    });
  }

  const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

  const verifyCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

  user.verifyCode = verifyCode;
  user.verifyCodeExpiry = verifyCodeExpiry;

  await user.save();

  await sendVerificationEmail(user.username, user.email, verifyCode);

  return NextResponse.json({
    success: true,
    message: "Verification code sent",
  });
}
