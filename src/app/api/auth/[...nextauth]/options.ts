import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";


export const authOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    //google login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    //credential login
    CredentialsProvider({
      name: "credentials",

      credentials: {
        //identifier => username or email
        identifier: {},
        password: {},
      },

      async authorize(credentials: any): Promise<any> {
        await connectDB();

        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials?.identifier },
              { username: credentials?.identifier },
            ],
          });

          if (!user) {
            throw new Error("No User found with this credentials");
          }

          if (user.authProvider === "google") {
            throw new Error("Please Login using Google");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account before logging in");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials?.password,
            user.password,
          );

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect password");
          }
        } catch (error: any) {
          console.log("Error While Login with Credentials: ", error);

          throw new Error(error.message);
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // Run only for Google login
      if (account?.provider === "google") {
        await connectDB();

        const existingUser = await UserModel.findOne({
          email: user.email,
        });

        //If user already exists -> allow login
        if (existingUser) {
          return true;
        }

        //Create new Google user
        await UserModel.create({
          email: user.email,
          username: user.email?.split("@")[0],
          isVerified: true,
          authProvider: "oauth",
          isAcceptingMessages: true,
        });
      }

      return true;
    },

    // jwt token add
    // async jwt({ token, user, account }) {
    //   if (user) {
    //     token._id = user._id?.toString(); // Convert ObjectId to string
    //     token.isVerified = user.isVerified;
    //     token.isAcceptingMessages = user.isAcceptingMessages;
    //     token.username = user.username;
    //   }
    //   return token;
    // },

    async jwt({ token, user, account }) {
      await connectDB();

      // First time login (Google or Credentials)
      // because account is only available in first time login
      if (account) {
        // console.log("JWT token - account ===>", token);

        // console.log("JWT callback - account ===>", account);
        // console.log("JWT callback - user ===>", user);

        // fetch user for adding more properties to token
        const dbUser = await UserModel.findOne({
          email: token.email,
        });

        // console.log("JWT callback - dbUser ===>", dbUser);

        if (dbUser) {
          token._id = dbUser._id.toString();
          token.isVerified = dbUser.isVerified;
          token.isAcceptingMessages = dbUser.isAcceptingMessages;
          token.username = dbUser.username;
          token.sessionVersion = dbUser.sessionVersion;
        }
      }

      // this will run in every request
      //! for devloper froce logout, when any security related issue happen, increase the sessionVersion in database, then all existing token with old sessionVersion will be invalid
      if (token._id) {
        const dbUser = await UserModel.findById(token._id);

        if (!dbUser || dbUser.sessionVersion !== token.sessionVersion) {
          token.isVerified = false; // Mark token as invalid
          return null; // Force sign out by returning null token
        }
      }

      return token;
    },

    // session add
    async session({ session, token }) {
      // console.log("Session callback - session ===>", session);
      // console.log("Session callback - token ===>", token);
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
        session.user.sessionVersion = token.sessionVersion;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/sign-in",
  },
};
