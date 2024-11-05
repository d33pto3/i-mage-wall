import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Layout: React.FC = () => {
  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main className="bg-slate-100 h-[100%] py-24">
        <Outlet />
      </main>
      <footer className="bg-white w-full">footer</footer>
    </div>
  );
};

export default Layout;
