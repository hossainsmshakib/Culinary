import React, { useState } from "react";
import { User } from "../../interfaces/User";
import { FaTrash, FaSearch, FaUser, FaEnvelope, FaBook } from "react-icons/fa";

interface UserListProps {
  users: User[];
  getUserRecipeCount: (userId: string) => number;
  onDeleteUser: (userId: string) => void;
}

const UserList: React.FC<UserListProps> = ({
  users,
  getUserRecipeCount,
  onDeleteUser,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4 bg-green-500">
        <h2 className="text-xl font-semibold text-white mb-3 text-center">
          User Management
        </h2>
      </div>
      <div className="p-4">
        <div className="relative max-w-md mx-auto mb-4">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full p-2 pl-10 pr-4 bg-green-50 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 placeholder-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-black" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-green-200">
            <thead className="bg-green-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider"
                >
                  No.
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider"
                >
                  Recipes
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-green-200">
              {filteredUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className={(index + 1) % 2 === 0 ? "bg-green-50" : "bg-white"}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-black text-xs" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {user.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaEnvelope className="text-black mr-2 text-xs" />
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <FaBook className="text-black mr-2 text-xs" />
                      <div className="text-sm text-gray-500">
                        {getUserRecipeCount(user.id)}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                    <button
                      onClick={() => onDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900 transition-colors duration-150"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
