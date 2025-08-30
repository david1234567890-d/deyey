javascript
const { pool } = require('../config/database');

const Cart = {
  // Get user's cart
  findByUserId: async (userId) => {
    const result = await pool.query(
      `SELECT c.*, p.name, p.price, p.image_url 
       FROM cart c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = $1`,
      [userId]
    );
    return result.rows;
  },

  // Add item to cart
  addItem: async (userId, productId, quantity = 1) => {
    // Check if item already exists in cart
    const existingItem = await pool.query(
      'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    if (existingItem.rows.length > 0) {
      // Update quantity if item exists
      const result = await pool.query(
        'UPDATE cart SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
        [quantity, userId, productId]
      );
      return result.rows[0];
    } else {
      // Add new item to cart
      const result = await pool.query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
        [userId, productId, quantity]
      );
      return result.rows[0];
    }
  },

  // Update cart item quantity
  updateQuantity: async (userId, productId, quantity) => {
    const result = await pool.query(
      'UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
      [quantity, userId, productId]
    );
    return result.rows[0];
  },

  // Remove item from cart
  removeItem: async (userId, productId) => {
    await pool.query(
      'DELETE FROM cart WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );
  },

  // Clear user's cart
  clear: async (userId) => {
    await pool.query(
      'DELETE FROM cart WHERE user_id = $1',
      [userId]
    );
  }
};

module.exports = Cart;