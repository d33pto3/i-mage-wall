import SignIn from "./SignIn";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="border-black border-b-[1px] p-4 fixed w-full z-20 top-0 start-0 bg-white">
      <div className="mx-[10%] flex justify-between">
        <h2 className="text-3xl">
          <Link to="/">Mage's Wall</Link>
        </h2>
        <SignIn />
      </div>
    </nav>
  );
}

export default Navbar;
