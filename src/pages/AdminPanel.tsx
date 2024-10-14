import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { User } from "../interfaces/User";
import { Recipe } from "../interfaces/Recipe";
import { authService } from "../services/authService";
import { recipeService } from "../services/recipeService";
import UserList from "../components/admin/UserList";
import { FaUsers, FaBook, FaChartBar } from "react-icons/fa";

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedUsers = await authService.getAllUsers();
      const fetchedRecipes = await recipeService.getAllRecipes();
      setUsers(fetchedUsers);
      setRecipes(fetchedRecipes);
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    await authService.deleteUser(userId);
    await recipeService.deleteUserRecipes(userId);
    setUsers(users.filter((user) => user.id !== userId));
    setRecipes(recipes.filter((recipe) => recipe.userId !== userId));
  };

  const getUserRecipeCount = (userId: string) => {
    return recipes.filter((recipe) => recipe.userId === userId).length;
  };

  if (!currentUser || !currentUser.isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center p-8 bg-gray-100 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            Admin rights required to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 border-b pb-4">
        Admin Panel
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={users.length}
          icon={<FaUsers />}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Recipes"
          value={recipes.length}
          icon={<FaBook />}
          color="bg-green-500"
        />
        <StatCard
          title="Avg Recipes/User"
          value={
            users.length ? (recipes.length / users.length).toFixed(1) : "0"
          }
          icon={<FaChartBar />}
          color="bg-purple-500"
        />
      </div>
      <UserList
        users={users}
        getUserRecipeCount={getUserRecipeCount}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <div className={`${color} rounded-lg shadow-lg p-6 text-white`}>
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-medium">{title}</h2>
      <span className="text-3xl">{icon}</span>
    </div>
    <p className="text-4xl font-bold mt-4">{value}</p>
  </div>
);

export default AdminPanel;
