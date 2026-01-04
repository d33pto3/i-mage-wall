import React from "react";
import { IPicture } from "../types";
import ImageCard from "./ImageCard";

interface IGallery {
  pictureList: IPicture[];
  canEdit?: boolean;
  onOpenDetail?: (picture: IPicture) => void;
}

const Gallery: React.FC<IGallery> = ({ pictureList, canEdit = false, onOpenDetail }) => {
  return (
    <div className="masonry-grid pt-4">
      {pictureList.map((pic: IPicture) => (
        <ImageCard 
          picture={pic} 
          key={pic.id} 
          canEdit={canEdit} 
          onOpenDetail={onOpenDetail} 
        />
      ))}
    </div>
  );
};

export default Gallery;
