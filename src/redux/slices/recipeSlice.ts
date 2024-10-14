import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Recipe, Review } from "../../interfaces/Recipe";
import { recipeService } from "../../services/recipeService";

interface RecipeState {
  recipes: Recipe[];
  currentRecipe: Recipe | null;
  searchTerm: string;
  filterCategory: string;
}

const initialState: RecipeState = {
  recipes: [],
  currentRecipe: null,
  searchTerm: "",
  filterCategory: "",
};

export const addReviewAsync = createAsyncThunk(
  "recipe/addReviewAsync",
  async (review: Review) => {
    const updatedRecipe = await recipeService.addReview(review);
    return updatedRecipe;
  }
);

const recipeSlice = createSlice({
  name: "recipe",
  initialState,
  reducers: {
    setRecipes: (state, action: PayloadAction<Recipe[]>) => {
      state.recipes = action.payload.map((recipe) => ({
        ...recipe,
        reviews: recipe.reviews || [],
      }));
    },
    setCurrentRecipe: (state, action: PayloadAction<Recipe>) => {
      state.currentRecipe = {
        ...action.payload,
        reviews: action.payload.reviews || [],
      };
    },
    addRecipe: (state, action: PayloadAction<Recipe>) => {
      state.recipes.push({
        ...action.payload,
        reviews: [],
      });
    },
    updateRecipe: (state, action: PayloadAction<Recipe>) => {
      const index = state.recipes.findIndex(
        (recipe) => recipe.id === action.payload.id
      );
      if (index !== -1) {
        state.recipes[index] = {
          ...action.payload,
          reviews: action.payload.reviews || [],
        };
      }
      if (state.currentRecipe && state.currentRecipe.id === action.payload.id) {
        state.currentRecipe = {
          ...action.payload,
          reviews: action.payload.reviews || [],
        };
      }
    },
    deleteRecipe: (state, action: PayloadAction<string>) => {
      state.recipes = state.recipes.filter(
        (recipe) => recipe.id !== action.payload
      );
      if (state.currentRecipe && state.currentRecipe.id === action.payload) {
        state.currentRecipe = null;
      }
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setFilterCategory: (state, action: PayloadAction<string>) => {
      state.filterCategory = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<Recipe>) => {
      const index = state.recipes.findIndex(
        (recipe) => recipe.id === action.payload.id
      );
      if (index !== -1) {
        state.recipes[index] = action.payload;
      }
      if (state.currentRecipe && state.currentRecipe.id === action.payload.id) {
        state.currentRecipe = action.payload;
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(addReviewAsync.fulfilled, (state, action) => {
      const updatedRecipe = action.payload;
      const index = state.recipes.findIndex((r) => r.id === updatedRecipe.id);
      if (index !== -1) {
        state.recipes[index] = updatedRecipe;
      }
      if (state.currentRecipe && state.currentRecipe.id === updatedRecipe.id) {
        state.currentRecipe = updatedRecipe;
      }
    });
  },
});

export const {
  setRecipes,
  setCurrentRecipe,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  setSearchTerm,
  setFilterCategory,
  toggleFavorite,
} = recipeSlice.actions;

export default recipeSlice.reducer;
