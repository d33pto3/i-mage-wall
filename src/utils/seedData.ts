import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const FAKE_ASSETS = [
  {
    title: "Neon Cyber Structure",
    url: "https://images.unsplash.com/photo-1511765224389-37f0e77ee0eb?q=20&w=600",
    userId: "user_alpha_01",
    isPublic: true,
    category: "Architecture"
  },
  {
    title: "Minimalist Void",
    url: "https://images.unsplash.com/photo-1493397212122-2b85def82b00?q=20&w=600",
    userId: "user_beta_02",
    isPublic: true,
    category: "Abstract"
  },
  {
    title: "Brutalist Monolith",
    url: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=20&w=600",
    userId: "user_gamma_03",
    isPublic: true,
    category: "Architecture"
  },
  {
    title: "Glass Lattice",
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=20&w=600",
    userId: "user_delta_04",
    isPublic: true,
    category: "Photography"
  },
  {
    title: "Obsidian Geometry",
    url: "https://images.unsplash.com/photo-1503387762-592dea58f21f?q=20&w=600",
    userId: "user_alpha_01",
    isPublic: true,
    category: "Digital Art"
  },
  {
    title: "Ethereal Spire",
    url: "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?q=20&w=600",
    userId: "user_beta_02",
    isPublic: true,
    category: "Photography"
  },
  {
    title: "Quantum Displacement",
    url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=20&w=600",
    userId: "user_gamma_03",
    isPublic: true,
    category: "Digital Art"
  },
  {
    title: "Linear Convergence",
    url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=20&w=600",
    userId: "user_delta_04",
    isPublic: true,
    category: "Nature"
  }
];


export const seedDatabase = async (targetUserId?: string) => {
  console.log("Starting database seeding...");
  const results = [];
  
  for (const asset of FAKE_ASSETS) {
    try {
      const docRef = await addDoc(collection(db, "pictures"), {
        ...asset,
        userId: targetUserId || asset.userId,
        uploadedAt: new Date().toJSON(),
        type: 'remote'
      });
      results.push(docRef.id);
      console.log(`Seeded: ${asset.title}`);
    } catch (error) {
      console.error(`Error seeding ${asset.title}:`, error);
    }
  }
  
  return results;
};

