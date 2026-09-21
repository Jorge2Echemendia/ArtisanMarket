// routes/shop.js
const express = require('express');
const router = express.Router();
const products = require('../data/products');

router.get('/', (req, res) => {
  const { q, categoria, max } = req.query;
  let filtered = [...products];

  if (q) {
    const term = q.toLowerCase();
    filtered = filtered.filter(p =>
      p.nombre.toLowerCase().includes(term) ||
      p.descripcion.toLowerCase().includes(term)
    );
  }
  if (categoria) {
    filtered = filtered.filter(p => p.categoria === categoria);
  }
  if (max) {
    filtered = filtered.filter(p => p.precio <= Number(max));
  }

  const categorias = [...new Set(products.map(p => p.categoria))];

  res.render('shop', {
    title: 'Tienda — ArtisanMarket',
    productos: filtered,
    categorias,
    filtros: { q: q || '', categoria: categoria || '', max: max || '' }
  });
});

router.get('/:id', (req, res) => {
  const producto = products.find(p => p.id === Number(req.params.id));
  if (!producto) return res.status(404).render('404', { title: 'Producto no encontrado' });

  const relacionados = products.filter(p => p.categoria === producto.categoria && p.id !== producto.id).slice(0, 3);
  res.render('product', { title: `${producto.nombre} — ArtisanMarket`, producto, relacionados });
});

module.exports = router;