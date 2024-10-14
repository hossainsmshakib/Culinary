import React from "react";

interface StatisticsProps {
  userCount: number;
  recipeCount: number;
}

const Statistics: React.FC<StatisticsProps> = ({ userCount, recipeCount }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-2">Statistics</h2>
      <p>Total Users: {userCount}</p>
      <p>Total Recipes: {recipeCount}</p>
    </div>
  );
};

export default Statistics;
