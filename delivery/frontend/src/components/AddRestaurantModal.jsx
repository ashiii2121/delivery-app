import React, { useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

const AddRestaurantModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cuisine: "",
    address: "",
    avgDeliveryTime: "",
    costForTwo: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Convert cuisine to array
      const cuisineArray = formData.cuisine
        .split(",")
        .map((item) => item.trim());

      // Convert numeric fields
      const avgDeliveryTime = parseInt(formData.avgDeliveryTime);
      const costForTwo = parseInt(formData.costForTwo);

      const restaurantData = {
        name: formData.name,
        description: formData.description,
        cuisine: cuisineArray,
        address: formData.address,
        avgDeliveryTime: isNaN(avgDeliveryTime) ? 30 : avgDeliveryTime,
        costForTwo: isNaN(costForTwo) ? 500 : costForTwo,
        rating: 4.0,
        images: ["https://via.placeholder.com/300"],
        geo: {
          lat: 19.076,
          lng: 72.8777,
        },
      };

      const response = await axios.post(
        API_ENDPOINTS.RESTAURANTS,
        restaurantData
      );
      onAdd(response.data);
      onClose();

      // Reset form
      setFormData({
        name: "",
        description: "",
        cuisine: "",
        address: "",
        avgDeliveryTime: "",
        costForTwo: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add restaurant");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Add New Restaurant</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Restaurant Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              rows="3"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Cuisine (comma separated)
            </label>
            <input
              type="text"
              name="cuisine"
              value={formData.cuisine}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., Italian, Pizza, Pasta"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Avg Delivery Time (mins)
              </label>
              <input
                type="number"
                name="avgDeliveryTime"
                value={formData.avgDeliveryTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                min="1"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Cost for Two (₹)
              </label>
              <input
                type="number"
                name="costForTwo"
                value={formData.costForTwo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                min="1"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Restaurant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRestaurantModal;
