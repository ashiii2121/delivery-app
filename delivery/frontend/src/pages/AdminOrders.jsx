import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { API_ENDPOINTS } from "../config/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.ADMIN}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data || []);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch orders");
      setLoading(false);
    }
  };

  // Filter orders based on search term and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user &&
        order.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.restaurant &&
        order.restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || order.currentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Get current orders for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handleAssignDelivery = (orderId) => {
    // In a real app, this would open a modal to assign a delivery partner
    alert(`Assigning delivery partner for order ${orderId}`);
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        // In a real app, this would call an API to cancel the order
        alert(`Order ${orderId} cancelled and refund initiated!`);
        fetchOrders(); // Refresh the list
      } catch (err) {
        setError("Failed to cancel order");
      }
    }
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    // In a real app, this would call an API to update the order status
    alert(`Updating order ${orderId} status to ${newStatus}`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">Loading orders...</div>
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
        <button
          onClick={fetchOrders}
          className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700"
        >
          View All Orders
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search orders..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="placed">Placed</option>
          <option value="confirmed">Confirmed</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready for Pickup</option>
          <option value="picked">Picked Up</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Restaurant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
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
            {currentOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{order.id.slice(-6)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.user?.name || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.restaurant?.name || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.items?.length || 0} items
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ₹{order.total || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.currentStatus === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.currentStatus === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : order.currentStatus === "preparing"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {order.currentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleAssignDelivery(order.id)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Assign
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(order.id, "delivered")}
                    className="text-green-600 hover:text-green-900 mr-3"
                  >
                    Deliver
                  </button>
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Showing {indexOfFirstOrder + 1} to{" "}
            {Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
            {filteredOrders.length} orders
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === i + 1
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
