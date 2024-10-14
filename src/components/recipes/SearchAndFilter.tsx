import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearchTerm,
  setFilterCategory,
} from "../../redux/slices/recipeSlice";
import { RecipeCategory } from "../../interfaces/Recipe";
import { FaSearch, FaFilter } from "react-icons/fa";
import { RootState } from "../../redux/store";

const categories: RecipeCategory[] = ["Breakfast", "Lunch", "Snacks", "Dinner"];

const SearchAndFilter: React.FC = () => {
  const dispatch = useDispatch();
  const searchTerm = useSelector((state: RootState) => state.recipe.searchTerm);
  const filterCategory = useSelector(
    (state: RootState) => state.recipe.filterCategory
  );

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [localFilterCategory, setLocalFilterCategory] =
    useState(filterCategory);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    setLocalFilterCategory(filterCategory);
  }, [filterCategory]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setLocalSearchTerm(newSearchTerm);
    dispatch(setSearchTerm(newSearchTerm));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilterCategory = e.target.value as RecipeCategory | "";
    setLocalFilterCategory(newFilterCategory);
    dispatch(setFilterCategory(newFilterCategory));
  };

  return (
    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Search recipes..."
          value={localSearchTerm}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      <div className="relative w-full sm:w-48">
        <select
          value={localFilterCategory}
          onChange={handleFilterChange}
          className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-full appearance-none focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg
            className="w-4 h-4 fill-current text-gray-400"
            viewBox="0 0 20 20"
          >
            <path
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
              fillRule="evenodd"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;
