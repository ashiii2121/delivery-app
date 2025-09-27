import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock cart data
  const mockCartItems = [
    {
      _id: "1",
      name: "Chicken Biryani",
      price: 250,
      qty: 2,
      image: "https://via.placeholder.com/100",
    },
    {
      _id: "2",
      name: "Paneer Tikka",
      price: 160,
      qty: 1,
      image: "https://via.placeholder.com/100",
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCartItems(mockCartItems);
      setLoading(false);
    }, 500);
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const deliveryFee = 30;
  const total = subtotal + deliveryFee;

  const handleUpdateQuantity = (itemId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }

    setCartItems(
      cartItems.map((item) =>
        item._id === itemId ? { ...item, qty: newQty } : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(cartItems.filter((item) => item._id !== itemId));
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate("/restaurants")}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700"
          >
            Browse Restaurants
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <div className="p-6 flex">
                    <div className="flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-500 text-xs">
                            No Image
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="ml-4 flex-grow">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="text-lg font-bold">
                          ₹{item.price * item.qty}
                        </p>
                      </div>

                      <div className="mt-2 flex items-center">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item._id,
                              Math.max(1, item.qty - 1)
                            )
                          }
                          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="mx-3">{item.qty}</span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item._id, item.qty + 1)
                          }
                          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                        >
                          +
                        </button>

                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="ml-4 text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
