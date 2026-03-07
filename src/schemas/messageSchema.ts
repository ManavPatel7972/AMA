import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(7, "Message must be at least 7 characters long")
    .max(200, "Message must be less than 200 characters long")
});
