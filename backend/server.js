const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const Product  = require('./models/Product');

const app  = express();
const PORT = process.env.PORT || 3000;

// -- MIDDLEWARES --
app.use(cors());
app.use(express.json());

// -- CONEXIÓN A MONGODB ATLAS --
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch((err) => {
    console.error('❌ Error de conexión:', err.message);
    process.exit(1);
  });

// -- READ ALL: GET /api/products --
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -- READ ONE: GET /api/products/:id --
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

// -- CREATE: POST /api/products --
app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved   = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -- UPDATE: PUT /api/products/:id --
app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product)
      return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -- DELETE: DELETE /api/products/:id --
app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -- INICIAR SERVIDOR --
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});