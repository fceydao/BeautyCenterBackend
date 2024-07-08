// routes/orders.js
const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// Place order
router.post('/', async (req, res) => {
  try {
    const { userId, productId, date, total } = req.body;
    const order = new Order({ userId, productId, date, total });
    await order.save();
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
