import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from 'uuid'; 

export const books = pgTable('books', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv4()), 
    title: varchar('title', { length: 300 }).notNull(),
    author: varchar('author', { length: 30 }).notNull(),
    status: varchar('status', { enum: [ 'not_started', 'in_progress', 'finished' ] }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})