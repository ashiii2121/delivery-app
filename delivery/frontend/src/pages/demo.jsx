import React, { useState, useEffect } from "react";
import RestaurantCard from "../components/RestaurantCard";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

const InteractiveRestaurantApp = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("");
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.RESTAURANTS, {
          params: {
            q: searchQuery,
            cuisine: cuisineFilter || undefined,
          },
        });
        setFeaturedRestaurants(response.data.restaurants || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [searchQuery, cuisineFilter]);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-red-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Order Food Online
          </h1>
          <p className="text-xl mb-8">
            Discover the best restaurants in your city
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="flex">
              <input
                type="text"
                placeholder="Search for restaurants or cuisines..."
                className="flex-grow px-4 py-3 rounded-l-lg text-gray-800 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-white text-red-600 px-6 py-3 rounded-r-lg font-semibold hover:bg-gray-100">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Restaurants */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Featured Restaurants</h2>
          <div>
            <select
              className="border rounded px-3 py-2"
              value={cuisineFilter}
              onChange={(e) => setCuisineFilter(e.target.value)}
            >
              <option value="">All Cuisines</option>
              <option value="Biryani">Biryani</option>
              <option value="Pizza">Pizza</option>
              <option value="Burger">Burger</option>
              <option value="North Indian">North Indian</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center">Loading restaurants...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveRestaurantApp;
