const express = require('express');
const cors = require('cors');

const app = express();

// Middleware básico
app.use(cors());
app.use(express.json());

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Error interno del servidor',
        details: err.message
    });
});

// Ruta de prueba básica
app.get('/api/test', (req, res) => {
    res.json({ message: 'API funcionando' });
});

// Tu ruta de categorías
app.get('/api/categorias/public', async (req, res) => {
    try {
        console.log('Accediendo a /api/categorias/public');
        // tu lógica aquí
        res.json({ message: 'Endpoint de categorías' });
    } catch (error) {
        console.error('Error en categorías:', error);
        res.status(500).json({
            error: 'Error en categorías',
            details: error.message
        });
    }
});

// Para Vercel, necesitamos exportar app en lugar de usar app.listen
module.exports = app; 