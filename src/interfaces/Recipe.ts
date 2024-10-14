export type RecipeCategory = "Breakfast" | "Lunch" | "Snacks" | "Dinner";

export interface Review {
  id: string;
  userId: string;
  username: string;
  recipeId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Recipe {
  id: string;
  userId: string;
  title: string;
  category: RecipeCategory;
  ingredients: string[];
  instructions: string;
  image: string | null;
  preparationTime: number;
  averageRating: number;
  reviews: Review[];
  favorite: boolean;
}

export interface RecipeFormData {
  title: string;
  category: RecipeCategory;
  ingredients: string;
  instructions: string;
  image: string | null;
  preparationTime: number;
}
