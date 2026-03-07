import { connectDB } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import MessageModel from "@/model/Message.model";
import ConversationModel from "@/model/Conversation.model";
import { replySchema } from "@/schemas/replySchema";

export async function POST(req: Request) {
    await connectDB();

    try {
        const session = await getServerSession(authOptions);
        const user = session?.user;

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { conversationId, replyContent } = await req.json();

        // Zod Validation
        const result = replySchema.safeParse({ conversationId, replyContent });

        if (!result.success) {
            return NextResponse.json(
                { success: false, message: result.error.issues[0].message },
                { status: 400 }
            );
        }

        // Verify conversation exists and belongs to user
        const conversation = await ConversationModel.findById(conversationId);

        if (!conversation) {
            return NextResponse.json(
                { success: false, message: "Conversation not found" },
                { status: 404 }
            );
        }

        // Check if the conversation belong to the user or not
        if (conversation.receiverId.toString() !== user._id.toString()) {
            return NextResponse.json(
                { success: false, message: "Not authorized to reply to this conversation" },
                { status: 403 }
            );
        }

        // Check if a reply already exists (optional, if we only allow one reply)
        const existingReply = await MessageModel.findOne({
            conversationId: conversation._id,
            type: "reply",
        });

        if (existingReply) {
            return NextResponse.json(
                { success: false, message: "You have already replied to this message." },
                { status: 400 }
            );
        }

        // Create the reply
        const replyMessage = await MessageModel.create({
            content: replyContent,
            conversationId: conversation._id,
            type: "reply",
            receiverId: user._id, 
        });

        return NextResponse.json(
            {
                success: true,
                message: "Reply sent successfully",
                reply: replyMessage,
            },
            { status: 201 }
        );
        
    } catch (error) {
        console.error("Error sending reply:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
