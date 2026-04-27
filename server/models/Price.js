const mongoose = require('mongoose');

const PriceSchema = new mongoose.Schema({
  description: { type: String, required: true },
  make: { type: String },
  unitRate: { type: Number, required: true, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Price', PriceSchema);
