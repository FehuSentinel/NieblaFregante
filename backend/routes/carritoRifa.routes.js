import { Router } from 'express';
import {
  agregarNumerosAlCarrito,
  verCarrito,
  eliminarNumeroDelCarrito
} from '../controllers/carritoRifa.controller.js';
import { verificarToken } from '../middlewares/authentication.js';

const router = Router();

// ✅ Agregar número al carrito con reserva temporal
router.post('/agregar', verificarToken, agregarNumerosAlCarrito);

// ✅ Ver contenido del carrito
router.get('/', verificarToken, verCarrito);

// ✅ Eliminar un número del carrito
router.delete('/:idNumero', verificarToken, eliminarNumeroDelCarrito);

export default router;
