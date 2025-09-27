# 🍔 Food Delivery Application 🚚

![Food Delivery Banner](images/biryani%20.jpg)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4%2B-brightgreen)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18%2B-blue)](https://reactjs.org/)

A full-stack food delivery web application built with the MERN stack (MongoDB, Express.js, React, Node.js) that provides a seamless experience for customers, restaurants, and administrators.

## 🌟 Key Features

### 👤 Customer Features

- 🔍 Browse restaurants with search and filtering capabilities
- 📋 View detailed restaurant menus and add items to cart
- 🛒 Manage cart (add, update, remove items)
- 📍 Checkout with address selection and payment method
- 📦 Track order history and status
- 👤 User profile management with personal details

### 🏪 Restaurant Owner Features

- 📊 Dashboard with sales and order statistics
- 🍽️ Menu management (categories and items)
- 📦 Order management and status updates
- 📈 Performance analytics

### 👨‍💼 Admin Features

- 📊 Comprehensive dashboard with system statistics
- 🏪 Restaurant management (CRUD operations)
- 📋 Menu management (categories and items)
- 📦 Order status updates and monitoring
- 👥 User management and role assignments
- 📈 System performance analytics

## 🛠️ Tech Stack

### 🌐 Frontend

- ⚛️ React (v18+) with functional components and hooks
- 🔄 React Router v6 for navigation
- 🎨 Tailwind CSS for responsive and modern styling
- 🌙 Lucide React for beautiful icons
- 📡 Axios for API calls
- 🧪 Vitest for testing

### 🔧 Backend

- 🟢 Node.js with Express.js framework
- 🍃 MongoDB with Mongoose ODM
- 🔐 JWT for secure authentication
- 🔒 Bcrypt for password hashing
- 💳 Stripe for payment processing
- 🧪 Jest for testing

## 📁 Project Structure

```
delivery-app/
├── backend/
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── utils/          # Utility functions
│   ├── __tests__/      # Backend tests
│   ├── server.js       # Entry point
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── contexts/   # React contexts
│   │   ├── config/     # Configuration files
│   │   ├── App.jsx     # Main app component
│   │   └── ...
│   └── ...
├── docker-compose.yml  # Docker configuration
└── README.md           # Project documentation
```

## 🚀 Getting Started

### 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Docker (optional, for containerized deployment)

### ⚙️ Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/food_delivery
JWT_SECRET=your-super-secret-jwt-key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

### 📥 Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ashiii2121/delivery-app.git
   cd delivery-app
   ```

2. **Backend Setup:**

   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup:**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Seed the database (optional but recommended):**
   ```bash
   cd backend
   npm run seed
   ```

### ▶️ Running the Application

#### 🛠️ Development Mode

1. **Start MongoDB** (if not using Docker):

   ```bash
   mongod
   ```

2. **Start Backend:**

   ```bash
   cd backend
   npm run dev
   ```

3. **Start Frontend:**
   ```bash
   cd frontend
   npm start
   ```

#### 🐳 Production Mode with Docker

1. **Build and start all services:**

   ```bash
   docker-compose up --build
   ```

2. **Stop services:**
   ```bash
   docker-compose down
   ```

## 🌐 API Endpoints

### 🔐 Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### 🏪 Restaurants

- `GET /api/restaurants` - Get restaurants with filters
- `GET /api/restaurants/:id` - Get restaurant details
- `POST /api/restaurants` - Create restaurant (admin/owner)
- `PUT /api/restaurants/:id` - Update restaurant (admin/owner)
- `DELETE /api/restaurants/:id` - Delete restaurant (admin/owner)

### 📋 Menu

- `GET /api/menu/categories` - Get all categories
- `POST /api/menu/categories` - Create category (admin/owner)
- `GET /api/menu/items` - Get menu items
- `POST /api/menu/items` - Create menu item (admin/owner)
- `PUT /api/menu/items/:id` - Update menu item (admin/owner)
- `DELETE /api/menu/items/:id` - Delete menu item (admin/owner)

### 🛒 Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/items/:id` - Update item quantity
- `DELETE /api/cart/items/:id` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### 📦 Orders

- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create order (checkout)
- `PUT /api/orders/:id/status` - Update order status (admin/restaurant owner)

### 👨‍💼 Admin

- `GET /api/admin/stats` - Get admin dashboard stats
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role

## 🧪 Testing

### 🔧 Backend Tests

Run backend tests with:

```bash
cd backend
npm test
```

### 🖥️ Frontend Tests

Run frontend tests with:

```bash
cd frontend
npm test
```

## 🌱 Seeding the Database

To seed the database with sample data:

```bash
cd backend
npm run seed
```

This will create:

- An admin user (admin@example.com / admin123)
- A restaurant owner (owner@example.com / owner123)
- A regular user (user@example.com / user123)
- A sample restaurant with menu items

## 🤝 Contributing

We welcome contributions to improve this project! Here's how you can help:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 🚀 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🔍 Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Inspired by popular food delivery platforms like Zomato and Swiggy
- Built with ❤️ using modern web technologies

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/ashiii2121">Ashik</a>
</p>
