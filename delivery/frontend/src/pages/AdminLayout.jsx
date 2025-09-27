import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Restaurants", href: "/admin/restaurants", icon: "🏪" },
    { name: "Meals", href: "/admin/meals", icon: "🍽️" },
    { name: "Customers", href: "/admin/customers", icon: "👥" },
    { name: "Delivery Partners", href: "/admin/delivery-partners", icon: "🚴" },
    { name: "Orders", href: "/admin/orders", icon: "📦" },
    { name: "Payments", href: "/admin/payments", icon: "💰" },
    { name: "Reviews", href: "/admin/reviews", icon: "⭐" },
    { name: "Promotions", href: "/admin/promotions", icon: "🎉" },
    { name: "Reports", href: "/admin/reports", icon: "📈" },
    { name: "Settings", href: "/admin/settings", icon: "⚙️" },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-red-700 text-white transition-transform duration-300 ease-in-out transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-center h-16 bg-red-800">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <nav className="mt-5 px-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-3 mt-1 text-base font-medium rounded-lg transition-colors duration-200 ${
                isActive(item.href)
                  ? "bg-red-900 text-white"
                  : "text-red-100 hover:bg-red-600 hover:text-white"
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 focus:outline-none lg:hidden"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
            <h2 className="ml-4 text-xl font-semibold text-gray-800">
              {navigation.find((item) => isActive(item.href))?.name ||
                "Admin Panel"}
            </h2>
          </div>
          <div className="flex items-center">
            <button className="p-1 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                ></path>
              </svg>
            </button>
            <div className="relative ml-3">
              <div className="flex items-center">
                <button className="flex text-sm rounded-full focus:outline-none">
                  <img
                    className="w-8 h-8 rounded-full"
                    src="https://via.placeholder.com/150"
                    alt="Admin"
                  />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;
