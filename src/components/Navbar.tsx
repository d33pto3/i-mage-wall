import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LayoutGrid, Search, Compass, Layout } from 'lucide-react';
import SignIn from './SignIn';
import { useAuth } from '../context/useAuth';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--border-color)] px-6 py-4">
      <div className="max-w-[1700px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-2xl font-black tracking-tighter text-[var(--text-primary)] flex items-center gap-2 group">
            <span className="w-9 h-9 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-xl flex items-center justify-center group-hover:bg-[var(--accent-color)] transition-colors">
              <LayoutGrid size={20} />
            </span>
            I-MAGE-WALL
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={`text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${location.pathname === '/' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              <Compass size={14} />
              Global Feed
            </Link>
            {user && (
              <Link 
                to={`/profile/${user.uid}`} 
                className={`text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${location.pathname.startsWith('/profile') ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                <Layout size={14} />
                My Studio
              </Link>
            )}
          </div>
        </div>

        <div className="flex-1 max-w-md mx-8 hidden lg:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] transition-colors group-focus-within:text-[var(--accent-color)]" size={18} />
            <input 
              type="text" 
              placeholder="Search inspiration..." 
              className="w-full bg-[var(--bg-secondary)] border border-transparent rounded-full py-2 pl-10 pr-4 text-sm outline-none focus:border-[var(--accent-color)] focus:bg-[var(--bg-primary)] transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          <div className="h-6 w-[1px] bg-[var(--border-color)] mx-2"></div>
          
          <SignIn />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
