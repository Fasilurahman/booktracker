import type React from "react";
import type { Book } from "../types/types";
import { formatDistance, set } from "date-fns";
import { BookOpen, Clock, User, Star, ChevronRight, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DeleteButton from "./DeleteButton";
import { useState } from "react";
import { deleteBook } from "../services/api";

interface BookCardProps {
  book: Book;
  onDelete: (bookId: string) => void;
  
}

export const BookCard: React.FC<BookCardProps> = ({ book, onDelete }) => {

  const [isDeleting, setIsDeleting] = useState(false);
  // Enhanced status configuration with more vibrant colors
  const statusConfig = {
    not_started: {
      color: "bg-slate-100 text-slate-800",
      gradient: "from-slate-50 to-slate-100",
      icon: <BookOpen className="text-slate-600" size={18} />,
      label: "Not Started",
    },
    in_progress: {
      color: "bg-indigo-100 text-indigo-800",
      gradient: "from-indigo-50 to-indigo-100",
      icon: <BookOpen className="text-indigo-600" size={18} />,
      label: "In Progress",
    },
    finished: {
      color: "bg-emerald-100 text-emerald-800",
      gradient: "from-emerald-50 to-emerald-100",
      icon: <Award className="text-emerald-600" size={18} />,
      label: "Finished",
    },
  };

  // Calculate a placeholder rating if not provided
  const rating = book.rating || Math.floor(Math.random() * 5) + 1;

  // Calculate reading progress (random for demo if not provided)
  const progress =
    book.progress ||
    (book.status === "in_progress"
      ? Math.floor(Math.random() * 80) + 10
      : book.status === "finished"
      ? 100
      : 0);

  // Generate a placeholder cover image if not provided
  const coverImage = "/toa-heftiba-ip9R11FMbV8-unsplash.jpg";

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      console.log("Deleting book with ID:", book.id);
      await deleteBook(book.id);
      onDelete(book.id);
    } catch (error) {
      console.error("Error deleting book:", error);
      // Add error toast here if needed
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Link to={`/books/${book.id}`} className="group block">
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300" // Remove overflow-hidden
      >
        {/* Delete button - appears on hover with animation */}
        <motion.div
          className="absolute top-4 left-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-visible"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <DeleteButton isDeleting={isDeleting}  onDelete={handleDelete}/>
        </motion.div>

        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <img
            src={coverImage || "/placeholder.svg"}
            alt={book.title}
            className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700"
          />

          <div className="absolute top-4 right-4 z-20">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${
                statusConfig[book.status].color
              }`}
            >
              {statusConfig[book.status].label}
            </span>
          </div>

          {/* Title overlay on the cover */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
            <h3 className="text-xl font-bold text-white group-hover:text-white/90 transition-colors line-clamp-2 drop-shadow-md">
              {book.title}
            </h3>
          </div>
        </div>

        {/* Content section */}
        <div className="p-5">
          {/* Author info with icon */}
          <div className="flex items-center gap-2 text-gray-700 mb-4">
            <User size={16} className="text-gray-500" />
            <p className="font-medium line-clamp-1">{book.author}</p>
          </div>

          {/* Reading progress bar */}
          <div className="mt-3 mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1.5">
              <span>Reading Progress</span>
              <span className="font-semibold">{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  book.status === "finished"
                    ? "bg-emerald-500"
                    : "bg-indigo-500"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Rating stars */}
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < rating ? "text-amber-400 fill-amber-400" : "text-gray-300"
                }
              />
            ))}
            <span className="text-xs text-gray-600 ml-1">({rating}.0)</span>
          </div>

          {/* Footer with date and view details */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Clock size={14} />
              <span>
                {formatDistance(new Date(book.createdAt), new Date(), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <span className="text-sm font-medium text-indigo-600 flex items-center gap-1 group-hover:gap-2 transition-all">
              View details{" "}
              <ChevronRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </span>
          </div>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute top-0 left-0 w-20 h-20 overflow-hidden">
          <div
            className={`absolute transform -rotate-45 -translate-y-10 -translate-x-10 w-20 h-20 ${
              book.status === "not_started"
                ? "bg-slate-200"
                : book.status === "in_progress"
                ? "bg-indigo-200"
                : "bg-emerald-200"
            }`}
          />
        </div>
      </motion.div>
    </Link>
  );
};
