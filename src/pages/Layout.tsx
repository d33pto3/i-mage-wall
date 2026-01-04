import { Outlet, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-[var(--border-color)] py-20 px-12">
        <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center text-[10px] font-black">IW</span>
            <span className="text-sm font-black tracking-tighter uppercase">i-mage-wall</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] opacity-50">© 2026 i-mage-wall. High-fidelity visual architecture.</p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">
            <Link to="/privacy" className="hover:text-[var(--text-primary)] transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-[var(--text-primary)] transition-colors">Terms</Link>
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">API Reference</a>
          </div>
        </div>
      </footer>
    </div>
  );
};


export default Layout;
