import { Router } from 'express';
import { actualizarPerfil, obtenerUsuarioActual } from '../controllers/auth.controller.js';
import { verificarToken } from '../middlewares/authentication.js';

const router = Router();

// 👤 Obtener datos del usuario actual
router.get('/perfil', verificarToken, obtenerUsuarioActual);

// 👤 Actualizar perfil (solo usuario logueado)
router.put('/perfil', verificarToken, actualizarPerfil);

export default router;
