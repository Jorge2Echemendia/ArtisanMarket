// server.js
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const path = require('path');

const indexRouter = require('./routes/index');
const shopRouter = require('./routes/shop');
const apiRouter = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 4000;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');


app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', indexRouter);
app.use('/shop', shopRouter);
app.use('/api', apiRouter);

// 404
app.use((req, res) => {
  res.status(404).render('404', { title: 'Página no encontrada' });
});

app.listen(PORT, () => {
  console.log(`🧶 ArtisanMarket corriendo en http://localhost:${PORT}`);
});