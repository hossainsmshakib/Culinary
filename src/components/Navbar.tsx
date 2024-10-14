import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { User } from "../interfaces/User";
import { FaUtensils, FaUserCog, FaBars, FaTimes } from "react-icons/fa";

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/recipes" className="flex items-center">
              <img
                src="/favicon.png"
                alt="Recipe App Logo"
                className="h-8 w-8 mr-2"
              />
              <span className="text-lg font-semibold text-gray-800">
                RecipeApp
              </span>
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link
              to="/recipes"
              className={`${
                isActive("/recipes")
                  ? "text-green-600"
                  : "text-gray-600 hover:text-green-600"
              } flex items-center text-sm font-medium transition duration-150 ease-in-out`}
            >
              <FaUtensils className="mr-1" />
              Recipes
            </Link>
            {user.isAdmin && (
              <Link
                to="/admin"
                className={`${
                  isActive("/admin")
                    ? "text-green-600"
                    : "text-gray-600 hover:text-green-600"
                } flex items-center text-sm font-medium transition duration-150 ease-in-out`}
              >
                <FaUserCog className="mr-1" />
                Admin
              </Link>
            )}
            <span className="text-sm text-gray-600">{user.username}</span>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 px-4 rounded-full transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/recipes"
              className={`${
                isActive("/recipes")
                  ? "text-green-600"
                  : "text-gray-600 hover:text-green-600"
              } block px-3 py-2 rounded-md text-base font-medium`}
              onClick={() => setIsMenuOpen(false)}
            >
              <FaUtensils className="inline-block mr-2" />
              Recipes
            </Link>
            {user.isAdmin && (
              <Link
                to="/admin"
                className={`${
                  isActive("/admin")
                    ? "text-green-600"
                    : "text-gray-600 hover:text-green-600"
                } block px-3 py-2 rounded-md text-base font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                <FaUserCog className="inline-block mr-2" />
                Admin
              </Link>
            )}
            <span className="block px-3 py-2 text-base font-medium text-gray-600">
              {user.username}
            </span>
            <button
              onClick={() => {
                onLogout();
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-red-500 hover:bg-red-600 transition duration-150 ease-in-out"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
