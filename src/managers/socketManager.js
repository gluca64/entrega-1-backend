const ProductManager = require('../managers/ProductManager');

const productManager = new ProductManager();

function socketHandlers(io) {
    io.on('connection', (socket) => {
        console.log('Usuario conectado:', socket.id);

        // enviar lista de productos al conectar
        socket.emit('productsLoad', productManager.getProducts());

        // escuchar cuando el cliente quiere agregar producto
        socket.on('agregarProducto', (producto) => {
            try {
                const nuevoProducto = productManager.addProduct(producto);
                // notificar a todos los clientes que hay un nuevo producto
                io.emit('nuevoProducto', nuevoProducto);
                io.emit('productsLoad', productManager.getProducts());
            } catch (error) {
                socket.emit('error', { mensaje: error.message });
            }
        });

        // escuchar cuando el cliente quiere eliminar producto
        socket.on('eliminarProducto', (id) => {
            try {
                const eliminado = productManager.deleteProduct(id);
                if (eliminado) {
                    // notificar a todos los clientes
                    io.emit('productoEliminado', id);
                    io.emit('productsLoad', productManager.getProducts());
                }
            } catch (error) {
                socket.emit('error', { mensaje: error.message });
            }
        });

        socket.on('disconnect', () => {
            console.log('Usuario desconectado:', socket.id);
        });
    });
}

module.exports = socketHandlers;
