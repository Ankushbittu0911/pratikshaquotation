const mongoose = require('mongoose');

const QuotationSchema = new mongoose.Schema({
  refNo: { type: String, required: true, unique: true },
  project: { type: String, required: true },
  client: { type: String }, // formatted string or could be ref
  date: { type: String },
  revision: { type: String },
  sections: { type: Array, default: [] }, // complex BOM array
  terms: { type: Array, default: [] },
  offerCost: { type: Number, default: 0 },
  pdfUrl: { type: String }, // Cloudinary link
}, { timestamps: true });

module.exports = mongoose.model('Quotation', QuotationSchema);
