import { z } from "zod";

export const verifySchema = z.object({
  code: z.string().length(6, "verification Code must be 6 characters long"),
});
