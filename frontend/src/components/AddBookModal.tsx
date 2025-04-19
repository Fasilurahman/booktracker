import type React from "react"
import { useState } from "react"
import { Modal } from "./Modal"
import { addBook } from "../services/api"
import { BookOpen, User, Bookmark,  Loader2 } from "lucide-react"
import { Book } from "../types/types"
import {  bookSchema } from "../schema/bookSchema"
import { z } from "zod"

interface AddBookModalProps {
  isOpen: boolean
  onClose: () => void
  onBookAdded: () => void
}

export const AddBookModal: React.FC<AddBookModalProps> = ({ isOpen, onClose, onBookAdded }) => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [status, setStatus] = useState("not_started")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ title?: string; author?: string }>({})
  const [books, setBooks] = useState<Book[]>([]);


  // Component.tsx
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const validated = bookSchema.parse({
        title: title.trim(),
        author: author.trim(),
        status,
      });
  
      setIsSubmitting(true);
      console.log("Validated data:", validated);

      const newBook = await addBook(validated);
  
      setBooks((prev: Book[]) => [...prev, newBook]);
      
      onBookAdded();
      resetForm();
      onClose();
  
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors as any);
      } else {
        console.error("Failed to add book:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  const resetForm = () => {
    setTitle("")
    setAuthor("")
    setStatus("not_started")
    setErrors({})
  }

  const statusOptions = [
    { value: "not_started", label: "Not Started", icon: <Bookmark className="text-amber-500" size={18} /> },
    { value: "in_progress", label: "In Progress", icon: <BookOpen className="text-purple-500" size={18} /> },
    { value: "finished", label: "Finished", icon: <Bookmark className="text-emerald-500" size={18} /> },
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Book" >
      <form onSubmit={handleSubmit} className="space-y-5">
        

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Book Title
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BookOpen className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (errors.title) setErrors({ ...errors, title: undefined })
                }}
                className={`w-full pl-10 pr-3 py-3 border ${errors.title ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"} rounded-lg focus:outline-none focus:ring-2 transition-colors`}
                placeholder="Enter book title"
                disabled={isSubmitting}
              />
            </div>
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="author"
                value={author}
                onChange={(e) => {
                  setAuthor(e.target.value)
                  if (errors.author) setErrors({ ...errors, author: undefined })
                }}
                className={`w-full pl-10 pr-3 py-3 border ${errors.author ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"} rounded-lg focus:outline-none focus:ring-2 transition-colors`}
                placeholder="Enter author name"
                disabled={isSubmitting}
              />
            </div>
            {errors.author && <p className="mt-1 text-sm text-red-600">{errors.author}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reading Status</label>
            <div className="grid grid-cols-3 gap-3">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStatus(option.value)}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border-2 transition-all ${
                    status === option.value
                      ? "border-purple-500 bg-purple-50 text-purple-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                  disabled={isSubmitting}
                >
                  {option.icon}
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => {
              resetForm()
              onClose()
            }}
            className="px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-70 flex items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <span>Add Book</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}
