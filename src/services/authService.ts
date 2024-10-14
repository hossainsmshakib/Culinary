import axios from "axios";
import { User, UserCredentials } from "../interfaces/User";

const API_URL = "http://localhost:3001";

export const authService = {
  signup: async (
    credentials: UserCredentials & { email: string }
  ): Promise<User> => {
    try {
      const existingUsername = await axios.get(
        `${API_URL}/users?username=${credentials.username}`
      );
      if (existingUsername.data.length > 0) {
        throw new Error("Username already exists");
      }

      const existingEmail = await axios.get(
        `${API_URL}/users?email=${credentials.email}`
      );
      if (existingEmail.data.length > 0) {
        throw new Error("Email already exists");
      }

      const response = await axios.post(`${API_URL}/users`, {
        ...credentials,
        id: Date.now().toString(),
        isAdmin: true, // Set default value for new users to true
      });
      const { password, ...user } = response.data;
      return user;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error("Network error. Please try again.");
      }
      throw error;
    }
  },

  login: async (credentials: UserCredentials): Promise<User | null> => {
    try {
      const response = await axios.get(
        `${API_URL}/users?username=${credentials.username}`
      );
      if (response.data.length > 0) {
        const user = response.data[0];
        if (user.password === credentials.password) {
          const { password, ...userWithoutPassword } = user;
          return {
            ...userWithoutPassword,
            isAdmin: user.isAdmin !== undefined ? user.isAdmin : true,
          };
        }
      }
      return null;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error("Network error. Please try again.");
      }
      throw error;
    }
  },

  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      return response.data.map(({ password, ...user }: any) => ({
        ...user,
        isAdmin: user.isAdmin !== undefined ? user.isAdmin : true,
      }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error("Network error. Please try again.");
      }
      throw error;
    }
  },

  deleteUser: async (userId: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/users/${userId}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error("Network error. Please try again.");
      }
      throw error;
    }
  },

  setUserInLocalStorage: (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
  },

  getUserFromLocalStorage: (): User | null => {
    const userString = localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  },

  removeUserFromLocalStorage: () => {
    localStorage.removeItem("user");
  },
};
