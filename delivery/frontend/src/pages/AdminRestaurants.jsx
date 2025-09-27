import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { API_ENDPOINTS } from "../config/api";
import AddRestaurantModal from "../components/AddRestaurantModal";

const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [restaurantsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchRestaurants();
    }
  }, [token]);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.RESTAURANTS);
      setRestaurants(response.data.restaurants || []);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch restaurants");
      setLoading(false);
    }
  };

  // Filter restaurants based on search term
  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (restaurant.cuisine &&
        restaurant.cuisine.some((c) =>
          c.toLowerCase().includes(searchTerm.toLowerCase())
        ))
  );

  // Get current restaurants for pagination
  const indexOfLastRestaurant = currentPage * restaurantsPerPage;
  const indexOfFirstRestaurant = indexOfLastRestaurant - restaurantsPerPage;
  const currentRestaurants = filteredRestaurants.slice(
    indexOfFirstRestaurant,
    indexOfLastRestaurant
  );
  const totalPages = Math.ceil(filteredRestaurants.length / restaurantsPerPage);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      try {
        await axios.delete(`${API_ENDPOINTS.RESTAURANTS}/${id}`);
        fetchRestaurants(); // Refresh the list
      } catch (err) {
        setError("Failed to delete restaurant");
      }
    }
  };

  const handleApprove = async (id) => {
    // In a real app, this would call an API to approve the restaurant
    alert(`Restaurant ${id} approved!`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">Loading restaurants...</div>
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
        <h2 className="text-2xl font-bold text-gray-800">
          Restaurant Management
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700"
        >
          Add New Restaurant
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search restaurants..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Restaurants Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Restaurant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cuisine
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Delivery Time
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
            {currentRestaurants.map((restaurant) => (
              <tr key={restaurant._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={
                          restaurant.images && restaurant.images.length > 0
                            ? restaurant.images[0]
                            : "https://via.placeholder.com/150"
                        }
                        alt={restaurant.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {restaurant.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {restaurant.address}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {restaurant.cuisine && restaurant.cuisine.join(", ")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {restaurant.rating || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {restaurant.avgDeliveryTime
                    ? `${restaurant.avgDeliveryTime} mins`
                    : "N/A"}
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
                    onClick={() => handleDelete(restaurant.id)}
                    className="text-red-600 hover:text-red-900 mr-3"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleApprove(restaurant.id)}
                    className="text-green-600 hover:text-green-900"
                  >
                    Approve
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
            Showing {indexOfFirstRestaurant + 1} to{" "}
            {Math.min(indexOfLastRestaurant, filteredRestaurants.length)} of{" "}
            {filteredRestaurants.length} restaurants
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

      <AddRestaurantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={fetchRestaurants}
      />
    </div>
  );
};

export default AdminRestaurants;
