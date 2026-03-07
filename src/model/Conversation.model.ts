import mongoose, { Document, Schema } from "mongoose";

export interface Conversation extends Document {
  receiverId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<Conversation>(
  {
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Useful to track if there are new replies
  },
  
  { timestamps: true }
);

const ConversationModel =
  (mongoose.models.Conversation as mongoose.Model<Conversation>) ||
  mongoose.model<Conversation>("Conversation", conversationSchema);

export default ConversationModel;
