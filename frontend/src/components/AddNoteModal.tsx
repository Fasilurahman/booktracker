"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Modal } from "./Modal"
import { addNote } from "../services/api"
import { BookOpen, Quote, Hash, Calendar, Check } from "lucide-react"
import { b } from "framer-motion/client"
import { Note } from "../types/types"
import { noteSchema } from "../schema/noteSchema"

interface AddNoteModalProps {
  isOpen: boolean
  onClose: () => void
  onNoteAdded: () => void
  bookId: string
}

export const AddNoteModal: React.FC<AddNoteModalProps> = ({ isOpen, onClose, onNoteAdded, bookId }) => {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [animateSuccess, setAnimateSuccess] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [error, setError] = useState<string | null>(null);
  const [ notes, setNotes ] = useState<Note[]>([]);
  // Focus textarea when modal opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null);

    try {
      console.log(bookId, content, 'book id and conttent')

      const result = noteSchema.safeParse({
        bookId,
        content,
      });
  
      if (!result.success) {
        console.error("Validation errors:", result.error.flatten().fieldErrors);
        const contentError = result.error.flatten().fieldErrors.content?.[0];
        setError(contentError || "Invalid input");
        setIsSubmitting(false);
        return;
      }
      const newNote = await addNote({
        bookId,
        content,
  
      })
      setNotes((prev: Note[]) => [...prev, newNote])

      // Show success animation
      setAnimateSuccess(true)
      setTimeout(() => {
        onNoteAdded()
        setContent("")
        setIsSubmitting(false)
        setAnimateSuccess(false)
      }, 1000)
    } catch (error) {
      setIsSubmitting(false)
      console.error("Error adding note:", error)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="relative">
        {/* Header with icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
            <Quote className="h-8 w-8 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Add New Note</h3>
          <p className="text-gray-500 mt-1">Capture your thoughts and insights</p>
        </div>

        {animateSuccess ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10 rounded-lg transition-opacity duration-300">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                <Check className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">Note Added!</h3>
            </div>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Main note content */}
          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <Quote size={16} className="text-indigo-500" />
              Note Content
            </label>
            <div className="relative">
              <textarea
                ref={textareaRef}
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                placeholder="Write your thoughts, quotes, or insights about the book..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-700 placeholder-gray-400 bg-white shadow-sm"
                
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400">{content.length} characters</div>
              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>
          </div>
          

          {/* Date added - auto-generated */}
          <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={16} className="text-gray-400" />
            <span>Date: {new Date().toLocaleDateString()}</span>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-gray-700 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium shadow-sm hover:shadow flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Adding...</span>
                </>
              ) : (
                <>Add Note</>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
