import React from "react";
import { IPicture } from "../types";

const ImageFrame: React.FC<{ picture: IPicture }> = ({ picture }) => {
  return (
    <div className="hover:cursor-pointer hover:brightness-75">
      <img
        className="object-cover h-80 w-full "
        src={picture?.url}
        alt={picture?.title}
      />
    </div>
  );
};

export default ImageFrame;
