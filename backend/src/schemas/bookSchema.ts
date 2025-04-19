import { z } from 'zod';

export const bookSchema = z.object({
    title: z.string().min(1).max(300),
    author: z.string().min(1).max(30),
    status: z.enum(['not_started', 'in_progress', 'finished']),
    createdAt: z.date().optional() // auto generated at creation
});
