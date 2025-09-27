import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { API_ENDPOINTS } from "../config/api";
import AddDeliveryPartnerModal from "../components/AddDeliveryPartnerModal";

const AdminDeliveryPartners = () => {
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [partnersPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchDeliveryPartners();
    }
  }, [token]);

  const fetchDeliveryPartners = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.DELIVERY_PARTNERS);
      setDeliveryPartners(response.data.deliveryPartners || []);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch delivery partners");
      setLoading(false);
    }
  };

  // Filter delivery partners based on search term
  const filteredPartners = deliveryPartners.filter(
    (partner) =>
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (partner.vehicle &&
        partner.vehicle.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get current partners for pagination
  const indexOfLastPartner = currentPage * partnersPerPage;
  const indexOfFirstPartner = indexOfLastPartner - partnersPerPage;
  const currentPartners = filteredPartners.slice(
    indexOfFirstPartner,
    indexOfLastPartner
  );
  const totalPages = Math.ceil(filteredPartners.length / partnersPerPage);

  const handleApprove = async (id) => {
    if (
      window.confirm("Are you sure you want to approve this delivery partner?")
    ) {
      try {
        // In a real app, this would call an API to approve the partner
        alert(`Delivery partner ${id} approved!`);
        fetchDeliveryPartners(); // Refresh the list
      } catch (err) {
        setError("Failed to approve delivery partner");
      }
    }
  };

  const handleBlock = async (id) => {
    if (
      window.confirm("Are you sure you want to block this delivery partner?")
    ) {
      try {
        // In a real app, this would call an API to block the partner
        alert(`Delivery partner ${id} blocked!`);
        fetchDeliveryPartners(); // Refresh the list
      } catch (err) {
        setError("Failed to block delivery partner");
      }
    }
  };

  const handleViewPayouts = (id) => {
    // In a real app, this would navigate to the partner's payouts page
    alert(`Viewing payouts for delivery partner ${id}`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">Loading delivery partners...</div>
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
        <h2 className="text-2xl font-bold text-gray-800">
          Delivery Partner Management
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700"
        >
          Add New Delivery Partner
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search delivery partners..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Delivery Partners Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Partner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicle
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
            {currentPartners.map((partner) => (
              <tr key={partner._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={
                          partner.avatar || "https://via.placeholder.com/150"
                        }
                        alt={partner.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {partner.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {partner.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {partner.phone || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {partner.vehicle || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      partner.isBlocked
                        ? "bg-red-100 text-red-800"
                        : partner.isApproved
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {partner.isBlocked
                      ? "Blocked"
                      : partner.isApproved
                      ? "Active"
                      : "Pending"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {!partner.isApproved && (
                    <button
                      onClick={() => handleApprove(partner._id)}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleViewPayouts(partner._id)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    View Payouts
                  </button>
                  <button
                    onClick={() => handleBlock(partner._id)}
                    className={`${
                      partner.isBlocked
                        ? "text-green-600 hover:text-green-900"
                        : "text-red-600 hover:text-red-900"
                    }`}
                  >
                    {partner.isBlocked ? "Unblock" : "Block"}
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
            Showing {indexOfFirstPartner + 1} to{" "}
            {Math.min(indexOfLastPartner, filteredPartners.length)} of{" "}
            {filteredPartners.length} partners
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

      {/* Add Delivery Partner Modal */}
      <AddDeliveryPartnerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={(newPartner) => {
          setDeliveryPartners([...deliveryPartners, newPartner]);
        }}
      />
    </div>
  );
};

export default AdminDeliveryPartners;
