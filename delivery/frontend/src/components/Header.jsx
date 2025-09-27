import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-purple-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
        DELIVERY
        </Link>

        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-purple-200">
            Home
          </Link>
          <Link to="/restaurants" className="hover:text-purple-200">
            Restaurants
          </Link>
          <Link to="/cart" className="hover:text-purple-200">
            Cart
          </Link>
          {isAuthenticated && (
            <Link to="/profile" className="hover:text-purple-200">
              Profile
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="hover:text-purple-200">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-white text-purple-600 px-4 py-2 rounded-full font-semibold hover:bg-red-100"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-white text-purple-600 px-4 py-2 rounded-full font-semibold hover:bg-red-100"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
