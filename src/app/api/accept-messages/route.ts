import { connectDB } from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import "@/model/Message.model";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";

export async function GET(req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);
  // console.log("session ===", session);

  const user = session?.user;

  if (!session || !user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const existingUser = await UserModel.findById(user._id);
    // console.log("exsiting Usr = ", existingUser);

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User not found At" },
        { status: 404 },
      );
    }

    //return user Message Accepting status
    return NextResponse.json(
      {
        success: true,
        isAcceptingMessages: existingUser.isAcceptingMessages,
        message: existingUser.isAcceptingMessages
          ? "User is accepting messages"
          : "User is not accepting messages",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error retrieving message acceptance status = ", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  // console.log("User = " , user);

  if (!session || !user) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }

  try {
    const { acceptMessages } = await req.json();

    const result = acceptMessageSchema.safeParse({ acceptMessages });
    // console.log("Validation result:", result);

    if (!result.success) {
      const errorMessage = result.error.issues[0].message;

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
        },
        { status: 400 },
      );
    }

    // console.log("acceptMessages = ", acceptMessages);

    if (typeof acceptMessages !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body",
        },
        { status: 400 },
      );
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { isAcceptingMessages: acceptMessages },
      { new: true },
    );

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found unable to updated message acceptance status",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message acceptance status updated successfully",
        updatedUser,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating message acceptance status = ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
