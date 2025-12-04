const express = require('express');
const Joi = require('joi');
const User = require('../models/User');
const Tenant = require('../models/Tenant');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Register schema
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  tenantName: Joi.string().required()
});

router.post('/register', async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  
  const { email, password, tenantName } = req.body;

  try {
    // Step 1: Create tenant without ownerId initially
    const tenant = await Tenant.create({ name: tenantName });

    // Step 2: Create the owner user linked to tenant
    const user = await User.create({
      email,
      password,
      tenantId: tenant._id,
      role: 'owner'
    });

    // Step 3: Update tenant with ownerId after user creation
    tenant.ownerId = user._id;
    await tenant.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, tenantId: tenant._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, role: user.role, tenantId: tenant._id }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login schema
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

router.post('/login', async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Compare password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, tenantId: user.tenantId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, email: user.email, role: user.role, tenantId: user.tenantId }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
