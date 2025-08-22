 // routes/pedido.routes.js
import { Router } from 'express';
import {
  crearPedido,
  obtenerPedidosUsuario,
  obtenerPedidos,
  obtenerPedidoPorId,
  cambiarEstadoPedido
} from '../controllers/pedido.controller.js';
import { verificarToken } from '../middlewares/authentication.js';

const router = Router();

// ✅ Crear pedido (invitado o usuario logueado)
router.post('/', crearPedido);

// ✅ Obtener pedidos del usuario logueado
router.get('/mios', verificarToken, obtenerPedidosUsuario);

// ✅ Obtener todos los pedidos (modo admin)
router.get('/', verificarToken, obtenerPedidos); // ⚠️ Aquí podrías agregar middleware de rol admin si lo tienes

// ✅ Obtener un pedido específico por ID (solo si pertenece al usuario logueado o si es admin)
router.get('/:id', verificarToken, obtenerPedidoPorId);

// ✅ Cambiar estado del pedido (admin)
router.put('/:id/estado', verificarToken, cambiarEstadoPedido); // ⚠️ También puedes restringir esto a admin

export default router;
