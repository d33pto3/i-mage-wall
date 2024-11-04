import { useState } from "react";
import FileUploadModal from "./FileUploadModal";
import { IPicture } from "../types";

export default function Gallery({ pictureList }: { pictureList: IPicture[] }) {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <div className="grid grid-cols-5 gap-8 mt-4 mx-8">
      {pictureList.map((pic: IPicture) => (
        <div
          className="border-emerald-800 border-[8px] shadow-black shadow-xl transition ease-in-out hover:scale-110"
          key={pic.id}
        >
          <img
            className="object-cover h-48 w-96"
            src={pic.url}
            alt={pic.title}
          />
        </div>
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
}
