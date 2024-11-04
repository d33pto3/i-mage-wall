import SignIn from "./SignIn";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="border-black border-b-2 p-4">
      <div className="mx-[10%] flex justify-between">
        <h2 className="text-3xl">
          <Link to="/">Mage's Wall</Link>
        </h2>
        <SignIn />
      </div>
    </div>
  );
}

export default Navbar;
