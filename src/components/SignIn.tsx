import React, { useEffect, useRef, useState } from "react";
import { signInWithGoogle, signOutUser } from "../utils/auth";
import { useAuth } from "../context/useAuth";
import { SignInResult } from "../types";
import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { User as FirebaseUser } from "firebase/auth";

// SignIn component definition
const SignIn: React.FC = () => {
  const { user, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const dropDownRef = useRef<HTMLDivElement | null>(null);

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const result: SignInResult = await signInWithGoogle();
      if (result.error) {
        setError(result.error.message);
      } else {
        console.log("Logged in user:", result.user);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message); // Type-safe error handling
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  // Handle Sign-Out
  const handleSignOut = async () => {
    try {
      await signOutUser();
      console.log("User signed out successfully.");
    } catch (err) {
      console.log(err);
      setError("Error signing out.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropDownRef?.current &&
        !dropDownRef?.current.contains(event?.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  // if (loading) {
  //   return <div>Loading...</div>; // Show loading state while auth state is being determined
  // }

  return (
    <div>
      {/* If user is not logged in, show "Log In" button */}
      {!user ? (
        <button onClick={handleGoogleSignIn}>Log In with Google</button>
      ) : (
        // If user is logged in, show their profile information
        <div className="flex ">
          <h3></h3>
          <button>
            <img
              src={user.photoURL || ""}
              alt="User Profile"
              style={{ width: "50px", borderRadius: "50%" }}
              onClick={() => {
                setShowDropdown(!showDropdown);
              }}
            />
          </button>
          {/* <p>Email: {user.email}</p> */}
          {/* <button onClick={handleSignOut}>Logout</button> */}

          <div
            ref={dropDownRef}
            className={`${
              showDropdown ? "block" : "hidden"
            } absolute bg-[#f9f9f9] border-2 min-w-[160px] shadow-md shadow-black px-[8px] py-[8px] z-10 right-8 top-16 `}
          >
            <ul className="text-black ">
              <li className="hover:text-xl cursor-pointer">
                <Link to={`/profile/${user.uid}`}>Profile</Link>
              </li>
              <li
                className="hover:text-xl cursor-pointer"
                onClick={handleSignOut}
              >
                Log out
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Show error message if there is an error */}
      {error && (
        <div style={{ color: "red" }}>
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default SignIn;
