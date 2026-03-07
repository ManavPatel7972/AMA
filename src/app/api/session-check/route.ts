import { connectDB } from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import UserModel from "@/model/User.model";

export async function GET(Req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session?.user?._id) {
    return NextResponse.json({ valid: false });
  }

  const user = await UserModel.findById(session.user._id);

  if (!user) {
    return NextResponse.json({ valid: false });
  }

  return NextResponse.json({
    valid: true,
    sessionVersion: user.sessionVersion,
  });
}
