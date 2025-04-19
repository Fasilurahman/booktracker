import { pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';
import { v4 as uuidv4 } from 'uuid'; 

export const notes = pgTable('notes', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv4()), 
    bookId: varchar('book_id', { length: 36 }).notNull().references(() => books.id),
    content: varchar('content', { length: 500 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
})

import { books } from './book'