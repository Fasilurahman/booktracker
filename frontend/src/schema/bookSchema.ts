import { z } from 'zod';

export const bookSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  author: z.string().min(1, { message: "Author is required" }),
  status: z.enum(["not_started" , "in_progress" , "finished"], {
    errorMap: () => ({ message: "Please select a valid status" }),
  }),
  coverImage: z.string().optional(),
});

export type BookFormValues = z.infer<typeof bookSchema>;
export type BookPayload = BookFormValues;