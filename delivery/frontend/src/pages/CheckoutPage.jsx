import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  // Mock cart data
  const cartItems = [
    {
      _id: "1",
      name: "Chicken Biryani",
      price: 250,
      qty: 2,
    },
    {
      _id: "2",
      name: "Paneer Tikka",
      price: 160,
      qty: 1,
    },
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const deliveryFee = 30;
  const total = subtotal + deliveryFee;

  const handleAddressChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit the order
    console.log("Order submitted:", { address, paymentMethod });
    alert("Order placed successfully!");
    navigate("/profile");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Delivery Address</h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={address.street}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">ZIP Code</label>
                  <input
                    type="text"
                    name="zip"
                    value={address.zip}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span>Credit/Debit Card</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span>Cash on Delivery</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700"
              >
                Place Order
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between">
                  <div>
                    <span>
                      {item.name} x {item.qty}
                    </span>
                  </div>
                  <span>₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
