import React, { useState } from "react";
import { IPicture } from "../types";
import ImageFrame from "./ImageFrame";
import FileUploadModal from "./FileUploadModal";

interface IGallery {
  pictureList: IPicture[];
  canEditFile?: boolean;
}

const Gallery: React.FC<IGallery> = ({ pictureList, canEditFile = false }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div className="grid grid-cols-5 gap-[4px] pt-4">
      {pictureList.map((pic: IPicture) => (
        <ImageFrame picture={pic} key={pic.id} canDeleteFile={canEditFile} />
      ))}
      {canEditFile && (
        <>
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
        </>
      )}
    </div>
  );
};

export default Gallery;
