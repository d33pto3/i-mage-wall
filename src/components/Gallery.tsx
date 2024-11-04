import React, { useState } from "react";
import FileUploadModal from "./FileUploadModal";
import { IPicture } from "../types";
import ImageFrame from "./ImageFrame";

const Gallery: React.FC<{ pictureList: IPicture[] }> = ({ pictureList }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  console.log(pictureList);

  return (
    <div className="grid grid-cols-5 gap-[4px]">
      {pictureList.map((pic: IPicture) => (
        <ImageFrame picture={pic} key={pic.id} />
      ))}
      <div className="border-black border-[2px] flex justify-center items-center">
        <p
          className="text-3xl py-3 px-5 rounded-full border-black border-[2px] hover:cursor-pointer"
          onClick={() => {
            setShowModal(true);
          }}
        >
          +
        </p>
      </div>
      <FileUploadModal
        isVisible={showModal}
        closeModal={() => setShowModal(false)}
      />
    </div>
  );
};

export default Gallery;
