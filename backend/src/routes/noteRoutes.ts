import { Elysia } from "elysia";
import { db } from "../db/connectDb";
import { notes } from "../models/note";
import { noteSchema } from "../schemas/noteSchema";
import { eq } from "drizzle-orm";

type NoteRequestBody = typeof noteSchema._output;
type Note = { id: string; bookId: string; content: string };

type SuccessResponse<T> = { success: true; data: T };
type ErrorResponse = { success: false; error: string };

export const noteRoutes = new Elysia()
  .get("/books/:id/notes", async ({ params, set }) => {
    try {
      const allNotes = await db
        .select()
        .from(notes)
        .where(eq(notes.bookId, params.id));

      if (allNotes.length === 0) {
        set.status = 404;
        return {
          success: false,
          error: "No notes found for this book",
        } as ErrorResponse;
      }

      return { success: true, data: allNotes } as SuccessResponse<Note[]>;
    } catch (error) {
      console.error("Error fetching notes:", error);
      set.status = 500;
      return {
        success: false,
        error: "Failed to fetch notes",
      } as ErrorResponse;
    }
  })
  .post("/books/:bookId/notes", async ({ params, body, set }) => {
    try {
      const parse = noteSchema.safeParse(body);

      if (!parse.success) {
        set.status = 400;
        return { error: parse.error.errors };
      }

      const newNote = await db
        .insert(notes)
        .values({
          bookId: params.bookId,
          content: parse.data.content,
        })
        .returning();

      const note: Note = newNote[0] as Note;
      return { success: true, data: note } as SuccessResponse<Note>;
    } catch (error) {
      console.error("Error creating note:", error);
      set.status = 500;
      return {
        success: false,
        error: "Failed to create note",
      } as ErrorResponse;
    }
  });
