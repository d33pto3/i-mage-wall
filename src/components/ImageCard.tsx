import React, { useState } from "react";
import { IPicture } from "../types";
import {
  Bookmark,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Check,
  Image as ImageIcon,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

interface ImageCardProps {
  picture: IPicture;
  canEdit?: boolean;
  onOpenDetail?: (picture: IPicture) => void;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  showSocialActions?: boolean;
  currentUserId?: string;
}

const ImageCard: React.FC<ImageCardProps> = ({
  picture,
  canEdit = false,
  onOpenDetail,
  isSelected = false,
  onSelect,
  showSocialActions = false,
  currentUserId,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const isAuthor = currentUserId === picture.userId;
  const shouldShowSocial = showSocialActions && !isAuthor;

  const toggleVisibility = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const docRef = doc(db, "pictures", picture.id);
      await updateDoc(docRef, { isPublic: !picture.isPublic });
    } catch (err) {
      console.error("Error updating visibility:", err);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (confirm("Are you sure you want to delete this image?")) {
        const docRef = doc(db, "pictures", picture.id);
        await deleteDoc(docRef);
      }
    } catch (err) {
      console.error("Error deleting image:", err);
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(picture.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${picture.title || "asset"}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed, opening in new tab:", err);
      window.open(picture.url, "_blank");
    }
  };

  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      className={`group relative rounded-xl overflow-hidden cursor-zoom-in transition-all duration-700 bg-[var(--bg-secondary)] transform transition-transform duration-1000 hover:scale-95 ${
        isSelected ? "ring-4 ring-[var(--accent-color)] ring-offset-4" : ""
      }`}
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={() => onOpenDetail?.(picture)}
    >
      {/* Selection UI */}
      {canEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.(picture.id);
          }}
          className={`absolute top-4 left-4 z-40 w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
            isSelected
              ? "bg-[var(--accent-color)] border-[var(--accent-color)] scale-110 shadow-lg"
              : "bg-black/20 backdrop-blur-md border-white/40 opacity-0 group-hover:opacity-100 hover:scale-110"
          }`}
        >
          {isSelected && (
            <Check size={12} className="text-white stroke-[4px]" />
          )}
        </button>
      )}

      {/* Social Actions Overlay (Top Right) */}
      {shouldShowSocial && (
        <div className="absolute top-4 right-4 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsSaved(!isSaved);
            }}
            className={`w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-md border border-white/20 transition-all ${
              isSaved
                ? "bg-white text-[var(--accent-color)]"
                : "bg-black/20 text-white hover:bg-white/40"
            }`}
          >
            <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
          </button>
          <button
            className="w-10 h-10 rounded-lg flex items-center justify-center bg-black/20 backdrop-blur-md border border-white/20 text-white hover:bg-white/40 transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <Plus size={20} />
          </button>
        </div>
      )}

      {/* Image Container */}
      <div className="relative overflow-hidden">
        {imgError ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center text-[var(--text-secondary)]">
            <div className="w-12 h-12 rounded-2xl bg-[var(--bg-primary)] flex items-center justify-center mb-4 shadow-inner opacity-40">
              <ImageIcon size={24} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">
              Architecture Void
            </p>
          </div>
        ) : (
          <motion.img
            src={picture?.url}
            alt={picture?.title}
            onError={() => setImgError(true)}
            className="w-full h-auto object-cover transform transition-transform duration-1000 group-hover:scale-105"
            loading="lazy"
          />
        )}

        {/* Dark Gradient Overlay (Only on hover, for legibility of action buttons) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
      </div>

      {/* Footer Info (Bottom) */}
      <div className="absolute inset-x-0 bottom-0 z-30 p-5 flex flex-col">
        {/* Title and Creator - ALWAYS VISIBLE */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-white/30 overflow-hidden bg-white/10 backdrop-blur-md">
            <img
              src={`https://api.dicebear.com/7.x/shapes/svg?seed=${picture.userId}`}
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-white text-xs font-bold leading-tight drop-shadow-md">
              {picture?.title || "Anonymous Creator"}
            </span>
            <span className="text-white/60 text-[9px] uppercase font-black tracking-widest leading-tight">
              Vault Protocol
            </span>
          </div>
        </div>

        {/* Action Buttons - HOVER ONLY, SEPARATE LINE WITH TRANSITION */}
        <div className="overflow-hidden max-h-0 group-hover:max-h-20 transition-all duration-500 ease-in-out">
          <div className="flex items-center gap-2 pt-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75">
            {canEdit && (
              <button
                onClick={toggleVisibility}
                className="p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all"
              >
                {picture.isPublic ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            )}
            {canEdit && (
              <button
                onClick={handleDelete}
                className="p-2 rounded-lg bg-red-500/20 backdrop-blur-md border border-red-500/20 text-white hover:bg-red-500 transition-all"
              >
                <Trash2 size={16} />
              </button>
            )}
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white/90 hover:bg-white text-black rounded-lg text-[10px] font-bold transition-all shadow-xl active:scale-95 group/btn"
            >
              <Download
                size={14}
                className="group-hover/btn:translate-y-0.5 transition-transform"
              />
              <span>Download Asset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Badge (Top Left - when applicable) */}
      {canEdit && !isSelected && (
        <div className="absolute top-4 left-14 z-20">
          <div
            className={`px-2 py-1 rounded-md backdrop-blur-md border border-white/20 text-[8px] font-black uppercase tracking-widest ${
              picture.isPublic
                ? "bg-green-500/20 text-green-300"
                : "bg-amber-500/20 text-amber-300"
            }`}
          >
            {picture.isPublic ? "Public" : "Protected"}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ImageCard;
