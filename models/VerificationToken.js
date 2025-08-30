javascript
const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const VerificationToken = {
  // Create a verification token
  create: async (userId) => {
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    
    const result = await pool.query(
      'INSERT INTO verification_tokens (user_id, token, expires_at) VALUES ($1, $2, $3) RETURNING *',
      [userId, token, expiresAt]
    );
    
    return result.rows[0];
  },

  // Find valid token
  findByToken: async (token) => {
    const result = await pool.query(
      'SELECT * FROM verification_tokens WHERE token = $1 AND expires_at > NOW()',
      [token]
    );
    return result.rows[0];
  },

  // Delete token after use
  delete: async (token) => {
    await pool.query(
      'DELETE FROM verification_tokens WHERE token = $1',
      [token]
    );
  }
};

module.exports = VerificationToken;