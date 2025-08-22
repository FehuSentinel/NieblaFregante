// routes/carrito.routes.js
import { Router } from 'express';
import {
  obtenerCarritoPorUsuario,
  agregarProductoAlCarrito,
  actualizarCantidadProducto,
  eliminarProductoDelCarrito,
  vaciarCarrito
} from '../controllers/carrito.controller.js';

import { verificarToken } from '../middlewares/authentication.js';

const router = Router();

// ✅ Obtener el carrito del usuario logueado
router.get('/:id_usuario', verificarToken, obtenerCarritoPorUsuario);

// ✅ Agregar producto al carrito
router.post('/agregar', verificarToken, agregarProductoAlCarrito);

// ✅ Actualizar cantidad de un producto
router.put('/actualizar-cantidad', verificarToken, actualizarCantidadProducto);

// ✅ Eliminar producto del carrito
router.delete('/eliminar', verificarToken, eliminarProductoDelCarrito);

// ✅ Vaciar carrito del usuario
router.delete('/vaciar/:id_usuario', verificarToken, vaciarCarrito);

export default router;
