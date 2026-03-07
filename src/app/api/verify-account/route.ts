import { connectDB } from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { NextResponse } from "next/server";
import crypto from "crypto"
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(req: Request) {

  try {
    await connectDB();

    const { action, identifier, code } = await req.json();

    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    //! send verification code
    if (action === "sendCode") {

      //already verifed
      if (user.isVerified) {
        return NextResponse.json({
          success: false,
          message: "User is already verified Please login.",
        });
      }

      const verifyCode = crypto.randomInt(100000, 999999).toString();
      user.verifyCode = verifyCode;
      user.verifyCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

      await user.save();

      //! send email  
      const emailResponse = await sendVerificationEmail(user.username, user.email, verifyCode);

      if (!emailResponse.success) {
        return NextResponse.json({
          success: false,
          message: emailResponse.message
        })
      }

      return NextResponse.json({
        success: true,
        message: "Verification code sent",
      });

    }

    //! Verifie verification code
    if (action === "verifyCode") {

      if (user.isVerified) {
        return NextResponse.json({
          success: false,
          message: "User already verified",
        });
      }

      if (user.verifyCode !== code) {
        return NextResponse.json({
          success: false,
          message: "Invalid verification code",
        });
      }

      if (user.verifyCodeExpiry < new Date()) {
        return NextResponse.json({
          success: false,
          message: "Verification code expired",
        });
      }


      user.isVerified = true;
      user.verifyCode = undefined as any;
      user.verifyCodeExpiry = undefined as any;

      await user.save();

      return NextResponse.json({
        success: true,
        message: "Account verified successfully",
      });
    }
  } catch (error) {
    console.log("Error In verify Account = ", error)

    return NextResponse.json({
      success: false,
      message: "Error While Verify Account"
    }, { status: 500 })
  }
}
