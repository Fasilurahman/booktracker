import type React from "react"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { formatDistance } from "date-fns"
import type { Book, Note } from "../types/types"
import { getBook, getNotes } from "../services/api"
import { EditBookModal } from "../components/EditBookModal"
import { AddNoteModal } from "../components/AddNoteModal"
import {
  Edit,
  Plus,
  BookOpen,
  Calendar,
  Clock,
  Star,
  ChevronDown,
  ChevronUp,
  BookmarkIcon,
  Quote,
  Award,
  Bookmark,
} from "lucide-react"

export const BookDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [book, setBook] = useState<Book | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false)
  const [showAllNotes, setShowAllNotes] = useState(false)
  const [activeTab, setActiveTab] = useState<"notes" | "details">("notes")
  const [isPageLoaded, setIsPageLoaded] = useState(false)

  useEffect(() => {
    if (id) {
      loadBook()
      loadNotes()
    }

    // Trigger entrance animations after a short delay
    setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)
  }, [id])

  const loadBook = async () => {
    if (id) {
      const fetchedBook = await getBook(id)
      if (fetchedBook) setBook(fetchedBook)
    }
  }

  const loadNotes = async () => {
    if (id) {
      const fetchedNotes = await getNotes(id)
      setNotes(fetchedNotes)
    }
  }

  const handleBookUpdated = async () => {
    await loadBook()
    setIsEditModalOpen(false)
  }

  const handleNoteAdded = async () => {
    await loadNotes()
    setIsAddNoteModalOpen(false)
  }

  // Calculate reading progress (random for demo if not provided)
  const progress =
    book?.progress ||
    (book?.status === "in_progress" ? Math.floor(Math.random() * 80) + 10 : book?.status === "finished" ? 100 : 0)

  const coverImage = '/toa-heftiba-ip9R11FMbV8-unsplash.jpg'

  const rating = book?.rating || Math.floor(Math.random() * 5) + 1

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-indigo-200 rounded-full mb-4 flex items-center justify-center">
            <BookOpen className="text-indigo-500 opacity-50" size={24} />
          </div>
          <div className="text-indigo-400 font-medium">Loading book details...</div>
        </div>
      </div>
    )
  }

  const statusConfig = {
    not_started: {
      color: "bg-slate-100 text-slate-800 border-slate-200",
      icon: <BookmarkIcon className="text-slate-600" size={16} />,
      label: "Not Started",
    },
    in_progress: {
      color: "bg-indigo-100 text-indigo-800 border-indigo-200",
      icon: <BookOpen className="text-indigo-600" size={16} />,
      label: "In Progress",
    },
    finished: {
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      icon: <Award className="text-emerald-600" size={16} />,
      label: "Finished",
    },
  }

  const visibleNotes = showAllNotes ? notes : notes.slice(0, 3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12">
      <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity ${
      isEditModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}></div>
      <div
        className={`container mx-auto px-4 max-w-5xl transition-all duration-700 ease-out ${
          isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Book Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="relative h-64 bg-gradient-to-r from-indigo-600 to-purple-600 overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#pattern)" />
              </svg>
              <defs>
                <pattern id="pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="5" cy="5" r="1.5" fill="white" />
                </pattern>
              </defs>
            </div>

            {/* Edit button */}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm text-white rounded-full p-2.5 hover:bg-white/30 transition-all duration-200 z-10 shadow-lg"
              aria-label="Edit book"
            >
              <Edit size={18} />
            </button>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Book cover */}
            <div className="md:w-1/4 px-8 -mt-32 relative z-10 flex justify-center md:block">
              <div className="w-48 h-64 rounded-lg overflow-hidden shadow-2xl transform transition-transform duration-500 hover:scale-105">
                <img src={coverImage || "/placeholder.svg"} alt={book.title} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Book details */}
            <div className="md:w-3/4 p-8 pt-4 md:pt-8">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${statusConfig[book.status].color}`}
                >
                  {statusConfig[book.status].icon}
                  {statusConfig[book.status].label}
                </span>
                <span className="text-sm text-gray-500 flex items-center gap-1.5">
                  <Calendar size={14} />
                  Added {formatDistance(new Date(book.createdAt), new Date(), { addSuffix: true })}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">{book.title}</h1>
              <p className="text-xl text-gray-600 mb-6">by {book.author}</p>

              {/* Rating stars */}
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className={i < rating ? "text-amber-400 fill-amber-400" : "text-gray-300"} />
                ))}
                <span className="text-sm text-gray-600 ml-2">({rating}.0)</span>
              </div>

              {/* Reading progress */}
              {book.status !== "not_started" && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span className="font-medium">Reading Progress</span>
                    <span className="font-semibold">{progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        book.status === "finished" ? "bg-emerald-500" : "bg-indigo-500"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
              <p className="text-gray-600 mb-4">
                
                  "A captivating journey through the author's perspective, this book offers insights and stories that will keep you engaged from beginning to end."
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === "notes"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("notes")}
          >
            Notes
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === "details"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
        </div>

        {/* Notes Section */}
        {activeTab === "notes" && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Quote size={24} className="text-indigo-500" />
                Notes & Highlights
              </h2>
              <button
                onClick={() => setIsAddNoteModalOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
              >
                <Plus size={18} />
                Add Note
              </button>
            </div>

            <div className="space-y-6">
              {visibleNotes.map((note, index) => (
                <div
                  key={note.id}
                  className={`bg-gray-50 rounded-xl p-6 border-l-4 border-indigo-400 shadow-sm hover:shadow-md transition-shadow duration-300 transform transition-transform hover:-translate-y-1 ${
                    isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-indigo-100 rounded-full p-2.5 text-indigo-600">
                      <Bookmark size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 whitespace-pre-wrap text-lg">{note.content}</p>
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-gray-500 flex items-center gap-1.5">
                          <Clock size={14} />
                          {formatDistance(new Date(note.createdAt), new Date(), { addSuffix: true })}
                        </p>
                     
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {notes.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Quote className="text-indigo-500" size={24} />
                  </div>
                  <p className="text-gray-600 mb-6">No notes yet. Add your first note!</p>
                  <button
                    onClick={() => setIsAddNoteModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Plus size={18} />
                    Add Your First Note
                  </button>
                </div>
              )}

              {notes.length > 3 && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => setShowAllNotes(!showAllNotes)}
                    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    {showAllNotes ? (
                      <>
                        Show Less <ChevronUp size={18} />
                      </>
                    ) : (
                      <>
                        Show All Notes ({notes.length}) <ChevronDown size={18} />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Details Tab Content */}
        {activeTab === "details" && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary</h3>
                <p className="text-gray-600">  
                    "This compelling book takes readers on a journey through fascinating concepts and ideas. The author's unique perspective provides valuable insights that will keep you engaged from start to finish."
                </p>

              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Reading Stats</h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Status</span>
                      <span className="font-medium text-gray-900">{statusConfig[book.status].label}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          book.status === "not_started"
                            ? "bg-slate-400 w-[5%]"
                            : book.status === "in_progress"
                              ? "bg-indigo-500"
                              : "bg-emerald-500 w-full"
                        }`}
                        style={{
                          width: book.status === "in_progress" ? `${progress}%` : undefined,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Total Notes</span>
                    <span className="font-medium text-gray-900">{notes.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <EditBookModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onBookUpdated={handleBookUpdated}
          book={book}
        />

        <AddNoteModal
          isOpen={isAddNoteModalOpen}
          onClose={() => setIsAddNoteModalOpen(false)}
          onNoteAdded={handleNoteAdded}
          bookId={book.id}
        />
    </div>
  )
}
