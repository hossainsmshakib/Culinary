import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { Review } from "../../interfaces/Recipe";
import { addReviewAsync } from "../../redux/slices/recipeSlice";
import { v4 as uuidv4 } from "uuid";

interface RatingsAndReviewsProps {
  recipeId: string;
  reviews: Review[] | undefined;
}

const RatingsAndReviews: React.FC<RatingsAndReviewsProps> = ({
  recipeId,
  reviews = [],
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const newReview: Review = {
      id: uuidv4(),
      userId: currentUser.id,
      username: currentUser.username,
      recipeId,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    dispatch(addReviewAsync(newReview));
    setRating(0);
    setComment("");
  };

  return (
    <div className="mt-6 bg-pearl-white p-4 sm:p-6 rounded-lg shadow-md">
      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
        Ratings & Reviews
      </h3>
      <div className="mb-4 sm:mb-6">
        <h4 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-700">
          Leave a Review
        </h4>
        <form onSubmit={handleSubmitReview} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block mb-1 sm:mb-2 text-gray-600">Rating:</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full border rounded px-3 py-2 bg-white text-gray-700"
              required
            >
              <option value={0}>Select rating</option>
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  {value} star{value !== 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 sm:mb-2 text-gray-600">Comment:</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border rounded px-3 py-2 bg-white text-gray-700"
              rows={4}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 sm:px-6 py-2 rounded hover:bg-green-600 transition duration-300"
          >
            Submit Review
          </button>
        </form>
      </div>
      <div>
        <h4 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-700">
          Reviews
        </h4>
        {reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet.</p>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white p-3 sm:p-4 rounded-lg shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-800">
                    {review.username}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-yellow-500 mb-2">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>
                <p className="text-sm sm:text-base text-gray-700">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingsAndReviews;
