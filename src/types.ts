import { User as FirebaseUser } from "firebase/auth";

export interface IModal {
  isVisible: boolean;
  closeModal: () => void;
}

export interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
}

export interface SignInResult {
  user: FirebaseUser | null;
  token: string | null;
  error: Error | null;
}

export interface IPicture {
  id: string;
  title: string;
  uploadedAt: string;
  url: string;
  userId: string;
}
