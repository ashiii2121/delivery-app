# Zomato-like Food Delivery Application

A full-stack food delivery web application built with React, Node.js, Express, and MongoDB.

## Features

### User Features

- Browse restaurants with search and filtering
- View restaurant menus and add items to cart
- Manage cart (add, update, remove items)
- Checkout with address selection and payment method
- Order history tracking
- User profile management

### Admin Features

- Dashboard with statistics
- Restaurant management (CRUD operations)
- Menu management (categories and items)
- Order status updates
- User management

## Tech Stack

### Frontend

- React (v18+) with functional components and hooks
- React Router v6
- Tailwind CSS for styling
- Axios for API calls

### Backend

- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Stripe for payment processing

## Project Structure

```
zomato22/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── ...
│   └── ...
├── docker-compose.yml
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Docker (optional, for containerized deployment)

### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/zomato
JWT_SECRET=your-super-secret-jwt-key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd zomato22
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

### Running the Application

#### Development Mode

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

#### Production Mode with Docker

1. **Build and start all services:**

   ```bash
   docker-compose up --build
   ```

2. **Stop services:**
   ```bash
   docker-compose down
   ```

### API Endpoints

#### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

#### Restaurants

- `GET /api/restaurants` - Get restaurants with filters
- `GET /api/restaurants/:id` - Get restaurant details
- `POST /api/restaurants` - Create restaurant (admin/owner)
- `PUT /api/restaurants/:id` - Update restaurant (admin/owner)
- `DELETE /api/restaurants/:id` - Delete restaurant (admin/owner)

#### Menu

- `GET /api/menu/categories` - Get all categories
- `POST /api/menu/categories` - Create category (admin/owner)
- `GET /api/menu/items` - Get menu items
- `POST /api/menu/items` - Create menu item (admin/owner)
- `PUT /api/menu/items/:id` - Update menu item (admin/owner)
- `DELETE /api/menu/items/:id` - Delete menu item (admin/owner)

#### Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/items/:id` - Update item quantity
- `DELETE /api/cart/items/:id` - Remove item from cart
- `DELETE /api/cart` - Clear cart

#### Orders

- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create order (checkout)
- `PUT /api/orders/:id/status` - Update order status (admin/restaurant owner)

#### Admin

- `GET /api/admin/stats` - Get admin dashboard stats
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role

## Deployment

### Frontend Deployment

The frontend can be deployed to Vercel:

1. Create a Vercel account
2. Connect your GitHub repository
3. Configure environment variables
4. Deploy

### Backend Deployment

The backend can be deployed to Render or Heroku:

1. Create an account on Render/Heroku
2. Connect your GitHub repository
3. Configure environment variables
4. Deploy

## Testing

### Backend Tests

Run backend tests with:

```bash
cd backend
npm test
```

### Frontend Tests

Run frontend tests with:

```bash
cd frontend
npm test
```

### Seeding the Database

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.
