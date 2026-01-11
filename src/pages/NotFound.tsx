import { motion } from "framer-motion";
import { Search, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div className="relative">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              y: [0, -5, 5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-[12rem] font-black text-[var(--accent-color)] opacity-10 select-none"
          >
            404
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center border border-[var(--border-color)]">
              <Search size={40} className="text-[var(--text-secondary)]" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
          <p className="text-[var(--text-secondary)]">
            The image or page you're looking for has moved to another dimension.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--accent-color)] text-white rounded-2xl font-semibold shadow-lg shadow-[var(--accent-color)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <ArrowLeft size={20} />
          Back to Gallery
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
