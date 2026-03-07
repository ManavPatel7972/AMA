import mongoose from "mongoose";

const MONGO_URL = `${process.env.MONGO_URL}/AMA`;

type ConnectionObj = {
  isConnected?: number;
};

const connectionInstance: ConnectionObj = {};

export const connectDB = async (): Promise<void> => {
  if (connectionInstance.isConnected) {
    console.log("MongoDB already connected:");
    return;
  }

  try {
    const db = await mongoose.connect(MONGO_URL || "", {});
    // console.log("db ==", db);
    // console.log("db.connections ==", db.connections);

    connectionInstance.isConnected = db.connections[0].readyState;

    console.log("MongoDB connected:", db.connection.host);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
