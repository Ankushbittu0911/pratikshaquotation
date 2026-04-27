const express = require('express');
const router = express.Router();
const Quotation = require('../models/Quotation');
const auth = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pratiksha_quotations',
    format: async (req, file) => 'pdf',
    resource_type: 'raw', // for PDFs
  },
});
const upload = multer({ storage: storage });

router.get('/', auth, async (req, res) => {
  try {
    const quotes = await Quotation.find().sort({ createdAt: -1 });
    res.json(quotes);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const newQuote = new Quotation(req.body);
    const quote = await newQuote.save();
    res.json(quote);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const quote = await Quotation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(quote);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Upload PDF to Cloudinary
router.post('/:id/upload-pdf', auth, upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }
    const quote = await Quotation.findByIdAndUpdate(req.params.id, { pdfUrl: req.file.path }, { new: true });
    res.json(quote);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Quotation.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Quotation removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
