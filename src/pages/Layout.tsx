import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Layout: React.FC = () => {
  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="fixed bottom-0">footer</footer>
    </div>
  );
};

export default Layout;
