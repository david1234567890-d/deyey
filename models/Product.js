javascript
const { pool } = require('../config/database');

const Product = {
  // Get all products
  findAll: async () => {
    const result = await pool.query(
      'SELECT * FROM products ORDER BY created_at DESC'
    );
    return result.rows;
  },

  // Find product by ID
  findById: async (id) => {
    const result = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  // Get products by category
  findByCategory: async (category) => {
    const result = await pool.query(
      'SELECT * FROM products WHERE category = $1 ORDER BY created_at DESC',
      [category]
    );
    return result.rows;
  },

  // Search products
  search: async (query) => {
    const result = await pool.query(
      `SELECT * FROM products 
       WHERE name ILIKE $1 OR description ILIKE $1 
       ORDER BY created_at DESC`,
      [`%${query}%`]
    );
    return result.rows;
  }
};

module.exports = Product;