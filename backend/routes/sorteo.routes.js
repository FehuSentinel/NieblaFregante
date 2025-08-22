import { Router } from 'express';
import { realizarSorteo } from '../controllers/sorteo.controller.js';
import { verificarToken, soloTrabajador } from '../middlewares/auth.js';

const router = Router();

// Solo trabajadores pueden sortear
router.post('/:id', verificarToken, soloTrabajador, realizarSorteo);

export default router;

