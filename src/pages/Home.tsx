import Gallery from "../components/Gallery";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

function Home() {
  const [pictureList, setPictureList] = useState<any>([]);

  const picturesCollectionRef = collection(db, "pictures");

  useEffect(() => {
    const getPictures = async () => {
      try {
        const data = await getDocs(picturesCollectionRef);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPictureList(filteredData);
      } catch (err) {
        console.log(err);
      }
    };
    getPictures();
  }, []);

  return (
    <>
      <Navbar />
      <Gallery pictureList={pictureList} />
    </>
  );
}

export default Home;
