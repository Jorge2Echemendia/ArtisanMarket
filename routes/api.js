// routes/api.js
const express = require('express');
const router = express.Router();
const products = require('../data/products');

router.get('/products', (req, res) => res.json(products));

router.get('/products/:id', (req, res) => {
  const p = products.find(x => x.id === Number(req.params.id));
  if (!p) return res.status(404).json({ error: 'No encontrado' });
  res.json(p);
});

module.exports = router;