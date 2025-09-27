import React, { useState } from "react";

const MenuItemCard = ({ item, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(item, quantity);
    setQuantity(1); // Reset quantity after adding
  };

  return (
    <div className="border rounded-lg p-4 flex">
      <div className="flex-grow">
        <div className="flex justify-between">
          <h4 className="font-semibold">{item.name}</h4>
          <span className="font-bold">₹{item.price}</span>
        </div>

        <p className="text-gray-600 text-sm mt-1">{item.description}</p>

        {item.veg ? (
          <span className="inline-block mt-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
            Veg
          </span>
        ) : (
          <span className="inline-block mt-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
            Non-Veg
          </span>
        )}
      </div>

      <div className="ml-4 flex flex-col items-center">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-20 h-20 object-cover rounded"
          />
        ) : (
          <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-500 text-xs">No Image</span>
          </div>
        )}

        <div className="mt-2 flex items-center">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
          >
            -
          </button>
          <span className="mx-2">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default MenuItemCard;
