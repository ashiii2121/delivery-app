// Simple in-memory database for demonstration purposes
class InMemoryDB {
    constructor() {
        this.data = {
            users: [],
            restaurants: [],
            menuCategories: [],
            menuItems: [],
            carts: [],
            orders: []
        };
        this.idCounter = 1;
    }

    generateId() {
        return this.idCounter++;
    }

    // Users
    createUser(userData) {
        const user = { id: this.generateId(), ...userData };
        this.data.users.push(user);
        return user;
    }

    findUserByEmail(email) {
        return this.data.users.find(user => user.email === email);
    }

    findUserById(id) {
        return this.data.users.find(user => user.id == id);
    }

    // Restaurants
    createRestaurant(restaurantData) {
        const restaurant = { id: this.generateId(), ...restaurantData };
        this.data.restaurants.push(restaurant);
        return restaurant;
    }

    findAllRestaurants() {
        return this.data.restaurants;
    }

    findRestaurantById(id) {
        return this.data.restaurants.find(restaurant => restaurant.id == id);
    }

    // Menu Categories
    createMenuCategory(categoryData) {
        const category = { id: this.generateId(), ...categoryData };
        this.data.menuCategories.push(category);
        return category;
    }

    findCategoriesByRestaurantId(restaurantId) {
        return this.data.menuCategories.filter(category => category.restaurantId == restaurantId);
    }

    // Menu Items
    createMenuItem(itemData) {
        const item = { id: this.generateId(), ...itemData };
        this.data.menuItems.push(item);
        return item;
    }

    findItemsByRestaurantId(restaurantId) {
        return this.data.menuItems.filter(item => item.restaurantId == restaurantId);
    }

    findItemsByCategoryId(categoryId) {
        return this.data.menuItems.filter(item => item.categoryId == categoryId);
    }

    findItemById(id) {
        return this.data.menuItems.find(item => item.id == id);
    }

    // Carts
    findCartByUserId(userId) {
        return this.data.carts.find(cart => cart.userId == userId);
    }

    createCart(cartData) {
        const cart = { id: this.generateId(), ...cartData };
        this.data.carts.push(cart);
        return cart;
    }

    updateCart(id, cartData) {
        const index = this.data.carts.findIndex(cart => cart.id == id);
        if (index !== -1) {
            this.data.carts[index] = { ...this.data.carts[index], ...cartData };
            return this.data.carts[index];
        }
        return null;
    }

    // Orders
    createOrder(orderData) {
        const order = { id: this.generateId(), ...orderData };
        this.data.orders.push(order);
        return order;
    }

    findOrdersByUserId(userId) {
        return this.data.orders.filter(order => order.userId == userId);
    }

    findOrderById(id) {
        return this.data.orders.find(order => order.id == id);
    }

    updateOrder(id, orderData) {
        const index = this.data.orders.findIndex(order => order.id == id);
        if (index !== -1) {
            this.data.orders[index] = { ...this.data.orders[index], ...orderData };
            return this.data.orders[index];
        }
        return null;
    }
}

module.exports = new InMemoryDB();