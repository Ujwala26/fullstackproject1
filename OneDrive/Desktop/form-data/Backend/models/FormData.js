const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  message: { type: String, required: true },
  goal: { type: String, required: true },
  year: { type: String, required: true },
  college: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('FormData', formSchema);
