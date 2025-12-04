const express = require('express');
const Tenant = require('../models/Tenant');
const auth = require('../middleware/auth');
const { roleMiddleware } = require('../middleware/roles');
const Joi = require('joi');
const router = express.Router();

// Protect all routes
router.use(auth);
router.use(roleMiddleware(['superAdmin']));

// List tenants
router.get('/tenants', async (req, res) => {
  try {
    const tenants = await Tenant.find().populate('ownerId', 'email');
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle tenant status
const toggleSchema = Joi.object({ status: Joi.string().valid('active', 'inactive').required() });

router.patch('/tenant/:id/toggle-status', async (req, res) => {
  const { error } = toggleSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
    
    tenant.status = tenant.status === 'active' ? 'inactive' : 'active';
    await tenant.save();
    
    res.json({ message: `Tenant ${tenant.status}`, tenant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
