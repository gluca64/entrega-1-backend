const socket = io();

// funcion para renderizar la lista de productos
function renderProductos(productos) {
    const container = document.getElementById('productosContainer');
    
    if (!productos || productos.length === 0) {
        container.innerHTML = '<p>No hay productos disponibles</p>';
        return;
    }

    container.innerHTML = productos.map(p => `
        <div class="product-card">
            <h3>${p.title}</h3>
            <p>${p.description}</p>
            <span class="category">${p.category}</span>
            <div class="price">$${p.price}</div>
            <p class="stock">Stock: ${p.stock}</p>
            <p>Código: ${p.code}</p>
            <button onclick="eliminarProducto(${p.id})" style="background-color: #d32f2f; color: white; padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; margin-top: 0.5rem; width: 100%;">
                Eliminar
            </button>
        </div>
    `).join('');
}

// cuando se conecta cargar los productos
socket.on('productsLoad', (productos) => {
    renderProductos(productos);
});

// escuchar nuevos productos
socket.on('nuevoProducto', (producto) => {
    console.log('Nuevo producto:', producto);
});

// escuchar productos eliminados
socket.on('productoEliminado', (id) => {
    console.log('Producto eliminado:', id);
});

// escuchar errores
socket.on('error', (datos) => {
    alert('Error: ' + datos.mensaje);
});

// formulario para agregar producto
document.getElementById('formProducto').addEventListener('submit', (e) => {
    e.preventDefault();

    const producto = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        code: document.getElementById('code').value,
        price: parseInt(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value),
        category: document.getElementById('category').value
    };

    // enviar al servidor por socket
    socket.emit('agregarProducto', producto);

    // limpiar formulario
    document.getElementById('formProducto').reset();
});

// funcion para eliminar producto
function eliminarProducto(id) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        socket.emit('eliminarProducto', id);
    }
}
