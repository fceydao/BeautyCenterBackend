// routes/cart.js
const express = require('express');
const Cart = require('../models/Cart');
const router = express.Router();

// Add to cart
router.post('/add', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const cartItem = new Cart({ userId, productId });
    await cartItem.save();
    res.status(201).json({ message: 'Item added to cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
