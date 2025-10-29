const express = require('express');
const router = express.Router();
const FormData = require('../models/FormData');

router.post('/', async (req, res) => {
  try {
    // Destructure all fields that your new schema requires
    const { name, email, message, goal, year, college } = req.body;

    // Create a new document with all required fields
    const newEntry = new FormData({ name, email, message, goal, year, college });

    // Save to MongoDB
    await newEntry.save();

    res.status(201).json({ success: true, data: newEntry });
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
