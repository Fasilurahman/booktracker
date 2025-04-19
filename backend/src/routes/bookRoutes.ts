import { Elysia } from "elysia";
import { db } from "../db/connectDb";
import { bookSchema } from "../schemas/bookSchema";
import { books } from "../models/book";
import { notes } from "../models/note";
import { eq } from "drizzle-orm";

export const bookRoutes = new Elysia({ prefix: "/books" })
  .get("/", async ({ set }) => {
    try {
      const allBooks = await db.select().from(books);
      return allBooks;
    } catch (error) {
      console.error("Error fetching books:", error);
      set.status = 500;
      return { error: "Failed to fetch books" };
    }
  })
  .post("/", async ({ body, set }) => {
    const parse = bookSchema.safeParse(body);
    if (!parse.success) {
      set.status = 400;
      return { error: parse.error.errors };
    }

    console.log("parse", parse.data);

    try {
      const newBook = await db
        .insert(books)
        .values({
          title: parse.data.title,
          author: parse.data.author,
          status: parse.data.status,
        })
        .returning();

      return newBook[0];
    } catch (error) {
      console.error("Database insert error:", error);
      set.status = 500;
      return { error: "Failed to insert the book into the database" };
    }
  })
  .get('/:id', async ({ params, set }) => {
    try {
      const book = await db.select().from(books).where(eq(books.id, params.id));

      if (!book.length) {
        set.status = 404;
        return { error: 'Book not found' };
      }

      return book[0];
    } catch (error) {
      console.error('Error fetching book by ID:', error);
      set.status = 500;
      return { error: 'Failed to fetch book' };
    }
  })
  .put('/:id', async ({ params, body, set }) => {
    try {
      const parse = bookSchema.safeParse(body);

      if (!parse.success) {
        set.status = 400;
        return { error: parse.error.errors };
      }

      const updatedBook = await db.update(books)
        .set({
          title: parse.data.title,
          author: parse.data.author,
          status: parse.data.status
        })
        .where(eq(books.id, params.id))
        .returning();

      if (!updatedBook.length) {
        set.status = 404;
        return { error: 'Book not found' };
      }

      return updatedBook[0];
    } catch (error) {
      console.error('Error updating book:', error);
      set.status = 500;
      return { error: 'Failed to update book' };
    }
  })
  .delete("/:id", async ({ params, set }) => {
    try {
      await db.delete(notes).where(eq(notes.bookId, params.id));

      const deleted = await db
        .delete(books)
        .where(eq(books.id, params.id))
        .returning();

      if (!deleted.length) {
        set.status = 404;
        return { error: "Book not found for deletion" };
      }

      return { message: "Book and all its notes deleted successfully" };
    } catch (error) {
      console.error("Error during book deletion:", error);
      set.status = 500;
      return { error: "Failed to delete book and notes." };
    }
  });
