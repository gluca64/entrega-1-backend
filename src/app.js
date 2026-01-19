const express = require('express');
const { engine } = require('express-handlebars');
const productsRouter = require('./routes/products.routes');
const cartsRouter = require('./routes/carts.routes');
const viewsRouter = require('./routes/views.routes');
const socketHandlers = require('./managers/socketManager');

const app = express();
const PORT = 8080;

// configurar handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// iniciar servidor
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});

// configurar socket.io
const io = require('socket.io')(server);

// pasar io a las rutas de productos para que emita eventos
productsRouter.setIO(io);

// inicializar manejador de websockets
socketHandlers(io);

module.exports = { app, io };
