import React from "react";
import { Link } from "react-router-dom";

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link
      to={`/restaurants/${restaurant.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="h-40 bg-gray-200">
        {restaurant.images && restaurant.images.length > 0 ? (
          <img
            src={restaurant.images[0]}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{restaurant.name}</h3>

        <div className="flex items-center mb-2">
          <span className="text-yellow-500 mr-1">★</span>
          <span className="font-semibold">{restaurant.rating || 0}</span>
          <span className="mx-2">•</span>
          <span className="text-gray-600">
            {restaurant.avgDeliveryTime || 30} min
          </span>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>{restaurant.cuisine?.slice(0, 2).join(", ") || "Various"}</span>
          <span>₹{restaurant.costForTwo || 0} for two</span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
