import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

const AddMealModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    veg: true,
    image: "",
    categoryId: "",
    restaurantId: "",
  });
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch categories and restaurants when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchRestaurants();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.MENU}/categories`);
      setCategories(response.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.RESTAURANTS);
      setRestaurants(response.data.restaurants || []);
    } catch (err) {
      console.error("Failed to fetch restaurants:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const mealData = {
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        veg: formData.veg,
        image: formData.image || "https://via.placeholder.com/200",
        categoryId: parseInt(formData.categoryId),
        restaurantId: parseInt(formData.restaurantId),
      };

      const response = await axios.post(
        `${API_ENDPOINTS.MENU}/items`,
        mealData
      );
      onAdd(response.data);
      onClose();

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        veg: true,
        image: "",
        categoryId: "",
        restaurantId: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add meal");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Add New Meal</h3>
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
              Meal Name
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
              Price (₹)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              min="1"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Image URL
            </label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="https://via.placeholder.com/200"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Category
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Restaurant
            </label>
            <select
              name="restaurantId"
              value={formData.restaurantId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="">Select a restaurant</option>
              {restaurants.map((restaurant) => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="veg"
                checked={formData.veg}
                onChange={handleChange}
                className="rounded border-gray-300 text-red-600 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-gray-700">Vegetarian</span>
            </label>
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
              {loading ? "Adding..." : "Add Meal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMealModal;
