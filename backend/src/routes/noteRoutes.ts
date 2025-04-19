import { Elysia } from "elysia";
import { db } from "../db/connectDb";
import { notes } from "../models/note";
import { noteSchema } from "../schemas/noteSchema";
import { eq } from "drizzle-orm";

export const noteRoutes = new Elysia()
  .get("/books/:id/notes", async ({ params, set }) => {
    try {
      console.log("params", params);
      const allNotes = await db
        .select()
        .from(notes)
        .where(eq(notes.bookId, params.id));
      console.log("allNotes", allNotes);

      if (allNotes.length === 0) {
        set.status = 404;
        return { error: "No notes found for this book" };
      }

      return allNotes;
    } catch (error) {
      console.error("Error fetching notes:", error);
      set.status = 500;
      return { error: "Failed to fetch notes" };
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

      return newNote[0];
    } catch (error) {
      console.error("Error creating note:", error);
      set.status = 500;
      return { error: "Failed to create note" };
    }
  });
