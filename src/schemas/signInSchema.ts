import { z } from "zod";

export const signInSchema = z.object({
  //!Here identifier because it can be either email or username
  identifier: z.string(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

