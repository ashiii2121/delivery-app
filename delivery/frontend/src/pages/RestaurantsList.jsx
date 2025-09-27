import React, { useState, useEffect } from "react";
import RestaurantCard from "../components/RestaurantCard";
import axios from "axios";

const API_URL = "http://localhost:5000/api/restaurants";

const RestaurantsList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("");
  const [sortOption, setSortOption] = useState("rating");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(API_URL, {
          params: {
            q: searchQuery,
            cuisine: cuisineFilter || undefined,
          },
        });
        setRestaurants(response.data.restaurants);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [searchQuery, cuisineFilter]);

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.some((c) =>
        c.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCuisine =
      !cuisineFilter || restaurant.cuisine.includes(cuisineFilter);

    return matchesSearch && matchesCuisine;
  });

  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    if (sortOption === "rating") {
      return b.rating - a.rating;
    } else if (sortOption === "deliveryTime") {
      return a.avgDeliveryTime - b.avgDeliveryTime;
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading restaurants...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Restaurants</h1>

      {/* Filters */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search restaurants or cuisines..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={cuisineFilter}
              onChange={(e) => setCuisineFilter(e.target.value)}
            >
              <option value="">All Cuisines</option>
              <option value="Biryani">Biryani</option>
              <option value="Pizza">Pizza</option>
              <option value="Burger">Burger</option>
              <option value="North Indian">North Indian</option>
              <option value="Fast Food">Fast Food</option>
              <option value="Italian">Italian</option>
            </select>
          </div>

          <div>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="rating">Sort by Rating</option>
              <option value="deliveryTime">Sort by Delivery Time</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Restaurant List */}
      {sortedRestaurants.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No restaurants found matching your criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantsList;
