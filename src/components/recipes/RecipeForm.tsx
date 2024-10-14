import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  RecipeFormData,
  Recipe,
  RecipeCategory,
} from "../../interfaces/Recipe";
import { addRecipe, updateRecipe } from "../../redux/slices/recipeSlice";
import { recipeService } from "../../services/recipeService";
import { RootState } from "../../redux/store";
import {
  FaUtensils,
  FaList,
  FaClock,
  FaImage,
  FaEdit,
  FaPlus,
} from "react-icons/fa";

interface RecipeFormProps {
  initialData?: Recipe;
  onSubmit: () => void;
}

const categories: RecipeCategory[] = ["Breakfast", "Lunch", "Snacks", "Dinner"];

const RecipeForm: React.FC<RecipeFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState<RecipeFormData>({
    title: "",
    category: "" as RecipeCategory,
    ingredients: "",
    instructions: "",
    image: null,
    preparationTime: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user.currentUser?.id);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        ingredients: initialData.ingredients.join(", "),
      });
      setImagePreview(initialData.image);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData({ ...formData, image: base64String });
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!userId) {
      setError("User not authenticated");
      return;
    }

    if (!formData.category) {
      setError("Please select a category");
      return;
    }

    try {
      const preparedData = {
        ...formData,
        ingredients: formData.ingredients.split(",").map((item) => item.trim()),
      };

      if (initialData) {
        const updatedRecipe = await recipeService.updateRecipe(
          initialData.id,
          preparedData
        );
        dispatch(updateRecipe(updatedRecipe));
      } else {
        const newRecipe = await recipeService.createRecipe(userId, {
          ...preparedData,
          ingredients: preparedData.ingredients.join(", "),
        });
        dispatch(addRecipe(newRecipe));
      }
      onSubmit();
    } catch (err) {
      setError("Failed to save recipe. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl max-w-2xl mx-auto"
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 flex items-center justify-center">
        <FaUtensils className="mr-2 text-gray-400" />
        {initialData ? "Edit Recipe" : "Create New Recipe"}
      </h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
          placeholder="Enter recipe title"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="category"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label
          htmlFor="ingredients"
          className="block text-lg font-medium text-gray-700 mb-2 flex items-center"
        >
          <FaList className="mr-2 text-gray-400" />
          Ingredients
        </label>
        <textarea
          id="ingredients"
          name="ingredients"
          value={formData.ingredients}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
          rows={4}
          placeholder="Enter ingredients, separated by commas"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="instructions"
          className="block text-lg font-medium text-gray-700 mb-2 flex items-center"
        >
          <FaList className="mr-2 text-gray-400" />
          Instructions
        </label>
        <textarea
          id="instructions"
          name="instructions"
          value={formData.instructions}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
          rows={6}
          placeholder="Enter cooking instructions"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="image"
          className="block text-lg font-medium text-gray-700 mb-2 flex items-center"
        >
          <FaImage className="mr-2 text-gray-400" />
          Image
        </label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleFileChange}
          accept="image/*"
          className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-2 h-32 w-auto object-cover rounded-md"
          />
        )}
      </div>

      <div className="mb-6">
        <label
          htmlFor="preparationTime"
          className="block text-lg font-medium text-gray-700 mb-2 flex items-center"
        >
          <FaClock className="mr-2 text-gray-400" />
          Preparation Time (minutes)
        </label>
        <input
          type="number"
          id="preparationTime"
          name="preparationTime"
          value={formData.preparationTime}
          onChange={handleChange}
          required
          min="0"
          className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
          placeholder="Enter preparation time in minutes"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-full hover:bg-green-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center justify-center"
      >
        {initialData ? (
          <FaEdit className="mr-2" />
        ) : (
          <FaPlus className="mr-2" />
        )}
        {initialData ? "Update Recipe" : "Create Recipe"}
      </button>
    </form>
  );
};

export default RecipeForm;
