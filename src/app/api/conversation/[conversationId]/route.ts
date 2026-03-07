import { connectDB } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import MessageModel from "@/model/Message.model";
import ConversationModel from "@/model/Conversation.model";

export async function GET(
    req: Request,
    { params }: { params: { conversationId: string } }
) {
    await connectDB();

    try {
        const { conversationId } = await params;

        if (!conversationId) {
            return NextResponse.json(
                { success: false, message: "Conversation ID is required" },
                { status: 400 }
            );
        }

        // A valid senderToken must be provided in the query params to view the conversation
        const { searchParams } = new URL(req.url);
        const senderToken = searchParams.get("token");

        if (!senderToken) {
            return NextResponse.json(
                { success: false, message: "Sender token is required to view this conversation" },
                { status: 401 }
            );
        }

        const conversation = await ConversationModel.findById(conversationId);
        if (!conversation) {
            return NextResponse.json(
                { success: false, message: "Conversation not found" },
                { status: 404 }
            );
        }

        // Fetch all messages in this conversation
        const messages = await MessageModel.find({
            conversationId: conversation._id,
        }).sort({ createdAt: 1 }); // Oldest first (original message, then replies)

        if (messages.length === 0) {
            return NextResponse.json(
                { success: false, message: "No messages found" },
                { status: 404 }
            );
        }

        // Validate the token against the original message's senderToken
        const originalMessage = messages.find((m) => m.type === "message");

        if (!originalMessage || originalMessage.senderToken !== senderToken) {
            return NextResponse.json(
                { success: false, message: "Invalid sender token" },
                { status: 403 }
            );
        }

        // Strip senderToken from the response to be safe
        const safeMessages = messages.map((m) => ({
            _id: m._id,
            content: m.content,
            createdAt: m.createdAt,
            type: m.type,
            conversationId: m.conversationId,
        }));

        return NextResponse.json(
            {
                success: true,
                messages: safeMessages,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching conversation:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
