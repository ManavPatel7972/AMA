import { connectDB } from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { usernameSchema } from "@/schemas/signUpSchema";
import { NextResponse } from "next/server";
import { z } from "zod";
import "@/model/Message.model";

const usernameQuerySchema = z.object({
  username: usernameSchema,
});

export async function POST(req: Request) {
  await connectDB();

  try {

    const url = req.url;
    // console.log("url :", url);

    const searchParams = new URL(url).searchParams;
    // console.log("SearchParams = ", searchParams);

    const queryParams = { username: searchParams.get("username") };
    // console.log("queryParams : ", queryParams);

    const result = usernameQuerySchema.safeParse(queryParams);

    //this result come from zod validation, it contains success and data or error properties
    // console.log("result ===>", result);

    // console.log("result Message = ", result.error?.issues[0].message);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.error?.issues[0].message || "Invalid username format",
        },
        { status: 400 },
      );
    }

    const { username } = result.data;

    const existingUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Username is available",
      },
      { status: 200 },
    );
    
  } catch (error) {
    console.log("Error checking Username unique or not  =", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error username uniqueness check",
      },
      { status: 500 },
    );
  }
}
