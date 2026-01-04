import { useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where, deleteDoc, doc, updateDoc, addDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { IPicture } from "../types";
import ImageCard from "../components/ImageCard";
import ImageDetailModal from "../components/ImageDetailModal";
import FileUploadModal from "../components/FileUploadModal";
import { motion } from "framer-motion";
import { 
  Plus, Compass, Layout, 
  Trash2, Folder, 
  Layers, Settings, Eye, EyeOff
} from "lucide-react";

function Profile() {
  const [pictureList, setPictureList] = useState<IPicture[]>([]);
  const [selectedPicture, setSelectedPicture] = useState<IPicture | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { id: profileId } = useParams();
  const { user } = useAuth();
  const isOwnProfile = user?.uid === profileId;

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Delete ${selectedIds.length} assets?`)) {
      try {
        await Promise.all(selectedIds.map(id => deleteDoc(doc(db, "pictures", id))));
        setSelectedIds([]);
      } catch (err) {
        console.error("Batch delete error:", err);
      }
    }
  };

  const handleBatchPrivacy = async (makePublic: boolean) => {
    if (selectedIds.length === 0) return;
    try {
      await Promise.all(selectedIds.map(id => updateDoc(doc(db, "pictures", id), { isPublic: makePublic })));
      setSelectedIds([]);
    } catch (err) {
      console.error("Batch privacy error:", err);
    }
  };

  useEffect(() => {
    if (!profileId) return;

    const q = query(collection(db, "pictures"), where("userId", "==", profileId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...(doc.data() as any),
        id: doc.id,
      })) as IPicture[];
      setPictureList(data);
    });

    return () => unsubscribe();
  }, [profileId]);

  // Professional Creator Stats
  const stats = [
    { label: "Asset Slots", value: `${pictureList.length} / 3`, icon: Layout, progress: (pictureList.length / 3) * 100 },
    { label: "Vault Reach", value: "2.4k", icon: Compass },
    { label: "Collections", value: "1", icon: Folder },
  ];

  const albums = ["Recently Added", "Nature 2024", "Product Shoots", "Architecture"];

  const filteredList = pictureList.filter(pic => {
    if (activeTab === "public") return pic.isPublic;
    if (activeTab === "private") return !pic.isPublic;
    return true; // "all"
  });

  return (
    <div className="pt-24 min-h-screen bg-[var(--bg-secondary)]/50">
      <div className="max-w-[1700px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-8 pb-20">
        
        {/* Sidebar - Creator Studio Panel */}
        <aside className="w-full lg:w-80 flex flex-col gap-6">
          <div className="glass rounded-[2.5rem] p-10 flex flex-col items-center text-center shadow-sm border-white/10">
            <div className="relative group mb-8">
              <div className="absolute -inset-1 bg-gradient-to-tr from-[var(--accent-color)] to-purple-500 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-500" />
              <img
                src={user?.photoURL || "/src/assets/user.png"}
                className="relative w-28 h-28 rounded-full border-2 border-white/50 p-1.5 object-cover"
                alt="Profile"
              />
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white">
                <Settings size={22} />
              </div>
            </div>
            
            <div className="mb-10">
              <h2 className="text-2xl font-black text-[var(--text-primary)] mb-1 tracking-tight">{user?.displayName}</h2>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--accent-color)]/10 text-[var(--accent-color)] rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Workspace</span>
              </div>
            </div>
            
            <div className="w-full space-y-6">
              {stats.map((stat, i) => (
                <div key={i} className="text-left group/stat">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5 text-[var(--text-secondary)]">
                      <div className="p-1.5 rounded-lg bg-[var(--bg-primary)] group-hover/stat:bg-[var(--accent-color)] group-hover/stat:text-white transition-colors">
                        <stat.icon size={14} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider">{stat.label}</span>
                    </div>
                    <span className="text-sm font-black">{stat.value}</span>
                  </div>
                  {stat.progress && (
                    <div className="w-full h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden p-[2px]">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.progress}%` }}
                        className="h-full bg-[var(--accent-color)] rounded-full shadow-[0_0_8px_var(--accent-color)]"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-[2rem] p-8 shadow-sm border-white/10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-8 px-2 opacity-50">Curated Collections</h3>
            <div className="space-y-2">
              {albums.map((album, i) => (
                <button key={i} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-[var(--bg-primary)] transition-all group border border-transparent hover:border-white/20">
                  <div className="flex items-center gap-3">
                    <Folder size={18} className="text-orange-400 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{album}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Dashboard - Architecture Field */}
        <main className="flex-1 bg-[var(--bg-primary)] rounded-[3rem] p-4 md:p-10 shadow-xl border border-[var(--border-color)] overflow-hidden">
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-12 gap-8 px-2">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black">
                  <Layout size={20} />
                </span>
                <h1 className="text-4xl font-black tracking-tighter text-[var(--text-primary)]">Studio Canvas</h1>
              </div>
              <p className="text-base text-[var(--text-secondary)] font-medium max-w-lg">Manage, orchestrate, and deploy your visual assets across the global architecture.</p>
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
              <div className="flex bg-[var(--bg-secondary)] p-1.5 rounded-[1.5rem] border border-[var(--border-color)]">
                {[
                  { id: "all", label: "All Assets" },
                  { id: "public", label: "Discovery" },
                  { id: "private", label: "Private" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-8 py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === tab.id ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-lg scale-[1.02]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="h-10 w-[1px] bg-[var(--border-color)] mx-4 hidden xl:block"></div>

              <button 
                onClick={() => setIsUploadOpen(true)}
                className="group flex items-center justify-center gap-3 bg-[var(--text-primary)] text-[var(--bg-primary)] px-10 py-5 rounded-[1.8rem] font-black uppercase tracking-[0.2em] text-[10px] hover:scale-[1.02] active:scale-98 transition-all shadow-2xl shadow-black/10"
              >
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                Inject Asset
              </button>
            </div>
          </div>

          {/* Quick Remote Injection Form */}
          <div className="mb-12 glass rounded-[2rem] p-6 border-dashed border-2 border-[var(--accent-color)]/20">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 w-full space-y-1">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--accent-color)] ml-1">Remote URL (Unlimited)</label>
                <div className="relative">
                  <Compass className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={16} />
                  <input 
                    type="text" 
                    id="remoteUrl"
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-[var(--accent-color)] transition-all"
                  />
                </div>
              </div>
              <div className="flex-1 w-full md:w-64 space-y-1">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] ml-1">Asset Title</label>
                <input 
                  type="text" 
                  id="remoteTitle"
                  placeholder="Atmospheric Architecture"
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-3.5 px-4 text-sm font-medium focus:outline-none focus:border-[var(--accent-color)] transition-all"
                />
              </div>
              <button 
                onClick={async () => {
                  const urlInput = document.getElementById('remoteUrl') as HTMLInputElement;
                  const titleInput = document.getElementById('remoteTitle') as HTMLInputElement;
                  if (!urlInput.value || !user) return;
                  
                  try {
                    await addDoc(collection(db, "pictures"), {
                      url: urlInput.value,
                      userId: user.uid,
                      title: titleInput.value || "Remote Asset",
                      uploadedAt: new Date().toJSON(),
                      isPublic: true,
                      type: 'remote'
                    });
                    urlInput.value = "";
                    titleInput.value = "";
                  } catch (err) {
                    console.error("Remote injection error:", err);
                  }
                }}
                className="w-full md:w-auto mt-5 md:mt-0 bg-[var(--accent-color)] text-white px-8 py-3.5 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <Layers size={14} />
                Link Asset
              </button>
            </div>
          </div>

          {/* Asset Grid */}
          <div className="relative min-h-[60vh]">
            {filteredList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 px-2">
                {filteredList.map((pic) => (
                  <ImageCard 
                    key={pic.id} 
                    picture={pic} 
                    canEdit={isOwnProfile}
                    onOpenDetail={(p) => { setSelectedPicture(p); setIsDetailOpen(true); }}
                    isSelected={selectedIds.includes(pic.id)}
                    onSelect={toggleSelect}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-48 border-2 border-dashed border-[var(--border-color)] rounded-[3rem] bg-[var(--bg-secondary)]/30 mx-2">
                <div className="w-20 h-20 rounded-full bg-[var(--bg-primary)] flex items-center justify-center shadow-inner mb-8 opacity-50">
                  <Layers size={40} className="text-[var(--text-secondary)]" />
                </div>
                <h3 className="text-xl font-black text-[var(--text-primary)] mb-2 uppercase tracking-[0.3em]">Field is Void</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-10 font-medium">No visual assets detected in this sector.</p>
                <button 
                  onClick={() => setIsUploadOpen(true)}
                  className="bg-[var(--accent-color)] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:translate-y-[-2px] transition-all shadow-xl shadow-[var(--accent-color)]/30"
                >
                  Initiate Upload
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Floating Selection Toolbar */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: selectedIds.length > 0 ? 0 : 100, opacity: selectedIds.length > 0 ? 1 : 0 }}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100]"
      >
        <div className="glass rounded-[2rem] p-4 flex items-center gap-6 shadow-2xl border-white/20 bg-black/90 dark:bg-white/90">
          <div className="px-6 py-3 bg-[var(--accent-color)] text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3">
            <span className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">{selectedIds.length}</span>
            Selected
          </div>
          
          <div className="flex gap-2 pr-2">
            <button 
              onClick={() => handleBatchPrivacy(true)}
              className="p-4 rounded-2xl hover:bg-green-500/20 hover:text-green-500 transition-all text-white/60 dark:text-black/60 flex items-center gap-2 group"
              title="Make Public"
            >
              <Eye size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Public</span>
            </button>
            <button 
              onClick={() => handleBatchPrivacy(false)}
              className="p-4 rounded-2xl hover:bg-amber-500/20 hover:text-amber-500 transition-all text-white/60 dark:text-black/60 flex items-center gap-2 group"
              title="Make Private"
            >
              <EyeOff size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Private</span>
            </button>
            <div className="w-[1px] h-8 bg-white/10 dark:bg-black/10 self-center mx-2" />
            <button 
              onClick={handleBatchDelete}
              className="p-4 rounded-2xl hover:bg-red-500/20 hover:text-red-500 transition-all text-white/60 dark:text-black/60 flex items-center gap-2 group"
              title="Delete Assets"
            >
              <Trash2 size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden md:block text-red-500/80">Destroy</span>
            </button>
          </div>

          <button 
            onClick={() => setSelectedIds([])}
            className="p-4 rounded-2xl hover:bg-white/10 dark:hover:bg-black/10 transition-all text-white/40 dark:text-black/40"
          >
            <Plus size={20} className="rotate-45" />
          </button>
        </div>
      </motion.div>

      <ImageDetailModal 
        picture={selectedPicture}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      <FileUploadModal 
        isVisible={isUploadOpen}
        closeModal={() => setIsUploadOpen(false)}
      />
    </div>
  );
}

export default Profile;
