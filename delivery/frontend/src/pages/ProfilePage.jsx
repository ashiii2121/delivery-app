import React, { useState } from "react";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "9876543210",
  });

  // Mock order history
  const orderHistory = [
    {
      _id: "1",
      restaurant: "Biryani Blues",
      total: 530,
      status: "delivered",
      date: "2023-08-15",
    },
    {
      _id: "2",
      restaurant: "Pizza Hut",
      total: 750,
      status: "delivered",
      date: "2023-08-10",
    },
    {
      _id: "3",
      restaurant: "Burger King",
      total: 350,
      status: "cancelled",
      date: "2023-08-05",
    },
  ];

  // Mock saved addresses
  const savedAddresses = [
    {
      _id: "1",
      street: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400001",
      isDefault: true,
    },
    {
      _id: "2",
      street: "456 Park Avenue",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400002",
      isDefault: false,
    },
  ];

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = () => {
    // In a real app, this would save to the backend
    console.log("Profile saved:", profile);
    alert("Profile updated successfully!");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-red-600 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold mb-4">
                {profile.name.charAt(0)}
              </div>
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-gray-600">{profile.email}</p>
            </div>

            <nav className="space-y-2">
              <button
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  activeTab === "orders"
                    ? "bg-red-100 text-red-600"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("orders")}
              >
                Order History
              </button>
              <button
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  activeTab === "profile"
                    ? "bg-red-100 text-red-600"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                Profile Details
              </button>
              <button
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  activeTab === "addresses"
                    ? "bg-red-100 text-red-600"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("addresses")}
              >
                Saved Addresses
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === "orders" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6">Order History</h2>

              {orderHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No orders yet</p>
              ) : (
                <div className="space-y-4">
                  {orderHistory.map((order) => (
                    <div
                      key={order._id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{order.restaurant}</h3>
                          <p className="text-gray-600">Order # {order._id}</p>
                          <p className="text-gray-600">
                            Placed on {order.date}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-bold">₹{order.total}</p>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6">Profile Details</h2>

              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {activeTab === "addresses" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Saved Addresses</h2>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700">
                  Add New Address
                </button>
              </div>

              {savedAddresses.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No saved addresses
                </p>
              ) : (
                <div className="space-y-4">
                  {savedAddresses.map((address) => (
                    <div
                      key={address._id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="font-semibold">{address.street}</p>
                          <p>
                            {address.city}, {address.state} - {address.zip}
                          </p>
                          {address.isDefault && (
                            <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                              Default Address
                            </span>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
