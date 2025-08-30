javascript
const Product = require('../models/Product');

const productController = {
  // Get all products
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.findAll();
      res.json(products);
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get product by ID
  getProductById: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json(product);
    } catch (error) {
      console.error('Get product error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get products by category
  getProductsByCategory: async (req, res) => {
    try {
      const { category } = req.params;
      const products = await Product.findByCategory(category);
      res.json(products);
    } catch (error) {
      console.error('Get products by category error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Search products
  searchProducts: async (req, res) => {
    try {
      const { q } = req.query;
      const products = await Product.search(q);
      res.json(products);
    } catch (error) {
      console.error('Search products error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = productController;