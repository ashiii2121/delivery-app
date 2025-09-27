import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { API_ENDPOINTS } from "../config/api";

const AdminPromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [promotionsPerPage] = useState(10);
  const [typeFilter, setTypeFilter] = useState("all");
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchPromotions();
    }
  }, [token]);

  const fetchPromotions = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.PROMOTIONS);
      setPromotions(response.data.promotions || []);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch promotions");
      setLoading(false);
    }
  };

  // Filter promotions based on search term and type
  const filteredPromotions = promotions.filter((promotion) => {
    const matchesSearch =
      promotion.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (promotion.description &&
        promotion.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter === "all" || promotion.type === typeFilter;

    return matchesSearch && matchesType;
  });

  // Get current promotions for pagination
  const indexOfLastPromotion = currentPage * promotionsPerPage;
  const indexOfFirstPromotion = indexOfLastPromotion - promotionsPerPage;
  const currentPromotions = filteredPromotions.slice(
    indexOfFirstPromotion,
    indexOfLastPromotion
  );
  const totalPages = Math.ceil(filteredPromotions.length / promotionsPerPage);

  const handleDelete = async (promotionId) => {
    if (window.confirm("Are you sure you want to delete this promotion?")) {
      try {
        // In a real app, this would call an API to delete the promotion
        alert(`Promotion ${promotionId} deleted!`);
        fetchPromotions(); // Refresh the list
      } catch (err) {
        setError("Failed to delete promotion");
      }
    }
  };

  const handleToggleStatus = async (promotionId, currentStatus) => {
    try {
      // In a real app, this would call an API to toggle the promotion status
      alert(
        `Promotion ${promotionId} status changed to ${
          currentStatus ? "inactive" : "active"
        }!`
      );
      fetchPromotions(); // Refresh the list
    } catch (err) {
      setError("Failed to update promotion status");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">Loading promotions...</div>
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
          Promotions & Discounts
        </h2>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700">
          Create New Promotion
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search promotions..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="coupon">Coupon</option>
          <option value="discount">Discount</option>
          <option value="offer">Offer</option>
        </select>
      </div>

      {/* Promotions Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Discount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Validity
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
            {currentPromotions.map((promotion) => (
              <tr key={promotion._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {promotion.code}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                  <div className="truncate max-w-xs">
                    {promotion.description || "No description"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {promotion.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {promotion.type === "percentage"
                    ? `${promotion.value}%`
                    : `₹${promotion.value}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(promotion.startDate).toLocaleDateString()} -{" "}
                  {new Date(promotion.endDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      promotion.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {promotion.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() =>
                      handleToggleStatus(promotion._id, promotion.isActive)
                    }
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    {promotion.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleDelete(promotion._id)}
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
            Showing {indexOfFirstPromotion + 1} to{" "}
            {Math.min(indexOfLastPromotion, filteredPromotions.length)} of{" "}
            {filteredPromotions.length} promotions
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
    </div>
  );
};

export default AdminPromotions;
