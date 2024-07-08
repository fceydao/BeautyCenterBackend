// routes/products.js
const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Add product
router.post('/', async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const product = new Product({ name, price, description });
    await product.save();
    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
