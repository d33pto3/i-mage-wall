// src/utils/auth.js
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { SignInResult } from "../types";

// Create an instance of the Google provider object

/**
 * Sign in user using Google Provider
 * @returns {Promise<{ user: Object, token: string }>}
 */
export const signInWithGoogle = async (): Promise<SignInResult> => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // create a user document in Firestore
    createUser(user);

    return { user, token: await user.getIdToken(), error: null };
  } catch (error) {
    console.error("Error during sign-in:", error);
    return { error };
  }
};

const createUser = async (user: FirebaseUser) => {
  if (user) {
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      // If user document doesn't exist, create a new one
      await setDoc(userDocRef, {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        isVisible: true, // Default visibility for the user
        createdAt: serverTimestamp(),
      });
      console.log("User document created in Firestore");
    }
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    // return { success: true };
  } catch (error) {
    return { error };
  }
};
