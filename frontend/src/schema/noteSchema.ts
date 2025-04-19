import { z } from "zod";

export const noteSchema = z.object({
  bookId: z.string().uuid({ message: "Invalid book ID" }),
  content: z.string().min(4, { message: "Content is required minimum 4 characters" }),
});
