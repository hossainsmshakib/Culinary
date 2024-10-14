import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { FaUtensils } from "react-icons/fa";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.currentUser);

  useEffect(() => {
    if (user) {
      navigate("/recipes");
    }
  }, [user, navigate]);

  const handleAuthSuccess = () => {
    navigate("/recipes");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <FaUtensils className="h-12 w-12 text-green-500" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? "Welcome back" : "Create your account"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin
              ? "Sign in to access your recipes"
              : "Join us to start your culinary journey"}
          </p>
        </div>
        {isLogin ? (
          <LoginForm onSuccess={handleAuthSuccess} />
        ) : (
          <SignupForm onSuccess={handleAuthSuccess} />
        )}
        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-green-600 hover:text-green-500 transition duration-150 ease-in-out"
          >
            {isLogin
              ? "Need an account? Sign up"
              : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
