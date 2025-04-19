import { Elysia } from "elysia";
import { db } from "../db/connectDb";
import { bookSchema } from "../schemas/bookSchema";
import { books } from "../models/book";
import { notes } from "../models/note";
import { eq } from "drizzle-orm";

type BookRequestBody = typeof bookSchema._output;
type Book = {
  id: string;
  title: string;
  author: string;
  status: "not_started" | "in_progress" | "finished";
  createdAt: Date;
};

type SuccessResponse<T> = { success: true; data: T };
type ErrorResponse = { success: false; error: string };

export const bookRoutes = new Elysia({ prefix: "/books" })
  .get("/", async ({ set }) => {
    try {
      const allBooks = await db.select().from(books);
      console.log("Fetched books:", allBooks);
      return { success: true, data: allBooks } as SuccessResponse<Book[]>;
    } catch (error) {
      console.error("Error fetching books:", error);
      set.status = 500;
      return {
        success: false,
        error: "Failed to fetch books",
      } as ErrorResponse;
    }
  })
  .post("/", async ({ body, set }) => {
    const parse = bookSchema.safeParse(body);
    if (!parse.success) {
      set.status = 400;
      return { error: parse.error.errors };
    }

    const newBookData: BookRequestBody = parse.data;

    try {
      const newBook = await db
        .insert(books)
        .values({
          title: newBookData.title,
          author: newBookData.author,
          status: newBookData.status,
        })
        .returning();

      if (newBook.length > 0) {
        const book: Book = newBook[0] as Book;

        return { success: true, data: book } as SuccessResponse<Book>;
      }
    } catch (error) {
      console.error("Database insert error:", error);
      set.status = 500;
      return {
        success: false,
        error: "Failed to insert the book into the database",
      } as ErrorResponse;
    }
  })
  .get("/:id", async ({ params, set }) => {
    const bookId: string = params.id;
    try {
      const book: Book[] = await db
        .select()
        .from(books)
        .where(eq(books.id, bookId));

      if (!book.length) {
        set.status = 404;
        return { success: false, error: "Book not found" } as ErrorResponse;
      }

      return { success: true, data: book[0] } as SuccessResponse<Book>;
    } catch (error) {
      console.error("Error fetching book by ID:", error);
      set.status = 500;
      return { success: false, error: "Failed to fetch book" } as ErrorResponse;
    }
  })
  .put("/:id", async ({ params, body, set }) => {
    try {
      const parse = bookSchema.safeParse(body);

      if (!parse.success) {
        set.status = 400;
        return { error: parse.error.errors };
      }

      const updatedBook = await db
        .update(books)
        .set({
          title: parse.data.title,
          author: parse.data.author,
          status: parse.data.status,
        })
        .where(eq(books.id, params.id))
        .returning();

      if (!updatedBook.length) {
        set.status = 404;
        return { success: false, error: "Book not found" } as ErrorResponse;
      }

      const book: Book = updatedBook[0] as Book;
      return { success: true, data: book } as SuccessResponse<Book>;
    } catch (error) {
      console.error("Error updating book:", error);
      set.status = 500;
      return {
        success: false,
        error: "Failed to update book",
      } as ErrorResponse;
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
        return {
          success: false,
          error: "Book not found for deletion",
        } as ErrorResponse;
      }

      return {
        success: true,
        data: { message: "Book and all its notes deleted successfully" },
      } as SuccessResponse<{ message: string }>;
    } catch (error) {
      console.error("Error during book deletion:", error);
      set.status = 500;
      return {
        success: false,
        error: "Failed to delete book and notes.",
      } as ErrorResponse;
    }
  });
