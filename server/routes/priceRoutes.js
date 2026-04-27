const express = require('express');
const router = express.Router();
const Price = require('../models/Price');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const prices = await Price.find().sort({ createdAt: -1 });
    res.json(prices);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Sync multiple prices from Auto-Learn
router.post('/sync', auth, async (req, res) => {
  try {
    const items = req.body; // Array of { description, make, unitRate }
    for (const item of items) {
      if (!item.description) continue;
      
      let price = await Price.findOne({ description: item.description, make: item.make || '-' });
      if (price) {
        if (price.unitRate !== item.unitRate) {
          price.unitRate = item.unitRate;
          await price.save();
        }
      } else {
        const newPrice = new Price({
          description: item.description,
          make: item.make || '-',
          unitRate: item.unitRate
        });
        await newPrice.save();
      }
    }
    const allPrices = await Price.find().sort({ createdAt: -1 });
    res.json(allPrices);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const newPrice = new Price(req.body);
    const price = await newPrice.save();
    res.json(price);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const price = await Price.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(price);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Price.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Price removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
