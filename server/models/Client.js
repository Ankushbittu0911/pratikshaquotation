const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  address: { type: String },
  gstNumber: { type: String },
  contactPerson: { type: String },
  phone: { type: String },
  email: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Client', ClientSchema);
