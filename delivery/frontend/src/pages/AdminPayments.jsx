import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { API_ENDPOINTS } from "../config/api";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchPayments();
    }
  }, [token]);

  const fetchPayments = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.PAYMENTS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPayments(response.data.payments || []);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch payments");
      setLoading(false);
    }
  };

  // Filter payments based on search term and status
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.orderId &&
        payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || payment.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Get current payments for pagination
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(
    indexOfFirstPayment,
    indexOfLastPayment
  );
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);

  const handleRefund = async (paymentId) => {
    if (
      window.confirm(
        "Are you sure you want to initiate a refund for this payment?"
      )
    ) {
      try {
        await axios.put(
          `${API_ENDPOINTS.PAYMENTS}/${paymentId}/refund`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert(`Refund initiated for payment ${paymentId}!`);
        fetchPayments(); // Refresh the list
      } catch (err) {
        setError("Failed to initiate refund");
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">Loading payments...</div>
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
        <h2 className="text-2xl font-bold text-gray-800">Payments & Revenue</h2>
        <button
          onClick={fetchPayments}
          className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700"
        >
          View All Payments
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search payments..."
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
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Payments Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentPayments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{payment.id.slice(-6)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  #{payment.orderId?.slice(-6) || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.userId || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ₹{payment.amount || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.paymentMethod || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      payment.paymentStatus === "completed"
                        ? "bg-green-100 text-green-800"
                        : payment.paymentStatus === "refunded"
                        ? "bg-red-100 text-red-800"
                        : payment.paymentStatus === "failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {payment.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(payment.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {payment.paymentStatus === "completed" && (
                    <button
                      onClick={() => handleRefund(payment.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Refund
                    </button>
                  )}
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
            Showing {indexOfFirstPayment + 1} to{" "}
            {Math.min(indexOfLastPayment, filteredPayments.length)} of{" "}
            {filteredPayments.length} payments
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

export default AdminPayments;
