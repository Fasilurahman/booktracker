import type React from "react"
import { useState, useEffect } from "react"
import {
  Plus,
  Search,
  BookOpen,
  SlidersHorizontal,
  BookMarked,
  BookText,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  ChevronDown,
} from "lucide-react"
import type { Book } from "../types/types"
import { getBooks } from "../services/api"
import { BookCard } from "../components/BookCard"
import { AddBookModal } from "../components/AddBookModal"
import { motion, AnimatePresence } from "framer-motion"

export const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadBooks()
  }, [])

  const loadBooks = async () => {
    setIsLoading(true)
    try {
      console.log("Fetching books...")
      const fetchedBooks = await getBooks()
      setBooks(fetchedBooks)
    } catch (error) {
      console.error("Failed to load books:", error)
    } finally {
      // Simulate a slight delay to show loading state
      setTimeout(() => {
        setIsLoading(false)
      }, 800)
    }
  }

  const handleDeleteBook = (bookId: string) => {
    setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
  };

  const handleBookAdded = async () => {
    await loadBooks()
    setIsAddModalOpen(false)
  }

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())

    if (!activeFilter) return matchesSearch
    return matchesSearch && book.status === activeFilter
  })

  const bookCountByStatus = {
    all: books.length,
    not_started: books.filter((book) => book.status === "not_started").length,
    in_progress: books.filter((book) => book.status === "in_progress").length,
    finished: books.filter((book) => book.status === "finished").length,
  }

  const filterOptions = [
    { id: null, label: "All Books", icon: BookOpen, count: bookCountByStatus.all },
    { id: "not_started", label: "Not Started", icon: BookMarked, count: bookCountByStatus.not_started },
    { id: "in_progress", label: "In Progress", icon: BookText, count: bookCountByStatus.in_progress },
    { id: "finished", label: "Finished", icon: CheckCircle2, count: bookCountByStatus.finished },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="relative container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <BookOpen className="text-white" size={20} />
                </div>
                <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                  My Collection
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 mb-3">
                Personal Library
              </h1>
              <p className="text-gray-600 text-lg max-w-xl">
                Track your reading journey, discover new books, and manage your collection in one place.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-[0_8px_30px_rgb(125,98,234,0.3)]"
            >
              <Plus size={20} />
              Add New Book
            </motion.button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {[
              {
                label: "Total Books",
                value: bookCountByStatus.all,
                icon: BookOpen,
                color: "from-blue-500 to-cyan-400",
              },
              {
                label: "Not Started",
                value: bookCountByStatus.not_started,
                icon: BookMarked,
                color: "from-amber-500 to-orange-400",
              },
              {
                label: "In Progress",
                value: bookCountByStatus.in_progress,
                icon: Clock,
                color: "from-purple-500 to-pink-400",
              },
              {
                label: "Finished",
                value: bookCountByStatus.finished,
                icon: CheckCircle2,
                color: "from-emerald-500 to-teal-400",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                className="bg-white rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 relative overflow-hidden group"
              >
                <div
                  className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${stat.color} opacity-10 rounded-bl-full transition-all duration-300 group-hover:scale-110`}
                ></div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                    <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm`}
                  >
                    <stat.icon className="text-white" size={18} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-10"
        >
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-6 border border-gray-100 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-indigo-400"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-bl from-purple-200 to-indigo-200 rounded-full opacity-20"></div>

            <div className="flex flex-col md:flex-row gap-5 items-start md:items-center justify-between relative">
              {/* Search Input */}
              <div className="relative flex-1 w-full group">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 group-focus-within:text-purple-600 transition-colors duration-300"
                  size={22}
                />

                <input
                  type="text"
                  placeholder="Search by title, author, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-purple-300 focus:bg-white shadow-sm transition-all duration-300 placeholder:text-gray-400 text-gray-700"
                />

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Filter Button */}
              <div className="w-full md:w-auto">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center justify-between gap-2 px-5 py-4 w-full md:w-auto bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={18} />
                    <span className="font-medium">Filter Books</span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 ${isFilterOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            </div>

            {/* Filter Options */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-gray-100">
                    {filterOptions.map((option) => (
                      <button
                        key={option.id?.toString() || "all"}
                        onClick={() => setActiveFilter(option.id)}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          activeFilter === option.id
                            ? "border-purple-500 bg-purple-50 text-purple-700"
                            : "border-gray-200 hover:border-gray-300 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <option.icon
                            size={18}
                            className={activeFilter === option.id ? "text-purple-600" : "text-gray-500"}
                          />
                          <span className="font-medium">{option.label}</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            activeFilter === option.id ? "bg-purple-200 text-purple-800" : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {option.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Books Grid */}
        <div className="relative">
          {/* Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-md animate-pulse h-64">
                  <div className="flex gap-4">
                    <div className="w-24 h-36 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Results Count */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6 flex items-center justify-between"
              >
                <div className="text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{filteredBooks.length}</span>{" "}
                  {filteredBooks.length === 1 ? "book" : "books"}
                  {activeFilter && (
                    <span>
                      {" "}
                      in{" "}
                      <span className="font-semibold text-purple-600">
                        {filterOptions.find((option) => option.id === activeFilter)?.label}
                      </span>
                    </span>
                  )}
                  {searchQuery && (
                    <span>
                      {" "}
                      matching <span className="font-semibold text-purple-600">"{searchQuery}"</span>
                    </span>
                  )}
                </div>

                {(activeFilter || searchQuery) && (
                  <button
                    onClick={() => {
                      setActiveFilter(null)
                      setSearchQuery("")
                    }}
                    className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
                  >
                    <X size={14} />
                    Clear filters
                  </button>
                )}
              </motion.div>

              {/* Books Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredBooks.map((book, index) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <BookCard key={book.id} book={book}  onDelete={handleDeleteBook}/>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Empty State */}
                {filteredBooks.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="col-span-full bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-md"
                  >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-100 flex items-center justify-center">
                      {searchQuery ? (
                        <Search size={32} className="text-purple-500" />
                      ) : (
                        <BookOpen size={32} className="text-purple-500" />
                      )}
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {searchQuery ? "No books found" : "Your library is empty"}
                    </h3>

                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      {searchQuery
                        ? "We couldn't find any books matching your search criteria. Try adjusting your search terms or clear the filters."
                        : "Start building your personal library by adding books to your collection."}
                    </p>

                    {searchQuery ? (
                      <button
                        onClick={() => {
                          setSearchQuery("")
                          setActiveFilter(null)
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium transition-colors"
                      >
                        <X size={18} />
                        Clear Search
                      </button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                      >
                        <Sparkles size={18} />
                        Add Your First Book
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Add Book Modal */}
        <AddBookModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onBookAdded={handleBookAdded} />
      </div>
    </div>
  )
}
