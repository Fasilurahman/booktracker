export interface Book  {
    id: string;
    title: string;
    author: string;
    status: "not_started" | "in_progress" | "finished";
    coverImage?: string;
    createdAt: Date;
    rating?: number;
    progress?: number;
    notes?: string;
  }
  
  export interface Note {
    id: string;
    bookId: string;
    content: string;
    createdAt: Date;
  }