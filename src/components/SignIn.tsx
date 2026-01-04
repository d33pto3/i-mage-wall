import React, { useEffect, useRef, useState } from "react";
import { signInWithGoogle, signOutUser } from "../utils/auth";
import { useAuth } from "../context/useAuth";
import { SignInResult } from "../types";
import { Link } from "react-router-dom";
import { User, LogOut, Layout, Settings, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SignIn: React.FC = () => {
  const { user, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropDownRef = useRef<HTMLDivElement | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      const result: SignInResult = await signInWithGoogle();
      if (result.error) setError(result.error.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setShowDropdown(false);
    } catch (err) {
      setError("Error signing out.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  if (loading) return <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] animate-pulse" />;

  return (
    <div className="relative">
      {!user ? (
        <button 
          onClick={handleGoogleSignIn}
          className="flex items-center gap-2 bg-[var(--text-primary)] text-[var(--bg-primary)] px-5 py-2 rounded-full font-medium text-sm hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <LogIn size={16} />
          Sign In
        </button>
      ) : (
        <div className="flex items-center">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-[var(--accent-color)] transition-all transform active:scale-95"
          >
            <img
              src={user?.photoURL || "/src/assets/user.png"}
              alt="User Profile"
              className="w-full h-full object-cover"
            />
          </button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                ref={dropDownRef}
                className="absolute right-0 top-14 w-64 glass border border-[var(--border-color)] rounded-2xl shadow-2xl p-2 z-[60]"
              >
                <div className="px-4 py-3 border-b border-[var(--border-color)] mb-1">
                  <p className="text-sm font-semibold truncate">{user.displayName}</p>
                  <p className="text-xs text-[var(--text-secondary)] truncate">{user.email}</p>
                </div>
                
                <div className="space-y-1">
                  <Link 
                    to={`/profile/${user.uid}`}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-xl transition-colors"
                  >
                    <User size={16}/>
                    Profile
                  </Link>
                  <Link 
                    to={`/profile/${user.uid}`}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-xl transition-colors"
                  >
                    <Layout size={16}/>
                    My Studio
                  </Link>
                  <button 
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-xl transition-colors"
                  >
                    <Settings size={16}/>
                    Settings
                  </button>
                </div>
                
                <div className="border-t border-[var(--border-color)] mt-1 pt-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50/10 rounded-xl transition-colors"
                  >
                    <LogOut size={16}/>
                    Log out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {error && (
        <div className="absolute right-0 top-full mt-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default SignIn;
