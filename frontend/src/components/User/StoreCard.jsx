import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import RatingForm from "./RatingForm";

const StoreCard = ({ store, onRatingSubmitted }) => {
  const { user } = useAuth();

  useEffect(() => {
    // This function fetches all stores as requested.
    // Note: The component already receives the specific store data via props.
    const fetchAllStores = async () => {
      if (!user?.token) return;

      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const { data } = await axios.get("/api/stores/", config);
        console.log("Fetched all stores from within StoreCard:", data);
      } catch (error) {
        console.error("Error fetching stores in StoreCard:", error);
      }
    };

    fetchAllStores();
  }, [user]); // Effect runs when the component mounts or user changes

  return (
    <div className="bg-gray-800 p-6 rounded-lg flex flex-col justify-between">
      <div>
        <h3 className="text-2xl font-bold">{store.name}</h3>
        <p className="text-gray-400 mt-1">{store.address}</p>
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-gray-400">Overall Rating:</span>
            <span className="ml-2 font-bold text-lg">
              {store.averageRating
                ? parseFloat(store.averageRating).toFixed(1)
                : "N/A"}{" "}
              ★
            </span>
          </div>
          <div>
            <span className="text-gray-400">Your Rating:</span>
            <span className="ml-2 font-bold text-lg text-blue-400">
              {store.userRating ? `${store.userRating} ★` : "Not Rated"}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <RatingForm
          storeId={store.id}
          currentRating={store.userRating}
          onRatingSubmitted={onRatingSubmitted}
        />
      </div>
    </div>
  );
};

export default StoreCard;
