import React, { useState } from "react";
import Modal from "./Modal";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase/config";
import { v4 as uuidv4 } from "uuid";
import { IModal } from "../types";
import { useAuth } from "../context/useAuth";
import { addDoc, collection } from "firebase/firestore";
import { MdCancelPresentation } from "react-icons/md";

const FileUploadModal: React.FC<IModal> = ({ isVisible, closeModal }) => {
  const { user } = useAuth();
  const [file, setFile] = useState<Blob | null>(null);
  const [picTitle, setPicTitle] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  const picturesCollectionRef = collection(db, "pictures");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.target.files) {
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
      `images/${uuidv4()}.${file.type.split("/")[1]}`
    );

    setUploading(true);

    try {
      const snapshot = await uploadBytes(newImageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      await addDoc(picturesCollectionRef, {
        url: downloadURL,
        userId: user.uid,
        title: picTitle,
        uploadedAt: new Date().toJSON(),
      });
      closeModal();
    } catch (err) {
      console.log("Error uploading file:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      closeModal={closeModal}
      headerContent={
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Upload File</h2>
          <MdCancelPresentation
            size={20}
            className="hover:text-red-500 hover:cursor-pointer"
          />
        </div>
      }
      mainContent={
        <div className="flex flex-col space-y-4">
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button
            className="mt-4 p-2 bg-lime-500 text-slate-700 font-bold border-black border-2 rounded-md"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      }
    />
  );
};

export default FileUploadModal;
