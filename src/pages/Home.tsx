import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { IPicture } from "../types";
import ImageCard from "../components/ImageCard";
import ImageDetailModal from "../components/ImageDetailModal";
import { SlidersHorizontal, Database } from "lucide-react";
import { seedDatabase } from "../utils/seedData";
import { useAuth } from "../context/useAuth";
import { Masonry } from "masonic";

function Home() {
  const [pictureList, setPictureList] = useState<IPicture[]>([]);
  const [filteredList, setFilteredList] = useState<IPicture[]>([]);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState<IPicture | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Abstract", "Nature", "Digital Art", "Photography", "Architecture"];

  const MasonryCard = ({ data }: { data: IPicture }) => (
    <div className="pb-8">
      <ImageCard 
        picture={data} 
        onOpenDetail={openDetail}
      />
    </div>
  );

  useEffect(() => {
    const q = query(
      collection(db, "pictures"), 
      where("isPublic", "==", true)
    );
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          ...(doc.data() as any),
          id: doc.id,
        })) as IPicture[];
        setPictureList(data);
        setIsLoading(false);
      },
      (error) => {
        console.error("Firestore error:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredList(pictureList);
    } else {
      setFilteredList(pictureList.filter(pic => (pic as any).category === activeCategory));
    }
  }, [pictureList, activeCategory]);

  const openDetail = (picture: IPicture) => {
    setSelectedPicture(picture);
    setIsDetailOpen(true);
  };

  return (
    <div className="pt-32 pb-20 px-6 md:px-12 max-w-[1700px] mx-auto min-h-screen">
      {/* Header & Filter Section */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-16 gap-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--accent-color)]/10 text-[var(--accent-color)] rounded-full">
            <div className="w-1 h-1 rounded-full bg-[var(--accent-color)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Global Discovery</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-[var(--text-primary)] leading-[0.9]">
            Inspiration <br />
            <span className="text-[var(--text-secondary)] opacity-50">Without Borders.</span>
          </h1>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4">
          <button 
            onClick={async () => {
              setIsSeeding(true);
              await seedDatabase(user?.uid);
              setIsSeeding(false);
              alert("8 fake assets have been injected into your profile and the global architecture.");
            }}
            disabled={isSeeding}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-500/10 text-indigo-500 rounded-[1.2rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-500/20 transition-all border border-indigo-500/20 disabled:opacity-50"
          >
            <Database size={14} className={isSeeding ? "animate-pulse" : ""} />
            {isSeeding ? "Injecting Data..." : "Seed Feed"}
          </button>

          <div className="flex bg-[var(--bg-secondary)] p-1.5 rounded-[1.5rem] border border-[var(--border-color)] overflow-x-auto max-w-full scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-lg scale-[1.02]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <button className="hidden md:flex p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[1.5rem] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] hover:shadow-lg transition-all">
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Masonry Grid with Loading State */}
      <div className="relative min-h-[40vh]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-12 h-12 mb-6 rounded-full border-4 border-[var(--border-color)] border-t-[var(--accent-color)] animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Architecting Feed...</p>
          </div>
        ) : filteredList.length > 0 ? (
          <Masonry
            items={filteredList}
            columnGutter={32}
            columnWidth={300}
            overscanBy={2}
            render={MasonryCard}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-[var(--border-color)] rounded-[3rem] bg-[var(--bg-secondary)]/30">
            <div className="w-20 h-20 rounded-full bg-[var(--bg-primary)] flex items-center justify-center shadow-inner mb-8 opacity-50">
               <SlidersHorizontal size={32} className="text-[var(--text-secondary)] rotate-90" />
            </div>
            <h3 className="text-xl font-black text-[var(--text-primary)] mb-2 uppercase tracking-[0.3em]">Canvas is Blank</h3>
            <p className="text-sm text-[var(--text-secondary)] font-medium">No public assets found in this category.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <ImageDetailModal 
        picture={selectedPicture}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
}

export default Home;
