import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Menu, X, ShoppingCart } from "lucide-react";

const Header = () => {
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-purple-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          DELIVERY
        </Link>

        {/* Mobile icons - Cart icon and menu button */}
        <div className="md:hidden flex items-center space-x-4">
          <Link to="/cart" className="text-white hover:text-purple-200">
            <ShoppingCart size={24} />
          </Link>
          <button
            className="text-white focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-purple-200">
            Home
          </Link>
          <Link to="/restaurants" className="hover:text-purple-200">
            Restaurants
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

        <div className="hidden md:flex items-center space-x-4">
          {/* Cart icon */}
          <Link to="/cart" className="hover:text-purple-200">
            <ShoppingCart size={24} />
          </Link>

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

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-purple-700 py-4 px-4">
          <div className="flex flex-col space-y-3">
            <Link
              to="/"
              className="hover:text-purple-200 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/restaurants"
              className="hover:text-purple-200 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Restaurants
            </Link>
            {isAuthenticated && (
              <Link
                to="/profile"
                className="hover:text-purple-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="hover:text-purple-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            <div className="pt-2">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-white text-purple-600 px-4 py-2 rounded-full font-semibold hover:bg-red-100 w-full"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="bg-white text-purple-600 px-4 py-2 rounded-full font-semibold hover:bg-red-100 block text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
