// import "next-auth";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       _id?: string;
//       isVerified?: boolean;
//       isAcceptingMessages?: boolean;
//       username?: string;
//     } & DefaultSession["user"];
//   }

//   interface User {
//     _id?: string;
//     isVerified?: boolean;
//     isAcceptingMessages?: boolean;
//     username?: string;
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     _id?: string;
//     isVerified?: boolean;
//     isAcceptingMessages?: boolean;
//     username?: string;
//   }
// }

import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    _id: string;
    username: string;
    isVerified: boolean;
    isAcceptingMessages: boolean;
  }

  interface Session {
    user: {
      _id: string;
      username: string;
      isVerified: boolean;
      isAcceptingMessages: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id: string;
    username: string;
    isVerified: boolean;
    isAcceptingMessages: boolean;
  }
}
