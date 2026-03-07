import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import { connectDB } from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 },
      );
    }

    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already exists Please choose another one",
        },
        { status: 400 },
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    //verifyCode 6 degit
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      //! Already verified
      if (existingUserByEmail.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "User already exist with this email",
          },
          { status: 400 },
        );

        //! email exist but Not verified
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;

        //10 minute valid verifyToken
        existingUserByEmail.verifyCodeExpiry = new Date(
          Date.now() + 1000 * 60 * 10,
        );

        //save user
        await existingUserByEmail.save();
      }
    }
    //! user not found with this email so create a user
    else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const expiryDate = new Date();
      // 10 minute valid verifyToken
      expiryDate.setMinutes(expiryDate.getMinutes() + 10);

      const newUser = UserModel.create({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
        authProvider: "local",
      });
    }

    //send verification email
    const emailResponse = await sendVerificationEmail(
      username,
      email,
      verifyCode,
    );

    console.log("Email respose ====>", emailResponse)

    if (!emailResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully. Please verify your account.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("Error Register User =", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error while Registering User",
      },
      { status: 500 },
    );
  }
}

