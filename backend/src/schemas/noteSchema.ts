import { z } from 'zod';

export const noteSchema = z.object({ 
    content: z.string().min(1).max(500),
    createdAt: z.date().optional()
});
