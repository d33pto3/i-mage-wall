import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase/config";
import { v4 as uuidv4 } from "uuid";
import { IModal } from "../types";
import { useAuth } from "../context/useAuth";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import {
  X,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";

const FileUploadModal: React.FC<IModal> = ({ isVisible, closeModal }) => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [picTitle, setPicTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("Nature");
  const [uploading, setUploading] = useState<boolean>(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [imageCount, setImageCount] = useState<number>(0);
  const [isCheckingLimit, setIsCheckingLimit] = useState<boolean>(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isVisible && user) {
      const checkLimit = async () => {
        setIsCheckingLimit(true);
        try {
          const q = query(
            collection(db, "pictures"),
            where("userId", "==", user.uid),
            where("type", "==", "storage")
          );
          const snapshot = await getDocs(q);
          setImageCount(snapshot.size);
        } catch (err) {
          console.error("Error checking image limit:", err);
        } finally {
          setIsCheckingLimit(false);
        }
      };
      checkLimit();
    }
  }, [isVisible, user]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPicTitle(selectedFile.name.split(".")[0]);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;
    if (imageCount >= 3) {
      setStatus("error");
      return;
    }

    setUploading(true);
    setStatus("idle");

    try {
      const fileExt = file.name.split(".").pop();
      const newImageRef = ref(storage, `images/${uuidv4()}.${fileExt}`);

      const snapshot = await uploadBytes(newImageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      await addDoc(collection(db, "pictures"), {
        url: downloadURL,
        userId: user.uid,
        title: picTitle,
        category: category,
        uploadedAt: new Date().toJSON(),
        isPublic: true,
        type: "storage",
      });

      setStatus("success");
      setTimeout(() => {
        setFile(null);
        setPreview(null);
        setStatus("idle");
        closeModal();
      }, 1500);
    } catch (err) {
      console.error("Error uploading file:", err);
      setStatus("error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg glass rounded-[2rem] overflow-hidden shadow-2xl border border-[var(--border-color)]"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                    Add to Wall
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Drop your creative assets here.
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {!preview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[var(--border-color)] rounded-3xl p-12 flex flex-col items-center justify-center gap-4 hover:bg-[var(--bg-secondary)] transition-all cursor-pointer group"
                >
                  <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-2xl flex items-center justify-center text-[var(--text-secondary)] group-hover:scale-110 transition-transform">
                    <Upload size={28} />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-[var(--text-primary)]">
                      Select Image
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      PNG, JPG, WebP up to 10MB
                    </p>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  {imageCount >= 3 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3"
                    >
                      <AlertCircle className="text-red-500 mt-0.5" size={18} />
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-red-500">
                          Global Limit Reached
                        </p>
                        <p className="text-xs text-red-500/70">
                          The Free Tier is restricted to 3 active assets. Please
                          remove an existing image to inject a new one.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  <div className="relative rounded-2xl overflow-hidden aspect-video bg-[var(--bg-secondary)]">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setPreview(null)}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all shadow-lg"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] ml-1">
                      Asset Designation
                    </label>
                    <input
                      type="text"
                      value={picTitle}
                      onChange={(e) => setPicTitle(e.target.value)}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[1.2rem] px-5 py-4 text-sm font-bold focus:outline-none focus:border-[var(--accent-color)] transition-all"
                      placeholder="e.g. Architecture-001"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] ml-1">
                      Visual Sector
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[1.2rem] px-5 py-4 text-sm font-bold focus:outline-none focus:border-[var(--accent-color)] transition-all appearance-none cursor-pointer"
                    >
                      {[
                        "Abstract",
                        "Nature",
                        "Digital Art",
                        "Photography",
                        "Architecture",
                      ].map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleUpload}
                    disabled={
                      uploading ||
                      status === "success" ||
                      imageCount >= 3 ||
                      isCheckingLimit
                    }
                    className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 transition-all ${
                      status === "success"
                        ? "bg-green-500 text-white"
                        : imageCount >= 3
                        ? "bg-[var(--bg-secondary)] text-[var(--text-secondary)] cursor-not-allowed border border-[var(--border-color)]"
                        : uploading
                        ? "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
                        : "bg-[var(--text-primary)] text-[var(--bg-primary)] hover:scale-[1.02] shadow-2xl shadow-black/10"
                    }`}
                  >
                    {isCheckingLimit ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : uploading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : status === "success" ? (
                      <CheckCircle2 size={18} />
                    ) : imageCount >= 3 ? (
                      <AlertCircle size={18} />
                    ) : (
                      <ImageIcon size={18} />
                    )}

                    {isCheckingLimit
                      ? "Verifying Permissions..."
                      : uploading
                      ? "Injecting Asset..."
                      : status === "success"
                      ? "Success"
                      : imageCount >= 3
                      ? "Limit Exceeded"
                      : "Inject to Wall"}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FileUploadModal;
