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

/**
 * Sign in user using Google Provider
 * @returns {Promise<{ user: Object, token: string }>}
 */
export const signInWithGoogle = async (): Promise<SignInResult> => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    createUser(user);

    return { user, token: await user.getIdToken(), error: null };
  } catch (error) {
    console.error("Error during sign-in:", error);
    return {
      user: null,
      token: null,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
};

const createUser = async (user: FirebaseUser) => {
  if (user) {
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        isVisible: true,
        createdAt: serverTimestamp(),
      });
      console.log("User document created in Firestore");
    }
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    return { error: error instanceof Error ? error : new Error(String(error)) };
  }
};
