import React, { useState } from 'react';
import { Search, Star, Clock, MapPin, Heart, ShoppingCart, Plus, Minus, X, Percent, Truck, Award } from 'lucide-react';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  // Mock Data
  const categories = [
    { id: 'all', name: 'All', icon: 'https://images.unsplash.com/photo-1555939594-58e4c4c84abd?w=100&h=100&fit=crop' },
    { id: 'biryani', name: 'Biryani', icon: 'https://images.unsplash.com/photo-1563379091339-03246963d25a?w=100&h=100&fit=crop' },
    { id: 'pizza', name: 'Pizza', icon: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop' },
    { id: 'burger', name: 'Burger', icon: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=100&h=100&fit=crop' },
    { id: 'north-indian', name: 'North Indian', icon: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=100&h=100&fit=crop' },
    { id: 'desserts', name: 'Desserts', icon: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=100&h=100&fit=crop' },
    { id: 'beverages', name: 'Beverages', icon: 'https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=100&h=100&fit=crop' },
    { id: 'chinese', name: 'Chinese', icon: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=100&h=100&fit=crop' }
  ];

  const offers = [
    { id: 1, title: "50% OFF", subtitle: "On orders above ₹299", code: "SAVE50", color: "#ef4444" },
    { id: 2, title: "Free Delivery", subtitle: "On all orders today", code: "FREEDEL", color: "#10b981" },
    { id: 3, title: "Buy 1 Get 1", subtitle: "On selected items", code: "BOGO", color: "#3b82f6" },
    { id: 4, title: "30% OFF", subtitle: "First order discount", code: "NEW30", color: "#8b5cf6" }
  ];

  const featuredRestaurants = [
    {
      id: 1,
      name: "Royal Dine",
      cuisine: "Biryani, Mandhi, Beverages, Alfahm, Grill, Seafood, Desserts, DesiFood",
      rating: 4.5,
      deliveryTime: "25-30 min",
      distance: "2.1 km",
      image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600",
      offers: ["50% OFF", "Free Delivery"],
      costForTwo: 400,
      popular: true,
      categories: ['biryani', 'beverages', 'desserts'],
      menu: [
        { id: 1, name: "Chicken Biryani", price: 299, image: "https://images.unsplash.com/photo-1563379091339-03246963d25a?w=200&h=150&fit=crop", category: "biryani", rating: 4.6, description: "Aromatic basmati rice with tender chicken" },
        { id: 2, name: "Mutton Biryani", price: 399, image: "https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=200&h=150&fit=crop", category: "biryani", rating: 4.7, description: "Premium mutton with fragrant spices" },
        { id: 3, name: "Veg Biryani", price: 199, image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=200&h=150&fit=crop", category: "biryani", rating: 4.3, description: "Mixed vegetables with basmati rice" },
        { id: 4, name: "Alfahm Mandhi", price: 750, image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=200&h=150&fit=crop", category: "mandhi", rating: 4.3, description: "Full Mandhi with Alfahm Chicken" }
      ]
    },
    {
      id: 2,
      name: "Pizza Hut",
      cuisine: "Italian, Fast Food, Pizza, Beverages",
      rating: 4.2,
      deliveryTime: "20-25 min",
      distance: "1.5 km",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop",
      offers: ["Buy 1 Get 1"],
      costForTwo: 600,
      categories: ['pizza', 'beverages'],
      menu: [
        { id: 5, name: "Margherita Pizza", price: 249, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=150&fit=crop", category: "pizza", rating: 4.4, description: "Classic tomato and mozzarella" },
        { id: 6, name: "Pepperoni Pizza", price: 349, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=150&fit=crop", category: "pizza", rating: 4.5, description: "Spicy pepperoni with cheese" },
        { id: 7, name: "Veggie Supreme", price: 299, image: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=200&h=150&fit=crop", category: "pizza", rating: 4.2, description: "Loaded with fresh vegetables" }
      ]
    },
    {
      id: 3,
      name: "Bekachi",
      cuisine: "American, Fast Food, Burger, Beverages",
      rating: 4.0,
      deliveryTime: "15-20 min",
      distance: "0.8 km",
      image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=300&h=200&fit=crop",
      offers: ["30% OFF"],
      costForTwo: 350,
      categories: ['burger', 'beverages'],
      menu: [
        { id: 8, name: "Classic Beef Burger", price: 199, image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=200&h=150&fit=crop", category: "burger", rating: 4.1, description: "Juicy beef patty with fresh veggies" },
        { id: 9, name: "Chicken Deluxe", price: 179, image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=200&h=150&fit=crop", category: "burger", rating: 4.3, description: "Grilled chicken with special sauce" },
        { id: 10, name: "Veg Burger", price: 149, image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=200&h=150&fit=crop", category: "burger", rating: 3.9, description: "Plant-based patty with fresh toppings" }
      ]
    },
    {
      id: 4,
      name: "Viceroy",
      cuisine: "North Indian, Chinese, Beverages",
      rating: 4.3,
      deliveryTime: "30-35 min",
      distance: "3.2 km",
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=200&fit=crop",
      offers: ["Free Delivery"],
      costForTwo: 450,
      categories: ['north-indian', 'chinese', 'beverages'],
      menu: [
        { id: 11, name: "Butter Chicken", price: 279, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&h=150&fit=crop", category: "north-indian", rating: 4.5, description: "Creamy tomato-based chicken curry" },
        { id: 12, name: "Paneer Tikka Masala", price: 239, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=200&h=150&fit=crop", category: "north-indian", rating: 4.2, description: "Cottage cheese in rich gravy" },
        { id: 13, name: "Naan Bread", price: 49, image: "https://images.unsplash.com/photo-1574653495307-8b4b04a2b53e?w=200&h=150&fit=crop", category: "north-indian", rating: 4.0, description: "Soft, fluffy Indian bread" }
      ]
    },
    {
      id: 5,
      name: "Bake Palace",
      cuisine: "North Indian, Chinese, Beverages, Desserts",
      rating: 4.3,
      deliveryTime: "30-35 min",
      distance: "3.2 km",
      image: "https://tse2.mm.bing.net/th/id/OIP._jFTu2RlxXGWUJaAnSeHywHaE8?pid=Api&P=0&h=180",
      offers: ["Free Delivery"],
      costForTwo: 450,
      categories: ['north-indian', 'chinese', 'beverages', 'desserts'],
      menu: [
        { id: 14, name: "Chocolate Cake", price: 199, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=150&fit=crop", category: "desserts", rating: 4.5, description: "Rich chocolate layer cake" },
        { id: 15, name: "Hakka Noodles", price: 179, image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=200&h=150&fit=crop", category: "chinese", rating: 4.2, description: "Stir-fried noodles with vegetables" },
        { id: 16, name: "Fresh Juice", price: 89, image: "https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=200&h=150&fit=crop", category: "beverages", rating: 4.0, description: "Freshly squeezed fruit juice" }
      ]
    }
  ];

  // Show toast notification
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  // Add to cart
  const addToCart = (item, restaurant) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1, restaurantName: restaurant.name }];
    });
    showToast(`${item.name} added to cart!`);
  };

  // Remove from cart
  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  // Update quantity
  const updateQuantity = (itemId, change) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + change;
          return newQuantity <= 0 ? null : { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean)
    );
  };

  // Toggle favorites
  const toggleFavorite = (restaurantId) => {
    setFavorites(prev =>
      prev.includes(restaurantId)
        ? prev.filter(id => id !== restaurantId)
        : [...prev, restaurantId]
    );
  };

  // Filter restaurants
  const filteredRestaurants = featuredRestaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = !cuisineFilter || restaurant.cuisine.toLowerCase().includes(cuisineFilter.toLowerCase());
    
    // Category filtering logic
    let matchesCategory = true;
    if (selectedCategory !== "All") {
      const categoryId = categories.find(cat => cat.name === selectedCategory)?.id;
      matchesCategory = categoryId ? restaurant.categories.includes(categoryId) : false;
    }
    
    return matchesSearch && matchesCuisine && matchesCategory;
  });

  // Calculate cart total
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #8348f0 0%, #8348f0 100%)',
        color: 'white',
        padding: '60px 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '16px',
            lineHeight: '1.2'
          }}>
            Order Food Online
          </h1>
          <p style={{
            fontSize: '20px',
            marginBottom: '32px',
            opacity: 0.9
          }}>
            Discover the best restaurants in your city
          </p>

          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            display: 'flex',
            gap: '0',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <input
              type="text"
              placeholder="Search for restaurants or cuisines..."
              style={{
                flex: 1,
                padding: '16px 20px',
                border: 'none',
                outline: 'none',
                fontSize: '16px',
                color: '#374151'
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button style={{
              background: 'white',
              color: '#dc2626',
              padding: '16px 24px',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}>
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Offers Section */}
      <div style={{
        background: 'white',
        padding: '30px 0',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '20px',
            color: '#1f2937'
          }}>Special Offers</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px'
          }}>
            {offers.map((offer) => (
              <div key={offer.id} style={{
                background: `linear-gradient(135deg, ${offer.color} 0%, ${offer.color}dd 100%)`,
                color: 'white',
                padding: '20px',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px'
                }}>
                  <Percent size={24} />
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    margin: 0
                  }}>{offer.title}</h3>
                </div>
                <p style={{
                  fontSize: '14px',
                  margin: '0 0 8px 0',
                  opacity: 0.9
                }}>{offer.subtitle}</p>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  background: 'rgba(255,255,255,0.2)',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  display: 'inline-block'
                }}>
                  Code: {offer.code}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div style={{
        background: 'white',
        padding: '20px 0',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '16px',
            paddingBottom: '8px'
          }}>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  background: selectedCategory === category.name ? '#fee2e2' : '#f9fafb',
                  color: selectedCategory === category.name ? '#dc2626' : '#6b7280',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  minWidth: '100px',
                  fontWeight: selectedCategory === category.name ? '600' : '500'
                }}
              >
                <img 
                  src={category.icon} 
                  alt={category.name}
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: selectedCategory === category.name ? '2px solid #dc2626' : '2px solid transparent'
                  }} 
                />
                <span style={{ fontSize: '14px', whiteSpace: 'nowrap' }}>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {/* Filters */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: 0
          }}>
            {selectedCategory === "All" ? "Featured Restaurants" : `${selectedCategory} Restaurants`}
          </h2>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select
              style={{
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                padding: '8px 12px',
                outline: 'none',
                cursor: 'pointer'
              }}
              value={cuisineFilter}
              onChange={(e) => setCuisineFilter(e.target.value)}
            >
              <option value="">All Cuisines</option>
              <option value="Biryani">Biryani</option>
              <option value="Pizza">Pizza</option>
              <option value="Burger">Burger</option>
              <option value="North Indian">North Indian</option>
              <option value="Beverages">Beverages</option>
              <option value="Chinese">Chinese</option>
              <option value="Desserts">Desserts</option>
            </select>
            {cartCount > 0 && (
              <button
                onClick={() => setShowCart(true)}
                style={{
                  position: 'relative',
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
                }}
              >
                <ShoppingCart size={20} />
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#fbbf24',
                  color: 'white',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {cartCount}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Restaurant Cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f4f6',
              borderTop: '4px solid #dc2626',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p>Loading restaurants...</p>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 0',
            color: '#6b7280'
          }}>
            <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>No restaurants found</h3>
            <p>Try selecting a different category or adjusting your search terms.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px'
          }}>
            {filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                  overflow: 'hidden',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  border: '1px solid #f3f4f6'
                }}
                onClick={() => setSelectedRestaurant(restaurant)}
              >
                <div style={{ position: 'relative' }}>
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover'
                    }}
                  />
                  {restaurant.popular && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: '#dc2626',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Award size={12} />
                      Popular
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(restaurant.id);
                    }}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(255,255,255,0.9)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Heart
                      size={16}
                      color={favorites.includes(restaurant.id) ? '#dc2626' : '#6b7280'}
                      fill={favorites.includes(restaurant.id) ? '#dc2626' : 'none'}
                    />
                  </button>
                </div>

                <div style={{ padding: '20px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px'
                  }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#1f2937',
                      margin: 0,
                      flex: 1
                    }}>
                      {restaurant.name}
                    </h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: '#10b981',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      <Star size={14} fill="currentColor" />
                      {restaurant.rating}
                    </div>
                  </div>

                  <p style={{
                    color: '#6b7280',
                    marginBottom: '12px',
                    fontSize: '14px'
                  }}>
                    {restaurant.cuisine}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                    fontSize: '14px',
                    color: '#6b7280'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} />
                      {restaurant.deliveryTime}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} />
                      {restaurant.distance}
                    </div>
                    <div>
                      ₹{restaurant.costForTwo} for two
                    </div>
                  </div>

                  {restaurant.offers && restaurant.offers.length > 0 && (
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      marginBottom: '16px'
                    }}>
                      {restaurant.offers.map((offer, index) => (
                        <span
                          key={index}
                          style={{
                            background: '#fef3c7',
                            color: '#d97706',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                        >
                          {offer}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRestaurant(restaurant);
                    }}
                    style={{
                      width: '100%',
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                  >
                    View Menu
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Restaurant Menu Modal */}
      {selectedRestaurant && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          zIndex: 1000,
          overflow: 'auto'
        }} onClick={() => setSelectedRestaurant(null)}>
          <div style={{
            background: 'white',
            margin: '20px auto',
            maxWidth: '800px',
            borderRadius: '16px',
            overflow: 'hidden'
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* Restaurant Header */}
            <div style={{
              position: 'relative',
              height: '250px',
              background: `url(${selectedRestaurant.image}) center/cover`
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.7))'
              }}></div>
              <button
                onClick={() => setSelectedRestaurant(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                color: 'white'
              }}>
                <h1 style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  margin: '0 0 8px 0'
                }}>
                  {selectedRestaurant.name}
                </h1>
                <p style={{
                  fontSize: '16px',
                  margin: '0 0 8px 0',
                  opacity: 0.9
                }}>
                  {selectedRestaurant.cuisine}
                </p>
                <div style={{
                  display: 'flex',
                  gap: '20px',
                  fontSize: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={16} fill="currentColor" />
                    {selectedRestaurant.rating}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={16} />
                    {selectedRestaurant.deliveryTime}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Truck size={16} />
                    {selectedRestaurant.distance}
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div style={{ padding: '30px' }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '24px',
                color: '#1f2937'
              }}>
                Menu Items
              </h2>
              
              <div style={{
                display: 'grid',
                gap: '20px'
              }}>
                {selectedRestaurant.menu.map((item) => (
                  <div key={item.id} style={{
                    display: 'flex',
                    gap: '20px',
                    padding: '16px',
                    border: '1px solid #f3f4f6',
                    borderRadius: '12px',
                    transition: 'all 0.2s'
                  }}>
                    
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '120px',
                        height: '90px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                    
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '8px'
                      }}>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#1f2937',
                          margin: 0
                        }}>
                          {item.name}
                        </h3>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: '#10b981',
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          <Star size={12} fill="currentColor" />
                          {item.rating}
                        </div>
                      </div>
                      
                      <p style={{
                        color: '#6b7280',
                        fontSize: '14px',
                        margin: '0 0 12px 0',
                        lineHeight: '1.4'
                      }}>
                        {item.description}
                      </p>
                      
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{
                          fontSize: '20px',
                          fontWeight: 'bold',
                          color: '#dc2626'
                        }}>
                          ₹{item.price}
                        </span>
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          {cart.find(cartItem => cartItem.id === item.id) ? (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              background: '#dc2626',
                              borderRadius: '8px',
                              padding: '4px'
                            }}>
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                style={{
                                  background: 'white',
                                  color: '#dc2626',
                                  border: 'none',
                                  borderRadius: '4px',
                                  width: '28px',
                                  height: '28px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  fontWeight: 'bold'
                                }}
                              >
                                <Minus size={14} />
                              </button>
                              <span style={{
                                color: 'white',
                                fontWeight: '600',
                                minWidth: '20px',
                                textAlign: 'center'
                              }}>
                                {cart.find(cartItem => cartItem.id === item.id)?.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                style={{
                                  background: 'white',
                                  color: '#dc2626',
                                  border: 'none',
                                  borderRadius: '4px',
                                  width: '28px',
                                  height: '28px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  fontWeight: 'bold'
                                }}
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(item, selectedRestaurant)}
                              style={{
                                background: '#dc2626',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.2s'
                              }}
                            >
                              <Plus size={14} />
                              Add
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shopping Cart Modal */}
      {showCart && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} onClick={() => setShowCart(false)}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #f3f4f6',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                margin: 0,
                color: '#1f2937'
              }}>
                Your Cart ({cartCount} items)
              </h2>
              <button
                onClick={() => setShowCart(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={24} color="#6b7280" />
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              {cart.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 0',
                  color: '#6b7280'
                }}>
                  <ShoppingCart size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '20px' }}>
                    {cart.map((item) => (
                      <div key={item.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 0',
                        borderBottom: '1px solid #f3f4f6'
                      }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            margin: '0 0 4px 0',
                            color: '#1f2937'
                          }}>
                            {item.name}
                          </h4>
                          <p style={{
                            fontSize: '14px',
                            color: '#6b7280',
                            margin: 0
                          }}>
                            {item.restaurantName}
                          </p>
                          <p style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#dc2626',
                            margin: '4px 0 0 0'
                          }}>
                            ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                          </p>
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: '#f3f4f6',
                            borderRadius: '8px',
                            padding: '4px'
                          }}>
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              style={{
                                background: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                width: '28px',
                                height: '28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: '#dc2626'
                              }}
                            >
                              <Minus size={14} />
                            </button>
                            <span style={{
                              fontWeight: '600',
                              minWidth: '20px',
                              textAlign: 'center'
                            }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              style={{
                                background: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                width: '28px',
                                height: '28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: '#dc2626'
                              }}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(item.id)}
                            style={{
                              background: '#fee2e2',
                              color: '#dc2626',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    borderTop: '2px solid #f3f4f6',
                    paddingTop: '20px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '20px'
                    }}>
                      <span style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#1f2937'
                      }}>
                        Total: ₹{cartTotal}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => {
                        showToast('Order placed successfully!');
                        setCart([]);
                        setShowCart(false);
                      }}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '16px',
                        borderRadius: '12px',
                        fontSize: '18px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      Place Order
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#10b981',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 1100,
          animation: 'slideInRight 0.3s ease-out'
        }}>
          {toast}
        </div>
      )}

      {/* CSS Animations */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          * {
            box-sizing: border-box;
          }
          
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
          
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: #dc2626;
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: #b91c1c;
          }
        `}
      </style>
    </div>
  );
};

export default Home;