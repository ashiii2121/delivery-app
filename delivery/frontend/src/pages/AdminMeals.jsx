import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { API_ENDPOINTS } from "../config/api";
import AddMealModal from "../components/AddMealModal";

const AdminMeals = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [mealsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchMeals();
    }
  }, [token]);

  const fetchMeals = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.MENU}/items`);
      setMeals(response.data.menuItems || []);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch meals");
      setLoading(false);
    }
  };

  // Filter meals based on search term
  const filteredMeals = meals.filter(
    (meal) =>
      meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (meal.description &&
        meal.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get current meals for pagination
  const indexOfLastMeal = currentPage * mealsPerPage;
  const indexOfFirstMeal = indexOfLastMeal - mealsPerPage;
  const currentMeals = filteredMeals.slice(indexOfFirstMeal, indexOfLastMeal);
  const totalPages = Math.ceil(filteredMeals.length / mealsPerPage);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this meal?")) {
      try {
        await axios.delete(`${API_ENDPOINTS.MENU}/items/${id}`);
        fetchMeals(); // Refresh the list
      } catch (err) {
        setError("Failed to delete meal");
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">Loading meals...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Meals Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700"
        >
          Add New Meal
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search meals..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Meals Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Meal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Restaurant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentMeals.map((meal) => (
              <tr key={meal._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={meal.image || "https://via.placeholder.com/150"}
                        alt={meal.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {meal.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {meal.description || "No description"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {meal.restaurant?.name || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ₹{meal.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {meal.category?.name || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-red-600 hover:text-red-900 mr-3">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(meal.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Showing {indexOfFirstMeal + 1} to{" "}
            {Math.min(indexOfLastMeal, filteredMeals.length)} of{" "}
            {filteredMeals.length} meals
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === i + 1
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      <AddMealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={fetchMeals}
      />
    </div>
  );
};

export default AdminMeals;
