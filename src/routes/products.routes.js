const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');

const productManager = new ProductManager();
let io = null;

// para pasar el io cuando se inicialize
function setIO(socketIO) {
    io = socketIO;
}

// GET / - listar todos los productos
router.get('/', (req, res) => {
    try {
        const productos = productManager.getProducts();
        res.json({ status: 'success', products: productos });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// GET /:pid - obtener producto por id
router.get('/:pid', (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const producto = productManager.getProductById(id);
        
        if (!producto) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
        
        res.json({ status: 'success', product: producto });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// POST / - agregar nuevo producto
router.post('/', (req, res) => {
    try {
        const nuevoProducto = productManager.addProduct(req.body);
        
        // emitir a todos los clientes websocket
        if (io) {
            io.emit('nuevoProducto', nuevoProducto);
            io.emit('productsLoad', productManager.getProducts());
        }
        
        res.status(201).json({ status: 'success', product: nuevoProducto });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

// PUT /:pid - actualizar producto
router.put('/:pid', (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const productoActualizado = productManager.updateProduct(id, req.body);
        
        if (!productoActualizado) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
        
        // emitir actualización
        if (io) {
            io.emit('productsLoad', productManager.getProducts());
        }
        
        res.json({ status: 'success', product: productoActualizado });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// DELETE /:pid - eliminar producto
router.delete('/:pid', (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const eliminado = productManager.deleteProduct(id);
        
        if (!eliminado) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
        
        // emitir cambio a todos los clientes
        if (io) {
            io.emit('productoEliminado', id);
            io.emit('productsLoad', productManager.getProducts());
        }
        
        res.json({ status: 'success', message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;
module.exports.setIO = setIO;
