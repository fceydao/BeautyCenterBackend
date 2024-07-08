// routes/appointments.js
const express = require('express');
const Appointment = require('../models/Appointment');
const router = express.Router();

// Book appointment
router.post('/', async (req, res) => {
  try {
    const { userId, date, service } = req.body;
    const appointment = new Appointment({ userId, date, service });
    await appointment.save();
    res.status(201).json({ message: 'Appointment booked successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
