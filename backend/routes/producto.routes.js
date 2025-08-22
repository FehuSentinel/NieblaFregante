import { Router } from 'express';
import {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarProducto,
  actualizarStockProducto,
  eliminarProducto,
  aplicarPromocion,
  eliminarPromocion
} from '../controllers/producto.controller.js';

import { verificarToken } from '../middlewares/authentication.js';
import { verificarTrabajador } from '../middlewares/roles.js';
import upload from '../middlewares/multer.js';

const router = Router();

// Rutas públicas
router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoPorId);

// Rutas protegidas para trabajadores
router.post('/', verificarToken, verificarTrabajador, upload.single('imagen'), crearProducto);
router.put('/:id', verificarToken, verificarTrabajador, upload.single('imagen'), actualizarProducto);
router.put('/:id/stock', verificarToken, verificarTrabajador, actualizarStockProducto);
router.delete('/:id', verificarToken, verificarTrabajador, eliminarProducto);

// Nuevas rutas para promociones
router.put('/:id/promocion', verificarToken, verificarTrabajador, aplicarPromocion);
router.delete('/:id/promocion', verificarToken, verificarTrabajador, eliminarPromocion);

export default router;
