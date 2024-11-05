import { useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import Gallery from "../components/Gallery";

function Profile() {
  const [pictureList, setPictureList] = useState([]);

  const params = useParams();
  const loggedInUser = params.id;
  const { user } = useAuth();

  const picturesCollectionRef = collection(db, "pictures");

  useEffect(() => {
    const getPictures = async () => {
      try {
        const data = await getDocs(picturesCollectionRef);
        let filteredData: any = [];

        data.docs.map((doc) => {
          if (doc.data().userId === loggedInUser) {
            filteredData.push({
              ...doc.data(),
              id: doc.id,
            });
          }
        });
        setPictureList(filteredData);
      } catch (err) {
        console.log(err);
      }
    };
    getPictures();
  }, []);

  return (
    <>
      <div className="mx-[10%] pt-5">
        <div className="flex justify-between items-center border-b-[1px] border-gray-400 pb-2 px-24">
          <img
            src={user?.photoURL || ""}
            className=""
            style={{ width: "100px", borderRadius: "50%" }}
          />
          <p className="text-xl">{user?.displayName}</p>
          <p>
            <span>Photos: </span>
            {pictureList?.length || 0}
          </p>
        </div>
      </div>
      <div className="mx-[10%]">
        <Gallery pictureList={pictureList} canEditFile={true} />
      </div>
    </>
  );
}

export default Profile;
