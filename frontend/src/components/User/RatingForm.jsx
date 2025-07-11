import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const RatingForm = ({ storeId, currentRating, onRatingSubmitted }) => {
  const [rating, setRating] = useState(currentRating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const { user } = useAuth();

  const handleSubmitRating = async (newRating) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      await axios.post(
        "/api/ratings",
        { store_id: storeId, rating: newRating },
        config
      );
      onRatingSubmitted(); // Refresh the store list to show new ratings
    } catch (error) {
      console.error("Failed to submit rating", error);
    }
  };

  return (
    <div>
      <h4 className="text-center mb-2 text-gray-300">Rate this store:</h4>
      <div className="flex justify-center items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className="text-3xl cursor-pointer"
            style={{
              color: (hoverRating || rating) >= star ? "#FFD700" : "#A9A9A9",
            }}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => {
              setRating(star);
              handleSubmitRating(star);
            }}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  );
};

export default RatingForm;
