import express from 'express';
import authRoutes from './routes/auth.routes.js';
import usuarioRoutes from './routes/usuario.routes.js';
import cors from 'cors';
import sequelize from './config/database.js';
import errorHandler from './middlewares/errorHandler.js';
import { crearAdminInicial } from './controllers/auth.controller.js';


import categoriaRoutes from './routes/categoriaProducto.routes.js';
import carritoRifaRoutes from './routes/carritoRifa.routes.js';
import rifaRoutes from './routes/rifa.routes.js';

import pagoRoutes from './routes/pago.routes.js';
import carritoRoutes from './routes/carrito.routes.js';
//import webpayProductosRoutes from './routes/webpayProductos.routes.js';
import direccionRoutes from './routes/direccion.routes.js';
import pedidoRoutes from './routes/pedido.routes.js';
import boletaRoutes from './routes/boleta.routes.js';
import productoRoutes from './routes/producto.routes.js';
import { seedCategorias } from './seed/seedCategorias.js';
import { seedCiudades } from './seed/seedCiudad.js';
import { seedComunas } from './seed/seedComuna.js';
import ciudadRoutes from './routes/ciudad.routes.js';
import comunaRoutes from './routes/comuna.routes.js';
import promocionRoutes from './routes/promocion.routes.js';


import path from 'path'; 



// Importación de path y fileURLToPath
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Configuración de __dirname en módulos ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

// Configuración para servir archivos estáticos (imágenes)
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));
app.use('/uploads/promociones', express.static(path.join(__dirname, 'uploads/promociones')));


// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Rutas públicas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/carrito-rifa', carritoRifaRoutes);
app.use('/api/rifas', rifaRoutes);
app.use('/api/pago', pagoRoutes);
app.use('/api/carrito', carritoRoutes);
//app.use('/api/webpay-productos', webpayProductosRoutes);
app.use('/api/direcciones', direccionRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/boletas', boletaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/ciudades', ciudadRoutes);
app.use('/api', comunaRoutes);
app.use('/api/promos', promocionRoutes);





// Middleware para manejar errores
app.use(errorHandler);


// ✅ Arranque limpio
// Sincronizar la base de datos
const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    await sequelize.sync();
    console.log("✅ Base de datos sincronizada correctamente.");

    await crearAdminInicial();

    await seedCategorias();

    await seedCiudades();
    await seedComunas();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar la app:", error);
  }
};

start();

export default app;
