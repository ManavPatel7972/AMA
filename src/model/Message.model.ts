import mongoose, { Document, Schema } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
  conversationId?: mongoose.Types.ObjectId;
  senderToken?: string;
  type: "message" | "reply";
  receiverId?: mongoose.Types.ObjectId;
}

const messageSchema = new Schema<Message>(
  {
    content: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
    },

    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },

    senderToken: {
      type: String, // Used for verifying anonymous sender's access to replies
    },

    type: {
      type: String,
      enum: ["message", "reply"],
      default: "message",
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

  },
  { timestamps: true },
);

const MessageModel =
  (mongoose.models.Message as mongoose.Model<Message>) ||
  mongoose.model<Message>("Message", messageSchema);

export default MessageModel;
