import { Router } from 'express';
import { verificarToken } from '../middlewares/authentication.js';
import { obtenerBoletasUsuario, obtenerBoletaPorId } from '../controllers/boleta.controller.js';

const router = Router();

router.get('/', verificarToken, obtenerBoletasUsuario);
router.get('/:id', verificarToken, obtenerBoletaPorId);

export default router;
