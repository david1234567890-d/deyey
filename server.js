app.get('/', (req, res) => {
  res.json({ 
    message: 'Dye Kulture API is working! 🚀',
    endpoints: {
      health: 'GET /api/health',
      test: 'GET /api/test',

      products: {
        all: 'GET /api/products',
        single: 'GET /api/products/:id',
        byCategory: 'GET /api/products/category/:category'
      },

      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },

      cart: {
        getUserCart: 'GET /api/cart/:userId',
        addItem: 'POST /api/cart/add',
        removeItem: 'DELETE /api/cart/:userId/:productId'
      },

      // 🔮 Future endpoints (placeholders)
      orders: {
        createOrder: 'POST /api/orders',
        getUserOrders: 'GET /api/orders/:userId',
        getOrderDetails: 'GET /api/orders/details/:orderId'
      },

      payments: {
        initiatePayment: 'POST /api/payments/initiate',
        verifyPayment: 'POST /api/payments/verify',
        getPaymentHistory: 'GET /api/payments/:userId'
      },

      profile: {
        getProfile: 'GET /api/profile/:userId',
        updateProfile: 'PUT /api/profile/:userId'
      }
    },
    documentation: 'All API endpoints start with /api/'
  });
});