import React, { useState } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DeleteButtonProps {
  onDelete: () => void;
  className?: string;
  isDeleting?: boolean;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onDelete, className = '', isDeleting  }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(true);
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete();
    setShowConfirm(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(false);
  };

  return (
    <div className={`relative ${className}`} onClick={(e) => e.stopPropagation()}>
      <motion.button
        whileTap={{ scale: isDeleting ? 1 : 0.9 }}
        whileHover={{ scale: isDeleting ? 1 : 1.1 }}
        onClick={handleClick}
        disabled={isDeleting}
        className={`p-2 rounded-full ${
          isDeleting 
            ? 'bg-gray-100 cursor-not-allowed' 
            : 'bg-white/90 hover:bg-red-50 hover:text-red-500'
        } text-gray-500 shadow-sm transition-all duration-200`}
        aria-label={isDeleting ? "Deleting..." : "Delete book"}
      >
        {isDeleting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 size={18} />
        )}
      </motion.button>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            key="confirm-dialog"
            initial={{ opacity: 0, x: -10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.95 }}
            className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-max bg-white rounded-lg shadow-lg p-3 z-50"
            style={{
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
              minWidth: '160px'
            }}
          >
            <p className="text-sm font-medium text-gray-800 mb-2">Delete this book?</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleCancel}
                className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-3 py-1 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeleteButton;