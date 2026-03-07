// // import { connectDB } from "@/lib/dbConnect";
// // import UserModel from "@/model/User.model";
// // import { Message } from "@/model/Message.model";
// // import { NextResponse } from "next/server";

// // export async function POST(req: Request) {
// //   await connectDB();

// //   try {
// //     const { username, content } = await req.json();

// //     if (!username || !content) {
// //       return NextResponse.json(
// //         { success: false, error: "Username and content are required" },
// //         { status: 400 },
// //       );
// //     }

// //     const user = await UserModel.findOne({ username });

// //     if (!user) {
// //       return NextResponse.json({ error: "User not found" }, { status: 404 });
// //     }

// //     //check if user is Accepting messages or Not
// //     if (!user.isAcceptingMessages) {
// //       return NextResponse.json(
// //         { success: false, error: "User is not accepting messages" },
// //         { status: 403 }, // 403 forbidden
// //       );
// //     }

// //     //because Message model requires content and createdAt
// //     const newMessage = { content, createdAt: new Date() };

// //     // Push the new message to the user's messages array
// //     user.messages.push(newMessage as Message);
// //     await user.save();

// //     return NextResponse.json(
// //       {
// //         success: true,
// //         message: "Message sent successfully",
// //       },
// //       { status: 201 },
// //     );
// //   } catch (error) {
// //     console.error("Error sending message:", error);
// //     return NextResponse.json(
// //       { success: false, error: "Failed to send message" },
// //       { status: 500 },
// //     );
// //   }
// // }

import { connectDB } from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import MessageModel from "@/model/Message.model";
import ConversationModel from "@/model/Conversation.model";
import { NextResponse } from "next/server";
import { messageSchema } from "@/schemas/messageSchema";

export async function POST(req: Request) {
  await connectDB();

  try {
    const { username, content } = await req.json();

    // Check username exists
    if (!username) {
      return NextResponse.json(
        { success: false, error: "Username is required" },
        { status: 400 },
      );
    }

    //! Zod Validation
    const result = messageSchema.safeParse({ content });
    console.log("Validation result:", result);

    if (!result.success) {
      const errorMessage = result.error.issues[0].message;

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
        },
        { status: 400 },
      );
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    //! Check if user accepts messages
    if (!user.isAcceptingMessages) {
      return NextResponse.json(
        { success: false, error: "User is not accepting messages" },
        { status: 403 },
      );
    }

    const conversation = await ConversationModel.create({
      receiverId: user._id,
    });

    const senderToken = crypto.randomUUID();

    const message = await MessageModel.create({
      content,
      conversationId: conversation._id,
      senderToken,
      type: "message",
      receiverId: user._id,
    });

    user.messages.push(message._id);
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully",
        conversationId: conversation._id.toString(),
        senderToken,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error sending message:", error);

    return NextResponse.json(
      { success: false, error: "Failed to send message" },
      { status: 500 },
    );
  }
}
