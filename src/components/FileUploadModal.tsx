import React, { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase/config";
import { v4 } from "uuid";
import { IModal } from "../types";
import { useAuth } from "../context/useAuth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

const FileUploadModal: React.FC<IModal> = ({ isVisible, closeModal }) => {
  const { user } = useAuth();
  const [file, setFile] = useState<Blob | null>(null);
  const [picTitle, setPicTitle] = useState<string>("");

  const modalRef = useRef<HTMLDivElement>(null);

  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const picturesCollectionRef = collection(db, "pictures");

  useEffect(() => {
    // on pressing "Escape" key Modal closes
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    //
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeModal]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event?.target?.files) {
      setFile(event.target.files[0]);
      setPicTitle(event.target.files[0].name);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) {
      alert("Please select a file to upload and ensure you're logged in!");
      return;
    }

    const newImageRef = ref(
      storage,
      `images/${v4()}.${file.type.split("/")[1]}`
    );

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      // Upload the fire to Firebase Storage
      const snapshot = await uploadBytes(newImageRef, file);
      console.log("Uploaded an array!", snapshot);

      // Get the download URL for the uploaded files
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("File available at:", downloadURL);

      // Update Firestore with the image reference
      await addDoc(picturesCollectionRef, {
        url: downloadURL,
        userId: user?.uid,
        title: picTitle,
        uploadedAt: new Date().toJSON(),
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Modal
        ref={modalRef}
        isVisible={isVisible}
        closeModal={closeModal}
        mainContent={
          <div className="fixed inset-0 z-[999] backdrop-blur-sm grid h-screen place-items-center bg-black bg-opacity-60">
            <div
              ref={modalRef}
              className="relative m-4 p-4 w-2/5 min-w-[40%] max-w-[40%] bg-white rounded-md"
            >
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <button
                className="mt-10 p-2 bg-lime-500 text-slate-700 font-bold border-black border-2 rounded-md"
                onClick={handleUpload}
              >
                Upload
              </button>
            </div>
          </div>
        }
      />
    </>
  );
};

export default FileUploadModal;
