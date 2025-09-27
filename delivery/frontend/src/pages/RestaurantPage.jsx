import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MenuItemCard from "../components/MenuItemCard";

const RestaurantPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");

  // Mock data for restaurant
  const mockRestaurant = {
    _id: id,
    name: "Biryani Blues",
    description: "Best biryani in town with authentic flavors",
    rating: 4.5,
    avgDeliveryTime: 30,
    costForTwo: 500,
    cuisine: ["Biryani", "North Indian"],
    address: "123 Main Street, City",
    images: ["https://via.placeholder.com/800x400"],
  };

  // Mock data for menu
  const mockMenu = [
    {
      category: "Popular",
      items: [
        {
          _id: "1",
          name: "Chicken Biryani",
          description: "Fragrant basmati rice cooked with chicken and spices",
          price: 250,
          veg: false,
          image: "https://via.placeholder.com/200",
        },
        {
          _id: "2",
          name: "Veg Biryani",
          description:
            "Fragrant basmati rice cooked with vegetables and spices",
          price: 200,
          veg: true,
          image: "https://via.placeholder.com/200",
        },
      ],
    },
    {
      category: "Starters",
      items: [
        {
          _id: "3",
          name: "Chicken 65",
          description: "Spicy fried chicken appetizer",
          price: 180,
          veg: false,
          image: "https://via.placeholder.com/200",
        },
        {
          _id: "4",
          name: "Paneer Tikka",
          description: "Grilled cottage cheese with spices",
          price: 160,
          veg: true,
          image: "https://via.placeholder.com/200",
        },
      ],
    },
    {
      category: "Main Course",
      items: [
        {
          _id: "5",
          name: "Butter Chicken",
          description: "Creamy tomato-based chicken curry",
          price: 280,
          veg: false,
          image: "https://via.placeholder.com/200",
        },
        {
          _id: "6",
          name: "Paneer Butter Masala",
          description: "Cottage cheese in rich tomato gravy",
          price: 240,
          veg: true,
          image: "https://via.placeholder.com/200",
        },
      ],
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRestaurant(mockRestaurant);
      setMenu(mockMenu);
      if (mockMenu.length > 0) {
        setActiveCategory(mockMenu[0].category);
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const handleAddToCart = (item, quantity) => {
    console.log(`Added ${quantity} x ${item.name} to cart`);
    // In a real app, this would dispatch to a cart context/redux store
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading restaurant details...</div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Restaurant not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Restaurant Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="h-64 bg-gray-200">
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

        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{restaurant.name}</h1>
              <p className="text-gray-600 mt-2">
                {restaurant.cuisine.join(", ")}
              </p>
              <p className="text-gray-600 mt-1">{restaurant.address}</p>
            </div>

            <div className="text-right">
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="font-semibold text-lg">
                  {restaurant.rating}
                </span>
              </div>
              <p className="text-gray-600">{restaurant.avgDeliveryTime} min</p>
              <p className="text-gray-600">₹{restaurant.costForTwo} for two</p>
            </div>
          </div>

          <p className="mt-4 text-gray-700">{restaurant.description}</p>
        </div>
      </div>

      {/* Menu */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Menu</h2>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto mb-6 pb-2">
          {menu.map((category) => (
            <button
              key={category.category}
              className={`px-4 py-2 mr-2 rounded-full whitespace-nowrap ${
                activeCategory === category.category
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveCategory(category.category)}
            >
              {category.category}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="space-y-6">
          {menu
            .filter((category) => category.category === activeCategory)
            .map((category) => (
              <div key={category.category}>
                <h3 className="text-xl font-semibold mb-4">
                  {category.category}
                </h3>
                <div className="space-y-4">
                  {category.items.map((item) => (
                    <MenuItemCard
                      key={item._id}
                      item={item}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantPage;
