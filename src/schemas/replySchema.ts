import { z } from "zod";

export const replySchema = z.object({
    conversationId: z.string().min(1, "Conversation ID is required"),
    replyContent: z
        .string()
        .min(2, "Reply must be at least 2 characters long")
        .max(200, "Reply must be less than 200 characters long"),
});

