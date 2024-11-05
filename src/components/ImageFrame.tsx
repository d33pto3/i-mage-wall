import React, { useState } from "react";
import { IPicture } from "../types";
import { MdDelete } from "react-icons/md";
// import { useAuth } from "../context/useAuth";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

interface IImageFrame {
  picture: IPicture;
  canDeleteFile?: boolean;
}

const ImageFrame: React.FC<IImageFrame> = ({
  picture,
  canDeleteFile = false,
}) => {
  const [showDeleteBtn, setShowDeleteBtn] = useState<boolean>(false);

  const deleteImage = async (id: string) => {
    try {
      const movieDoc = doc(db, "pictures", id);
      await deleteDoc(movieDoc);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="hover:cursor-pointer hover:brightness-90 relative"
      onMouseOver={() => {
        setShowDeleteBtn(true);
      }}
      onMouseLeave={() => {
        setShowDeleteBtn(false);
      }}
    >
      <img
        className="object-cover h-80 w-full "
        src={picture?.url}
        alt={picture?.title}
      />
      {canDeleteFile && (
        <div
          className={`absolute bg-black w-full text-white bottom-0 ${
            showDeleteBtn ? "opacity-100" : "opacity-0"
          } hover:text-red-500 flex justify-center items-center font-bold h-[30px]`}
          onClick={() => deleteImage(picture?.id)}
        >
          <MdDelete size={25} />
        </div>
      )}
    </div>
  );
};

export default ImageFrame;
