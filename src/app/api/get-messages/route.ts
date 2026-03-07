// import { connectDB } from "@/lib/dbConnect";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../auth/[...nextauth]/options";
// import { NextResponse } from "next/server";
// import mongoose, { mongo } from "mongoose";
// import UserModel from "@/model/User.model";

// export async function GET(req: Request) {
//   await connectDB();

//   const session = await getServerSession(authOptions);
//   console.log("session ===", session);

//   const _user = session?.user;
//   console.log("User =====>", _user);

//   if (!_user) {
//     return NextResponse.json(
//       { success: false, message: "Unauthorized" },
//       { status: 401 },
//     );
//   }

//   //because _user.id is a string (convert as string when user login in nextauth api), we need to convert it to ObjectId to use it in mongoose queries
//   const userId = new mongoose.Types.ObjectId(_user._id);

//   try {
//     const user = await UserModel.aggregate([
//       { $match: { _id: userId } },
//       { $unwind: "$messages" },
//       { $sort: { "messages.createdAt": -1 } },
//       { $group: { _id: "$_id", messages: { $push: "$messages" } } },
//     ]);

//     if (!user) {
//       return NextResponse.json(
//         { success: false, message: "User not found" },
//         { status: 404 },
//       );
//     }

//     if (user.length === 0) {
//       return NextResponse.json(
//         { success: true, messages: [] },
//         { status: 200 },
//       );
//     }

//     console.log("User with messages ===>", user);

//     return NextResponse.json(
//       {
//         success: true,
//         messages: user[0].messages,
//       },
//       { status: 200 },
//     );
//   } catch (error) {
//     console.error("Error fetching messages:", error);
//     return NextResponse.json(
//       { success: false, message: "Internal Server Error" },
//       { status: 500 },
//     );
//   }
// }


import { connectDB } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import UserModel from "@/model/User.model";
import MessageModel from "@/model/Message.model";

export async function GET(req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);
  const _user = session?.user;

  if (!_user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const user = await UserModel.findById(_user._id)
      .populate({
        path: "messages",
        options: { sort: { createdAt: -1 } }, // newest first
      });

    // console.log("User===>", user)

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const populateMessages = user.messages as any[];

    // console.log("populateMessages ===>", populateMessages)

    // Fetch replies for messages that have a conversationId
    const messagesWithReplies = [];

    for (const msg of populateMessages) {
      // .toObject() converts the mongoose document → normal object
      const msgObj = msg.toObject ? msg.toObject() : msg;

      let replyMessage = null;

      if (msgObj.conversationId) {
        replyMessage = await MessageModel.findOne({
          conversationId: msgObj.conversationId,
          type: "reply",
        }).lean();
        //  lean() ->  Plain JavaScript Objects (not extra information return)
      }

      messagesWithReplies.push({
        ...msgObj,
        reply: replyMessage || null,
      });
    }

    // console.log("messagesWithReplies ===>", messagesWithReplies)



    return NextResponse.json(
      {
        success: true,
        messages: messagesWithReplies,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}