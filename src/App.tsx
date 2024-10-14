import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AuthPage from "./pages/AuthPage";
import RecipePage from "./pages/RecipePage";
import { RootState } from "./redux/store";
import { setUser, clearUser } from "./redux/slices/userSlice";
import RecipeDetails from "./pages/RecipeDetails";
import AdminPanel from "./pages/AdminPanel";
import { authService } from "./services/authService";
import Navbar from "./components/Navbar";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserValidity = async () => {
      try {
        const storedUser = authService.getUserFromLocalStorage();
        if (storedUser) {
          dispatch(setUser(storedUser));
        } else {
          dispatch(clearUser());
        }
      } catch (error) {
        console.error("Error checking user validity:", error);
        dispatch(clearUser());
      } finally {
        setIsLoading(false);
      }
    };

    checkUserValidity();
  }, [dispatch]);

  const handleLogout = () => {
    authService.removeUserFromLocalStorage();
    dispatch(clearUser());
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        <main className="flex-grow pt-4 sm:pt-10">
          {" "}
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route
                path="/"
                element={user ? <Navigate to="/recipes" /> : <AuthPage />}
              />
              <Route
                path="/recipes"
                element={user ? <RecipePage /> : <Navigate to="/" />}
              />
              <Route
                path="/recipe/:id"
                element={user ? <RecipeDetails /> : <Navigate to="/" />}
              />
              <Route
                path="/admin"
                element={
                  user && user.isAdmin ? <AdminPanel /> : <Navigate to="/" />
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
