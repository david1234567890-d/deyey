javascript
const Cart = require('../models/Cart');

const cartController = {
  // Get user's cart
  getCart: async (req, res) => {
    try {
      const userId = req.user.id;
      const cartItems = await Cart.findByUserId(userId);
      res.json(cartItems);
    } catch (error) {
      console.error('Get cart error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Add item to cart
  addToCart: async (req, res) => {
    try {
      const userId = req.user.id;
      const { productId, quantity } = req.body;

      const cartItem = await Cart.addItem(userId, productId, quantity || 1);
      
      res.status(201).json({ 
        message: 'Item added to cart', 
        cartItem 
      });
    } catch (error) {
      console.error('Add to cart error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Update cart item quantity
  updateCartItem: async (req, res) => {
    try {
      const userId = req.user.id;
      const { productId } = req.params;
      const { quantity } = req.body;

      if (quantity < 1) {
        return res.status(400).json({ message: 'Quantity must be at least 1' });
      }

      const cartItem = await Cart.updateQuantity(userId, productId, quantity);
      
      if (!cartItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
      
      res.json({ 
        message: 'Cart item updated', 
        cartItem 
      });
    } catch (error) {
      console.error('Update cart error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Remove item from cart
  removeFromCart: async (req, res) => {
    try {
      const userId = req.user.id;
      const { productId } = req.params;

      await Cart.removeItem(userId, productId);
      
      res.json({ message: 'Item removed from cart' });
    } catch (error) {
      console.error('Remove from cart error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Clear cart
  clearCart: async (req, res) => {
    try {
      const userId = req.user.id;
      await Cart.clear(userId);
      
      res.json({ message: 'Cart cleared' });
    } catch (error) {
      console.error('Clear cart error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = cartController;