import NextAuth from "next-auth";
import { authOptions } from "./options";

const handler = NextAuth(authOptions);

// next-auth required both GET and POST method for internal working
export { handler as GET, handler as POST };
