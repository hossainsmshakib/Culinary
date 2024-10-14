import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { recipeService } from "../services/recipeService";
import { setCurrentRecipe } from "../redux/slices/recipeSlice";
import RatingsAndReviews from "../components/recipes/RatingsAndReviews";
import { FaClock, FaStar, FaUtensils } from "react-icons/fa";

const RecipeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const recipe = useSelector((state: RootState) => state.recipe.currentRecipe);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (id) {
        try {
          const fetchedRecipe = await recipeService.getRecipe(id);
          dispatch(setCurrentRecipe(fetchedRecipe));
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch recipe:", error);
          setLoading(false);
        }
      }
    };

    fetchRecipe();
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold text-red-500">Recipe not found</h1>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="lg:flex">
            {/* Left side: Recipe details */}
            <div className="lg:w-2/3 p-6">
              <h1 className="text-3xl font-bold mb-4 text-black">
                {recipe.title}
              </h1>
              <p className="text-gray-600 mb-4">Category: {recipe.category}</p>

              {recipe.image ? (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-64 sm:h-96 object-cover rounded-lg mb-6"
                />
              ) : (
                <div className="w-full h-64 sm:h-96 bg-gray-100 flex items-center justify-center rounded-lg mb-6">
                  <FaUtensils className="text-gray-400 text-6xl" />
                </div>
              )}

              <div className="flex items-center mb-4 text-gray-700">
                <FaClock className="mr-2" />
                <span>{recipe.preparationTime} minutes</span>
                <FaStar className="ml-6 mr-2 text-yellow-400" />
                <span>
                  {recipe.averageRating !== undefined
                    ? recipe.averageRating.toFixed(1)
                    : "No ratings yet"}
                </span>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2 text-black">
                  Ingredients:
                </h2>
                <ul className="list-disc list-inside text-gray-700">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2 text-black">
                  Instructions:
                </h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {recipe.instructions}
                </p>
              </div>
            </div>

            {/* Right side: Ratings and Reviews */}
            <div className="lg:w-1/3 p-6 bg-gray-50">
              <h2 className="text-2xl font-bold mb-4 text-black">
                Ratings and Reviews
              </h2>
              <RatingsAndReviews
                recipeId={recipe.id}
                reviews={recipe.reviews}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
