javascript
const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = {
  // Create a new user
  create: async (name, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, is_verified',
      [name, email, hashedPassword]
    );
    return result.rows[0];
  },

  // Find user by email
  findByEmail: async (email) => {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  },

  // Find user by ID
  findById: async (id) => {
    const result = await pool.query(
      'SELECT id, name, email, is_verified FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  // Verify user email
  verify: async (id) => {
    const result = await pool.query(
      'UPDATE users SET is_verified = TRUE WHERE id = $1 RETURNING id, name, email, is_verified',
      [id]
    );
    return result.rows[0];
  }
};

module.exports = User;