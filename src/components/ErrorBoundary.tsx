import { Component, ErrorInfo, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const ErrorFallback = ({
  error,
  resetError,
}: {
  error: Error | null;
  resetError: () => void;
}) => {
  const copyToClipboard = () => {
    if (error) {
      const text = `${error.name}: ${error.message}\n\nStack Trace:\n${error.stack}`;
      navigator.clipboard.writeText(text);
      alert("Error details copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[var(--bg-primary)] text-[var(--text-primary)] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--accent-color)] opacity-[0.03] blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--accent-color)] opacity-[0.03] blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-xl w-full glass p-8 md:p-12 rounded-[2rem] shadow-[var(--card-shadow)] flex flex-col items-center text-center space-y-8 z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 bg-red-500/10 dark:bg-red-500/20 rounded-3xl flex items-center justify-center text-red-500"
        >
          <AlertCircle size={56} strokeWidth={1.5} />
        </motion.div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent">
            System Interface Error
          </h1>
          <p className="text-[var(--text-secondary)] text-base max-w-sm mx-auto">
            We've encountered a glitch in the matrix. Our systems have logged
            the incident for review.
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full space-y-2"
            >
              <div className="relative group">
                <div className="w-full p-5 bg-[var(--bg-secondary)] rounded-2xl text-left overflow-hidden border border-[var(--border-color)] group-hover:border-[var(--accent-color)]/30 transition-colors">
                  <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2 font-semibold">
                    Error Message
                  </p>
                  <code className="text-sm text-red-400 font-mono break-words block pr-8">
                    {error.name}: {error.message}
                  </code>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors p-2"
                  title="Copy error details"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="9"
                      y="9"
                      width="13"
                      height="13"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row gap-4 w-full pt-4">
          <button
            onClick={resetError}
            className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-[var(--accent-color)] text-white rounded-2xl font-semibold shadow-lg shadow-[var(--accent-color)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <RefreshCw size={20} />
            Reset Interface
          </button>
          <a
            href="/"
            className="flex-1 flex items-center justify-center gap-3 px-8 py-4 border border-[var(--border-color)] text-[var(--text-primary)] rounded-2xl font-semibold hover:bg-[var(--bg-secondary)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Home size={20} />
            Return Home
          </a>
        </div>
      </motion.div>
    </div>
  );
};

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private resetError = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback error={this.state.error} resetError={this.resetError} />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
