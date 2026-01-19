const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');

const productManager = new ProductManager();

// GET / - mostrar home con todos los productos
router.get('/', (req, res) => {
    try {
        const productos = productManager.getProducts();
        res.render('home', { 
            title: 'Tienda Deportiva',
            productos: productos 
        });
    } catch (error) {
        res.status(500).send('Error al cargar productos');
    }
});

// GET /realtimeproducts - mostrar vista de tiempo real
router.get('/realtimeproducts', (req, res) => {
    try {
        res.render('realTimeProducts', { 
            title: 'Productos en Tiempo Real'
        });
    } catch (error) {
        res.status(500).send('Error al cargar la página');
    }
});

module.exports = router;
