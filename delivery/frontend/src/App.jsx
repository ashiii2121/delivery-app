import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import RestaurantsList from "./pages/RestaurantsList";
import RestaurantPage from "./pages/RestaurantPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLayout from "./pages/AdminLayout";
import TestPage from "./pages/TestPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

// Admin pages
import AdminRestaurants from "./pages/AdminRestaurants";
import AdminMeals from "./pages/AdminMeals";
import AdminCustomers from "./pages/AdminCustomers";
import AdminDeliveryPartners from "./pages/AdminDeliveryPartners";
import AdminOrders from "./pages/AdminOrders";
import AdminPayments from "./pages/AdminPayments";
import AdminReviews from "./pages/AdminReviews";
import AdminPromotions from "./pages/AdminPromotions";
import AdminReports from "./pages/AdminReports";
import AdminSettings from "./pages/AdminSettings";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/restaurants" element={<RestaurantsList />} />
            <Route path="/restaurants/:id" element={<RestaurantPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/test" element={<TestPage />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="restaurants" element={<AdminRestaurants />} />
              <Route path="meals" element={<AdminMeals />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route
                path="delivery-partners"
                element={<AdminDeliveryPartners />}
              />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="promotions" element={<AdminPromotions />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
