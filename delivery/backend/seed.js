const bcrypt = require('bcryptjs');
const db = require('./utils/inMemoryDB');

const seedDatabase = async () => {
    try {
        console.log('Clearing existing data...');

        // Clear existing data
        db.data.users = [];
        db.data.restaurants = [];
        db.data.menuCategories = [];
        db.data.menuItems = [];
        db.data.carts = [];
        db.data.orders = [];

        console.log('Creating users...');

        // Create admin user
        const adminPassword = await bcrypt.hash('admin123', 10);
        const admin = db.createUser({
            name: 'Admin User',
            email: 'admin@example.com',
            passwordHash: adminPassword,
            role: 'admin'
        });

        console.log('Admin user created');

        // Create restaurant owner
        const ownerPassword = await bcrypt.hash('owner123', 10);
        const owner = db.createUser({
            name: 'Restaurant Owner',
            email: 'owner@example.com',
            passwordHash: ownerPassword,
            role: 'owner'
        });

        console.log('Restaurant owner created');

        // Create regular user
        const userPassword = await bcrypt.hash('user123', 10);
        const user = db.createUser({
            name: 'Regular User',
            email: 'user@example.com',
            passwordHash: userPassword,
            role: 'user'
        });

        console.log('Regular user created');

        // Create restaurant
        const restaurant = db.createRestaurant({
            name: 'Biryani Blues',
            slug: 'biryani-blues',
            description: 'Best biryani in town with authentic flavors',
            cuisine: ['Biryani', 'North Indian'],
            rating: 4.5,
            avgDeliveryTime: 30,
            costForTwo: 500,
            address: '123 Main Street, City',
            geo: {
                lat: 19.0760,
                lng: 72.8777
            },
            images: ['https://via.placeholder.com/300'],
            ownerId: owner.id,
            createdAt: new Date().toISOString()
        });

        console.log('Restaurant created');

        // Create menu categories
        const mainCourseCategory = db.createMenuCategory({
            name: 'Main Course',
            restaurantId: restaurant.id
        });

        const startersCategory = db.createMenuCategory({
            name: 'Starters',
            restaurantId: restaurant.id
        });

        console.log('Menu categories created');

        // Create menu items
        console.log('Creating menu items...');
        const chickenBiryani = db.createMenuItem({
            name: 'Chicken Biryani',
            description: 'Fragrant basmati rice cooked with chicken and spices',
            price: 250,
            veg: false,
            image: 'https://via.placeholder.com/200',
            categoryId: mainCourseCategory.id,
            restaurantId: restaurant.id
        });
        console.log('Chicken Biryani created:', chickenBiryani);

        const vegBiryani = db.createMenuItem({
            name: 'Veg Biryani',
            description: 'Fragrant basmati rice cooked with vegetables and spices',
            price: 200,
            veg: true,
            image: 'https://via.placeholder.com/200',
            categoryId: mainCourseCategory.id,
            restaurantId: restaurant.id
        });
        console.log('Veg Biryani created:', vegBiryani);

        const chicken65 = db.createMenuItem({
            name: 'Chicken 65',
            description: 'Spicy fried chicken appetizer',
            price: 180,
            veg: false,
            image: 'https://via.placeholder.com/200',
            categoryId: startersCategory.id,
            restaurantId: restaurant.id
        });
        console.log('Chicken 65 created:', chicken65);

        const paneerTikka = db.createMenuItem({
            name: 'Paneer Tikka',
            description: 'Grilled cottage cheese with spices',
            price: 160,
            veg: true,
            image: 'https://via.placeholder.com/200',
            categoryId: startersCategory.id,
            restaurantId: restaurant.id
        });
        console.log('Paneer Tikka created:', paneerTikka);

        console.log('Menu items created');

        console.log('Database seeding completed successfully!');
        console.log('\n--- Login Credentials ---');
        console.log('Admin: admin@example.com / admin123');
        console.log('Owner: owner@example.com / owner123');
        console.log('User: user@example.com / user123');
        console.log('-------------------------');

    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
};

module.exports = seedDatabase;