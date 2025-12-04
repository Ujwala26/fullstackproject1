const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const connectDB = require('./config/db');

const User=require('./models/User');
const Tenant=require('./models/Tenant');

const errorHandler=require('./middleware/error')
const app = express();
connectDB();

const mongoose = require('mongoose');

const seedSuperAdmin = async () => {
  try {
    const superAdmin = await User.findOne({ role: 'superAdmin' });
    if (!superAdmin) {
      // Use a fixed ObjectId for super admin (valid 24-char hex)
      const superAdminTenantId = new mongoose.Types.ObjectId('000000000000000000000001');
      
      await User.create({
        email: 'superadmin@company.com',
        password: 'superpass123',
        role: 'superAdmin',
        tenantId: superAdminTenantId
      });
      console.log('Super admin seeded with tenantId:', superAdminTenantId);
    }
  } catch (error) {
    console.error('Super admin seeding failed:', error);
  }
};
seedSuperAdmin();


app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(errorHandler);

app.use("/api/auth", require("./routes/auth"));

app.use('/api/superadmin', require('./routes/superadmin'));

app.get('/', (req, res) => res.send('API Running'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
