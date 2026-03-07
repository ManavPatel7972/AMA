

// export async function DELETE(
//   req: Request,
//   params: { params: Promise<{ messageid: string }> },
// ) {
//   // console.log("Received DELETE request for message ID:", params);
//   const { messageid } = await params.params;

//   console.log("MessageID =", messageid);

//   if (!messageid) {
//     return NextResponse.json(
//       { success: false, message: "Message ID is required" },
//       { status: 400 },
//     );
//   }

//   await connectDB();

//   const session = await getServerSession(authOptions);
//   const user = session?.user;

//   if (!session || !user) {
//     return NextResponse.json(
//       { success: false, message: "Unauthorized" },
//       { status: 401 },
//     );
//   }

//   try {
//     const updatedResult = await UserModel.updateOne(
//       { _id: user._id },
//       {
//         $pull: { messages: { _id: messageid } },
//       },
//     );

//     if (updatedResult.modifiedCount === 0) {
//       return NextResponse.json(
//         { success: false, message: "Message not found or already deleted" },
//         { status: 404 },
//       );
//     }

//     return NextResponse.json(
//       { success: true, message: "Message deleted successfully" },
//       { status: 200 },
//     );
//   } catch (error) {
//     console.error("Error deleting message:", error);
//     return NextResponse.json(
//       { success: false, message: "Internal Server Error" },
//       { status: 500 },
//     );
//   }
// }

// export async function DELETE(
//   req: Request,
//   { params }: { params: Promise<{ messageid: string }> },
// ) {
//   const { messageid } = await params;

//   console.log("MessageID =", messageid);

//   if (!messageid) {
//     return NextResponse.json(
//       { success: false, message: "Message ID is required" },
//       { status: 400 },
//     );
//   }

//   await connectDB();

//   const session = await getServerSession(authOptions);
//   const user = session?.user;

//   if (!session || !user) {
//     return NextResponse.json(
//       { success: false, message: "Unauthorized" },
//       { status: 401 },
//     );
//   }

//   try {
//     const updatedResult = await UserModel.updateOne(
//       { _id: new mongoose.Types.ObjectId(user._id) },
//       {
//         $pull: { messages: { _id: messageid } },
//       },
//     );

//     if (updatedResult.modifiedCount === 0) {
//       return NextResponse.json(
//         { success: false, message: "Message not found or already deleted" },
//         { status: 404 },
//       );
//     }

//     return NextResponse.json(
//       { success: true, message: "Message deleted successfully" },
//       { status: 200 },
//     );
//   } catch (error) {
//     console.error("Error deleting message:", error);
//     return NextResponse.json(
//       { success: false, message: "Internal Server Error" },
//       { status: 500 },
//     );
//   }
// }


import { connectDB } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import UserModel from "@/model/User.model";
import MessageModel from "@/model/Message.model";
import ConversationModel from "@/model/Conversation.model";
import mongoose from "mongoose";


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ messageid: string }> }
) {
  const { messageid } = await params;

  if (!messageid) {
    return NextResponse.json(
      { success: false, message: "Message ID is required" },
      { status: 400 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(messageid)) {
    return NextResponse.json(
      { success: false, message: "Invalid Message ID" },
      { status: 400 }
    );
  }

  await connectDB();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // Delete message document
    const deletedMessage = await MessageModel.findByIdAndDelete(messageid);

    if (!deletedMessage) {
      return NextResponse.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      );
    }

    // If the message is part of a conversation, delete the conversation and any replies
    if (deletedMessage.conversationId) {
      await MessageModel.deleteMany({ conversationId: deletedMessage.conversationId });
      await ConversationModel.findByIdAndDelete(deletedMessage.conversationId);
    }

    // Remove message reference from user
    const updatedResult = await UserModel.updateOne(
      { _id: new mongoose.Types.ObjectId(user._id) },
      {
        $pull: { messages: new mongoose.Types.ObjectId(messageid) },
      }
    );

    if (updatedResult.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Message not found or already deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Message deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}