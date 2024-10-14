import React from "react";
import RecipeList from "../components/recipes/RecipeList";

const RecipePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <RecipeList />
    </div>
  );
};

export default RecipePage;
