import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../redux/store";
import {
  setRecipes,
  deleteRecipe,
  toggleFavorite,
} from "../../redux/slices/recipeSlice";
import { recipeService } from "../../services/recipeService";
import { Recipe } from "../../interfaces/Recipe";
import RecipeForm from "./RecipeForm";
import SearchAndFilter from "./SearchAndFilter";
import {
  FaPlus,
  FaUtensils,
  FaStar,
  FaEdit,
  FaTrash,
  FaHeart,
} from "react-icons/fa";

const RecipeList: React.FC = () => {
  const dispatch = useDispatch();
  const recipes = useSelector((state: RootState) => state.recipe.recipes);
  const searchTerm = useSelector((state: RootState) => state.recipe.searchTerm);
  const filterCategory = useSelector(
    (state: RootState) => state.recipe.filterCategory
  );
  const userId = useSelector((state: RootState) => state.user.currentUser?.id);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (userId) {
      const fetchRecipes = async () => {
        const fetchedRecipes = await recipeService.getRecipes(userId);
        dispatch(setRecipes(fetchedRecipes));
      };
      fetchRecipes();
    }
  }, [dispatch, userId]);

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        await recipeService.deleteRecipe(id);
        dispatch(deleteRecipe(id));
      } catch (error) {
        console.error("Failed to delete recipe:", error);
      }
    }
  };

  const handleEditSubmit = () => {
    setEditingRecipe(null);
    if (userId) {
      recipeService.getRecipes(userId).then((fetchedRecipes) => {
        dispatch(setRecipes(fetchedRecipes));
      });
    }
  };

  const handleCreateSubmit = () => {
    setIsCreating(false);
    if (userId) {
      recipeService.getRecipes(userId).then((fetchedRecipes) => {
        dispatch(setRecipes(fetchedRecipes));
      });
    }
  };

  const handleFavorite = async (recipeId: string) => {
    try {
      const updatedRecipe = await recipeService.toggleFavorite(recipeId);
      dispatch(toggleFavorite(updatedRecipe));
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      recipe.preparationTime.toString().includes(searchTerm);

    const matchesCategory = filterCategory
      ? recipe.category === filterCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Your Culinary Collection
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore, create, and savor your personal recipe treasury
          </p>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center">
          <SearchAndFilter />
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition duration-300 ease-in-out flex items-center shadow-md mt-4 sm:mt-0"
            >
              <FaPlus className="mr-2" />
              Create New Recipe
            </button>
          )}
        </div>

        {isCreating && (
          <div className="bg-white rounded-lg p-6 mb-8 shadow-lg">
            <RecipeForm onSubmit={handleCreateSubmit} />
            <button
              onClick={() => setIsCreating(false)}
              className="mt-6 w-full md:w-auto bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition duration-300 ease-in-out"
            >
              Cancel
            </button>
          </div>
        )}

        {editingRecipe && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
            id="my-modal"
          >
            <div className="relative top-20 mx-auto p-5 border w-full max-w-xl rounded-lg bg-white shadow-xl">
              <RecipeForm
                initialData={editingRecipe}
                onSubmit={handleEditSubmit}
              />
              <button
                onClick={() => setEditingRecipe(null)}
                className="mt-4 w-full inline-flex justify-center rounded-full border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white overflow-hidden rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 border-gray-200 border-2"
            >
              <div className="relative">
                {recipe.image ? (
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-56 object-cover"
                  />
                ) : (
                  <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                    <FaUtensils className="text-5xl text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow">
                  <FaUtensils className="text-xl text-gray-600" />
                </div>
                <button
                  onClick={() => handleFavorite(recipe.id)}
                  className="absolute top-2 left-2 bg-white rounded-full p-2 shadow transition duration-300 ease-in-out hover:bg-gray-100"
                >
                  <FaHeart
                    className={`text-xl ${
                      recipe.favorite ? "text-red-500" : "text-gray-400"
                    }`}
                  />
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {recipe.title}
                </h3>
                <div className="flex items-center mb-4">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="text-sm text-gray-600">
                    {recipe.averageRating !== undefined
                      ? recipe.averageRating.toFixed(1)
                      : "No ratings"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <Link
                    to={`/recipe/${recipe.id}`}
                    className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300 ease-in-out text-sm shadow"
                  >
                    View Details
                  </Link>
                  <div>
                    <button
                      onClick={() => handleEdit(recipe)}
                      className="mr-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 ease-in-out shadow"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(recipe.id)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300 ease-in-out shadow"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <FaUtensils className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">
              No recipes found. Try adjusting your search or filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeList;
