import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const AdminReports = () => {
  const [salesData, setSalesData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [deliveryData, setDeliveryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("sales");
  const [dateRange, setDateRange] = useState("week");

  const API_URL = "http://localhost:5001/api/reports";

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  const fetchReports = async () => {
    try {
      // In a real app, we would fetch data based on the date range
      // For now, we'll simulate data
      simulateSalesData();
      simulateCustomerData();
      simulateDeliveryData();
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch reports");
      setLoading(false);
    }
  };

  // Simulate sales data
  const simulateSalesData = () => {
    const data = [];
    const periods = dateRange === "week" ? 7 : dateRange === "month" ? 30 : 12;

    for (let i = 0; i < periods; i++) {
      data.push({
        name:
          dateRange === "week"
            ? `Day ${i + 1}`
            : dateRange === "month"
            ? `Day ${i + 1}`
            : `Month ${i + 1}`,
        sales: Math.floor(Math.random() * 10000) + 5000,
        orders: Math.floor(Math.random() * 100) + 50,
        revenue: Math.floor(Math.random() * 8000) + 4000,
      });
    }

    setSalesData(data);
  };

  // Simulate customer data
  const simulateCustomerData = () => {
    const data = [
      { name: "New Customers", value: 400 },
      { name: "Returning Customers", value: 300 },
      { name: "Inactive Customers", value: 200 },
    ];
    setCustomerData(data);
  };

  // Simulate delivery data
  const simulateDeliveryData = () => {
    const data = [
      { name: "On Time", value: 85 },
      { name: "Delayed", value: 10 },
      { name: "Cancelled", value: 5 },
    ];
    setDeliveryData(data);
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">Loading reports...</div>
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
          Reports & Analytics
        </h2>
        <div className="flex gap-2">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last 12 Months</option>
          </select>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700">
            Export Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("sales")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "sales"
                ? "border-red-500 text-red-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Sales Report
          </button>
          <button
            onClick={() => setActiveTab("customers")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "customers"
                ? "border-red-500 text-red-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Customer Insights
          </button>
          <button
            onClick={() => setActiveTab("delivery")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "delivery"
                ? "border-red-500 text-red-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Delivery Performance
          </button>
        </nav>
      </div>

      {/* Sales Report */}
      {activeTab === "sales" && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Total Sales
              </h3>
              <p className="text-3xl font-bold text-blue-600">₹1,25,000</p>
              <p className="text-sm text-blue-500 mt-1">
                +12% from last period
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Total Orders
              </h3>
              <p className="text-3xl font-bold text-green-600">1,240</p>
              <p className="text-sm text-green-500 mt-1">
                +8% from last period
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">
                Avg. Order Value
              </h3>
              <p className="text-3xl font-bold text-purple-600">₹850</p>
              <p className="text-sm text-purple-500 mt-1">
                +5% from last period
              </p>
            </div>
          </div>

          <div className="h-80 mb-8">
            <h3 className="text-lg font-semibold mb-4">Sales Trend</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={salesData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="h-80">
            <h3 className="text-lg font-semibold mb-4">Orders Overview</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Customer Insights */}
      {activeTab === "customers" && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">
                Customer Distribution
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={customerData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {customerData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                Customer Metrics
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Total Customers</p>
                  <p className="text-2xl font-bold text-green-600">1,850</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Avg. Customer Lifetime Value
                  </p>
                  <p className="text-2xl font-bold text-green-600">₹2,450</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Customer Retention Rate
                  </p>
                  <p className="text-2xl font-bold text-green-600">72%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Performance */}
      {activeTab === "delivery" && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                On-Time Delivery Rate
              </h3>
              <p className="text-3xl font-bold text-blue-600">92%</p>
              <p className="text-sm text-blue-500 mt-1">+3% from last period</p>
            </div>
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Avg. Delivery Time
              </h3>
              <p className="text-3xl font-bold text-green-600">28 min</p>
              <p className="text-sm text-green-500 mt-1">
                -2 min from last period
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">
                Delivery Partner Rating
              </h3>
              <p className="text-3xl font-bold text-purple-600">4.6/5</p>
              <p className="text-sm text-purple-500 mt-1">
                +0.2 from last period
              </p>
            </div>
          </div>

          <div className="h-80">
            <h3 className="text-lg font-semibold mb-4">Delivery Performance</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deliveryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {deliveryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
