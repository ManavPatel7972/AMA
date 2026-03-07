import mongoose, { Document, Schema } from "mongoose";
import { Message } from "./Message.model";

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: Array<mongoose.Types.ObjectId | Message>;
  authProvider?: string;
  sessionVersion: number;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
}

const userSchema = new Schema<User>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
        "Invalid email format",
      ],
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters long"],
    },


    verifyCode: String,

    verifyCodeExpiry: Date,

    isVerified: {
      type: Boolean,
      default: false,
    },

    isAcceptingMessages: {
      type: Boolean,
      default: true,
    },

    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],

    authProvider: {
      type: String,
      enum: ["local", "oauth"],
      default: "local",
    },

    //for session force logout by devloper, when user change password or other security related settings,increase the sessionVersion to invalidate all existing sessions
    sessionVersion: {
      type: Number,
      default: 0,
    },

    // for forgot password
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true },
);

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);

export default UserModel;
