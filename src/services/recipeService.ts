import axios from "axios";
import { Recipe, RecipeFormData, Review } from "../interfaces/Recipe";
import { Favorite } from "../interfaces/Favorite";

const API_URL = "http://localhost:3001";

export const recipeService = {
  getRecipes: async (userId: string): Promise<Recipe[]> => {
    const response = await axios.get(`${API_URL}/recipes?userId=${userId}`);
    return response.data;
  },

  getRecipe: async (id: string): Promise<Recipe> => {
    const response = await axios.get(`${API_URL}/recipes/${id}`);
    return response.data;
  },

  createRecipe: async (
    userId: string,
    recipeData: RecipeFormData
  ): Promise<Recipe> => {
    const newRecipe = {
      userId,
      ...recipeData,
      ingredients: recipeData.ingredients.split(",").map((i) => i.trim()),
      averageRating: 0,
      reviews: [],
    };
    const response = await axios.post(`${API_URL}/recipes`, newRecipe);
    return response.data;
  },

  updateRecipe: async (
    id: string,
    recipeData: Partial<Recipe>
  ): Promise<Recipe> => {
    const response = await axios.patch(`${API_URL}/recipes/${id}`, recipeData);
    return response.data;
  },

  deleteRecipe: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/recipes/${id}`);
  },

  addReview: async (review: Review): Promise<Recipe> => {
    const recipe = await recipeService.getRecipe(review.recipeId);
    if (!recipe) {
      throw new Error("Recipe not found");
    }
    if (!recipe.reviews) {
      recipe.reviews = [];
    }
    recipe.reviews.push(review);
    recipe.averageRating =
      recipe.reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) /
      recipe.reviews.length;

    const updatedRecipe = await recipeService.updateRecipe(recipe.id, {
      reviews: recipe.reviews,
      averageRating: recipe.averageRating,
    });

    return updatedRecipe;
  },

  toggleFavorite: async (recipeId: string): Promise<Recipe> => {
    const response = await axios.patch(
      `${API_URL}/recipes/${recipeId}/favorite`
    );
    return response.data;
  },

  getAllRecipes: async (): Promise<Recipe[]> => {
    const response = await axios.get(`${API_URL}/recipes`);
    return response.data;
  },

  deleteUserRecipes: async (userId: string): Promise<void> => {
    const recipes = await recipeService.getRecipes(userId);
    for (const recipe of recipes) {
      await recipeService.deleteRecipe(recipe.id);
    }
  },
};
