const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample products data
const products = [
  {
    id: 1,
    name: "Urban Graphic Tee",
    description: "Premium quality cotton t-shirt with unique graphic print",
    price: 25.00,
    image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    category: "T-Shirts",
    rating: 4.5,
    review_count: 42
  },
  {
    id: 2,
    name: "Slim Fit Denim Jeans",
    description: "Comfortable and stylish slim fit jeans",
    price: 40.00,
    image_url: "https://images.unsplash.com/photo-1542272604-787c3835535d",
    category: "Jeans",
    rating: 4.0,
    review_count: 38
  },
  {
    id: 3,
    name: "Classic White Sneakers",
    description: "Versatile white sneakers for everyday wear",
    price: 55.00,
    image_url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa",
    category: "Shoes",
    rating: 5.0,
    review_count: 56
  },
  {
    id: 4,
    name: "Urban Denim Jacket",
    description: "Trendy denim jacket for all seasons",
    price: 65.00,
    image_url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea",
    category: "Jackets",
    rating: 4.5,
    review_count: 24
  }
];

// In-memory storage for demo (replace with database in production)
let users = [];
let cart = [];

// ==================== HEALTH & TEST ENDPOINTS ====================
app.get('/', (req, res) => {
  res.json({ 
    message: 'Dye Kulture API is working! 🚀',
    endpoints: [
      'GET /api/health',
      'GET /api/products',
      'GET /api/products/:id',
      'GET /api/products/category/:category',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/cart/:userId',
      'POST /api/cart/add',
      'DELETE /api/cart/:userId/:productId'
    ],
    documentation: 'Add /api/ to any endpoint path'
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Dye Kulture API test successful!',
    version: '1.0.0',
    status: 'active'
  });
});

// ==================== PRODUCT ENDPOINTS ====================
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  res.json(product);
});

app.get('/api/products/category/:category', (req, res) => {
  const category = req.params.category;
  const filteredProducts = products.filter(p => 
    p.category.toLowerCase() === category.toLowerCase()
  );
  
  res.json(filteredProducts);
});

// ==================== AUTH ENDPOINTS ====================
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password, // In real app, hash this password
      isVerified: false,
      createdAt: new Date()
    };
    
    users.push(newUser);
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        isVerified: newUser.isVerified
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ==================== CART ENDPOINTS ====================
app.get('/api/cart/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const userCart = cart.filter(item => item.userId === userId);
  
  // Add product details to cart items
  const cartWithProducts = userCart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      ...item,
      product: product ? {
        name: product.name,
        price: product.price,
        image_url: product.image_url
      } : null
    };
  });
  
  res.json(cartWithProducts);
});

app.post('/api/cart/add', (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;
    
    if (!userId || !productId) {
      return res.status(400).json({ message: 'User ID and Product ID are required' });
    }
    
    // Check if product exists
    const product = products.find(p => p.id === productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if item already in cart
    const existingItemIndex = cart.findIndex(
      item => item.userId === userId && item.productId === productId
    );
    
    if (existingItemIndex >= 0) {
      // Update quantity
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.push({
        id: cart.length + 1,
        userId,
        productId,
        quantity,
        addedAt: new Date()
      });
    }
    
    res.json({ 
      message: 'Item added to cart successfully',
      cartItem: {
        userId,
        productId,
        quantity: existingItemIndex >= 0 ? cart[existingItemIndex].quantity : quantity
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/api/cart/:userId/:productId', (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const productId = parseInt(req.params.productId);
    
    const initialLength = cart.length;
    cart = cart.filter(item => !(item.userId === userId && item.productId === productId));
    
    if (cart.length === initialLength) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    
    res.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    message: 'API endpoint not found',
    suggestion: 'Check / endpoint for available endpoints' 
  });
});

// General 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Endpoint not found',
    note: 'API endpoints start with /api/',
    example: `${req.protocol}://${req.get('host')}/api/health`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Dye Kulture server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📋 API docs: http://localhost:${PORT}/`);
});