import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    appName: "Zomato Clone",
    supportEmail: "support@zomatoclone.com",
    supportPhone: "+91 9876543210",
    deliveryFee: 30,
    taxRate: 5,
    minOrderAmount: 100,
    maxDeliveryRadius: 10,
    currency: "INR",
    timezone: "Asia/Kolkata",
  });

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchSettings();
    fetchAdmins();
  }, []);

  const fetchSettings = async () => {
    try {
      // In a real app, this would call an API to fetch settings
      // For now, we'll use the default settings
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch settings");
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      // In a real app, this would call an API to fetch admins
      // For now, we'll simulate some admin data
      setAdmins([
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          role: "Super Admin",
          status: "Active",
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          role: "Manager",
          status: "Active",
        },
        {
          id: 3,
          name: "Bob Johnson",
          email: "bob@example.com",
          role: "Support",
          status: "Inactive",
        },
      ]);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch admins");
      setLoading(false);
    }
  };

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]:
        name.includes("Fee") ||
        name.includes("Rate") ||
        name.includes("Amount") ||
        name.includes("Radius")
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      // In a real app, this would call an API to save settings
      setSuccess("Settings saved successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to save settings");
    }
  };

  const handleAddAdmin = () => {
    // In a real app, this would open a modal to add a new admin
    alert("Add new admin functionality would open here");
  };

  const handleDeleteAdmin = (adminId) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      // In a real app, this would call an API to delete the admin
      alert(`Admin ${adminId} deleted!`);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">Loading settings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Admin Settings & Roles
      </h2>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <div>
          <h3 className="text-xl font-semibold mb-4">General Settings</h3>
          <form onSubmit={handleSaveSettings}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  App Name
                </label>
                <input
                  type="text"
                  name="appName"
                  value={settings.appName}
                  onChange={handleSettingsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  name="supportEmail"
                  value={settings.supportEmail}
                  onChange={handleSettingsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Support Phone
                </label>
                <input
                  type="text"
                  name="supportPhone"
                  value={settings.supportPhone}
                  onChange={handleSettingsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Fee (₹)
                </label>
                <input
                  type="number"
                  name="deliveryFee"
                  value={settings.deliveryFee}
                  onChange={handleSettingsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  name="taxRate"
                  value={settings.taxRate}
                  onChange={handleSettingsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Order Amount (₹)
                </label>
                <input
                  type="number"
                  name="minOrderAmount"
                  value={settings.minOrderAmount}
                  onChange={handleSettingsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Delivery Radius (km)
                </label>
                <input
                  type="number"
                  name="maxDeliveryRadius"
                  value={settings.maxDeliveryRadius}
                  onChange={handleSettingsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  name="currency"
                  value={settings.currency}
                  onChange={handleSettingsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <select
                  name="timezone"
                  value={settings.timezone}
                  onChange={handleSettingsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Europe/London">Europe/London</option>
                </select>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Admin Management */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Admin Management</h3>
            <button
              onClick={handleAddAdmin}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700"
            >
              Add New Admin
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {admins.map((admin) => (
                  <tr key={admin.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {admin.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {admin.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {admin.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          admin.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {admin.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAdmin(admin.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Role Permissions */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Role Permissions</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    Super Admin
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Full access to all features</li>
                    <li>• Manage other admins</li>
                    <li>• Configure system settings</li>
                    <li>• View all reports</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Manager</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Manage restaurants and meals</li>
                    <li>• View orders and payments</li>
                    <li>• Manage delivery partners</li>
                    <li>• Moderate reviews</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Support</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• View customer information</li>
                    <li>• Manage orders</li>
                    <li>• Handle customer queries</li>
                    <li>• View reports</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
