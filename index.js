require('dotenv').config({ path: './datos.env' });
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const productosRoutes = require('./routes/productsRoutes');
const verifyToken = require('./controllers/authMiddleware');
const adminOnly = require('./controllers/adminMiddleware');

const app = express();

app.use(express.json());
app.use(cors()); 


app.use('/api/auth', authRoutes);

// Rutas de productos protegidas por middleware de autenticación y administrador
app.use('/api/productos', verifyToken, adminOnly, productosRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

// cambios