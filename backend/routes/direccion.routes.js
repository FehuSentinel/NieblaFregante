import { Router } from 'express';
import {
  crearDireccion,
  obtenerDirecciones,
  eliminarDireccion,
  obtenerDireccionPrincipal,
  cambiarDireccionPrincipal
} from '../controllers/direccion.controller.js';

import { verificarToken, verificarTokenOpcional } from '../middlewares/authentication.js';

const router = Router();

// ✅ Ruta que acepta invitados (usuario opcional)
router.post('/', verificarTokenOpcional, crearDireccion);

// 🔐 Solo usuarios logueados pueden ver/modificar sus direcciones
router.get('/', verificarToken, obtenerDirecciones);
router.get('/principal', verificarToken, obtenerDireccionPrincipal);
router.put('/principal/:id', verificarToken, cambiarDireccionPrincipal);
router.delete('/:id', verificarToken, eliminarDireccion);

export default router;
