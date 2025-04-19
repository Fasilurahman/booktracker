import axios from "axios";
import { Book, Note } from "../types/types";
import { BookPayload } from "../schema/bookSchema";

let notes: Note[] = [];

// Book API
export const getBooks = async (): Promise<Book[]> => {
  const response = await axios.get("http://localhost:3000/api/books");
  return response.data;
};

export const getBook = async (id: string): Promise<Book | undefined> => {
  const response = await axios.get(`http://localhost:3000/api/books/${id}`);
  return response.data;
};

export const addBook = async (book: BookPayload): Promise<Book> => {
  console.log("Adding book:", book);
  const response = await axios.post("http://localhost:3000/api/books", book);
  return response.data;
};

export const updateBook = async (
  id: string,
  book: Partial<Book>
): Promise<Book | undefined> => {
  const response = await axios.put(
    `http://localhost:3000/api/books/${id}`,
    book
  );
  console.log("Updated book:", response.data);
  return response.data;
};

export const getNotes = async (bookId: string): Promise<Note[]> => {
  const response = await axios.get(
    `http://localhost:3000/api/books/${bookId}/notes`
  );
  console.log("Fetched notes:", response.data);
  return response.data;
};

export const addNote = async (
  note: Omit<Note, "id" | "createdAt">
): Promise<Note> => {
  console.log("Adding note:", note);
  const response = await axios.post(
    `http://localhost:3000/api/books/${note.bookId}/notes`,
    {
      content: note.content,
    }
  );
  console.log("Added note:", response.data);
  return response.data;
};


export const deleteBook = async (id: string): Promise<void> => {
    try {
      await axios.delete(`http://localhost:3000/api/books/${id}`);
      console.log("Deleted book with ID:", id);
    } catch (error) {
      console.error("Error deleting book:", error);
      throw error; 
    }
};
